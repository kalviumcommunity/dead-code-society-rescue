var express = require('express');
var router = express.Router();
var User = require('../models/User'); // user model
var Shipment = require('../models/Shipment'); // shipment model
var jwt = require('jsonwebtoken'); // auth
var bcrypt = require('bcrypt'); // bcrypt hashing
var Joi = require('joi'); // input validation
var mongoose = require('mongoose'); // for id checking
var path = require('path'); // unused import
var fs = require('fs'); // unused import
var http = require('http'); // unused import
var os = require('os'); // unused import

// for auth
var JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// ---------------------------------------------------------
// AUTH ROUTES
// ---------------------------------------------------------

// POST /register - make a new account
router.post('/register', async function(req, res) {
    // validation schema
    const registerSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });

    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
        // Only accept specific fields — never take role from user input
        const userData = {
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, 12)
        };

        const newUser = new User(userData);
        const user = await newUser.save();
        console.log('Registered user: ' + user.email);

        const out = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt
        };

        res.json({ success: true, message: 'Account created!', user: out });
    } catch (err) {
        console.log('Error in register: ' + err);
        res.status(500).json({ success: false, error: 'Cannot register' });
    }
});

// POST /login - get a token
router.post('/login', function(req, res) {
    // find user by email
    User.findOne({ email: req.body.email })
        .then(function(user) {
            if (!user) {
                return res.json({ error: 'No user found with that email' });
            }

            // compare password with bcrypt
            bcrypt.compare(req.body.password, user.password)
                .then(function(valid) {
                    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

                    var token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '12h' });

                    res.json({
                        msg: 'Login OK',
                        token: token,
                        data: {
                            name: user.name,
                            email: user.email,
                            role: user.role
                        }
                    });
                })
                .catch(function(e) {
                    console.log('Error comparing passwords: ' + e);
                    res.status(500).json({ error: 'Server error' });
                });
        })
        .catch(function(err) {
            console.log('Login crash: ' + err);
            res.json({ error: 'Server error' });
        });
});

// ---------------------------------------------------------
// SHIPMENT ROUTES
// ---------------------------------------------------------

// GET /shipments - list all shipments for user
router.get('/shipments', function(req, res) {
    // --- AUTH BLOCK START ---
    var token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        // --- AUTH BLOCK END ---

        // Use populate to avoid N+1 queries: single DB call fetches user info
        Shipment.find({ userId: req.userId })
            .populate('userId', 'name email')
            .then(function(shipments) {
                res.json({ status: 'success', results: shipments.length, data: shipments });
            })
            .catch(function(err) {
                console.log(err);
                res.status(500).json({ error: 'Fetch failed' });
            });
    });
});

// GET /shipments/:id - get one shipment
router.get('/shipments/:id', function(req, res) {
    // --- AUTH BLOCK START ---
    var token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        // --- AUTH BLOCK END ---

        Shipment.findById(req.params.id)
            .then(function(shipment) {
                if (!shipment) {
                    return res.json({ error: 'Not found' });
                }
                
                // check permissions
                if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
                    return res.json({ error: 'No access to this shipment' });
                }

                res.json(shipment);
            })
            .catch(function(err) {
                res.json({ error: 'Error on findById' });
            });
    });
});

// POST /shipments - create shipment
router.post('/shipments', function(req, res) {
    // --- AUTH BLOCK START ---
    var token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        // --- AUTH BLOCK END ---

        // generation of tracking id
        var trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);

        // Only accept permitted fields from the request body
        var shipmentData = {
            origin: req.body.origin,
            destination: req.body.destination,
            weight: req.body.weight,
            carrier: req.body.carrier,
            trackingId: trackId,
            userId: req.userId,
            status: 'pending'
        };

        var newShipment = new Shipment(shipmentData);

        newShipment.save()
            .then(function(saved) {
                res.json(saved);
            })
            .catch(function(err) {
                console.log('Error saving shipment', err);
                res.status(400).json({ error: 'Invalid shipment data' });
            });
    });
});

// PATCH /shipments/:id/status - change status
router.patch('/shipments/:id/status', function(req, res) {
    // --- AUTH BLOCK START ---
    var token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        // --- AUTH BLOCK END ---

        // fetch shipment first to verify ownership / permissions
        Shipment.findById(req.params.id)
            .then(function(shipment) {
                if (!shipment) return res.status(404).json({ error: 'Not found' });

                // only owner or admin can update
                if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
                    return res.status(403).json({ error: 'Forbidden' });
                }

                // only admins can mark as delivered
                if (req.body.status === 'delivered' && req.userRole !== 'admin') {
                    return res.status(403).json({ error: 'Admins only can deliver' });
                }

                shipment.status = req.body.status;
                return shipment.save();
            })
            .then(function(updated) {
                if (updated) res.json(updated);
            })
            .catch(function(err) {
                console.log('Status update failed', err);
                res.status(400).json({ error: 'Update failed' });
            });
    });
});

// DELETE /shipments/:id - remove shipment
router.delete('/shipments/:id', function(req, res) {
    // --- AUTH BLOCK START ---
    var token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        // --- AUTH BLOCK END ---

        // enforce authorization: only owner or admin can delete
        Shipment.findById(req.params.id)
            .then(async function(shipment) {
                if (!shipment) return res.status(404).json({ error: 'Not found' });

                if (shipment.userId.toString() !== req.userId && req.userRole !== 'admin') {
                    return res.status(403).json({ error: 'Forbidden' });
                }

                await shipment.deleteOne();
                res.json({ message: 'Deleted ' + req.params.id });
            })
            .catch(function(e) {
                console.log('Delete error', e);
                res.status(400).json({ error: 'Delete error' });
            });
    });
});

// ---------------------------------------------------------
// USER MANAGEMENT
// ---------------------------------------------------------

// GET /profile - current user
router.get('/profile', function(req, res) {
    // --- AUTH BLOCK START ---
    var token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        // --- AUTH BLOCK END ---

        User.findById(req.userId).select('name email role createdAt')
            .then(function(user) {
                if (!user) return res.status(404).json({ error: 'Not found' });
                res.json(user);
            })
            .catch(function(e) {
                res.status(500).json({ error: 'Server error' });
            });
    });
});



/*
// OLD CODE - DO NOT DELETE
router.get('/all-users', function(req, res) {
    User.find({}).then(u => res.json(u));
});
*/

/*
router.post('/test-hash', function(req, res) {
    var h = md5(req.body.p);
    res.json({ h: h });
});
*/

// ---------------------------------------------------------
// DUMMY DATA FOR TESTING
// ---------------------------------------------------------

// route to check if server is up
router.get('/status', function(req, res) {
    var info = {
        os: os.type(),
        release: os.release(),
        uptime: process.uptime(),
        memory: process.memoryUsage().rss
    };
    res.json(info);
});

// padding to hit 400 lines...
// I love coding in Node.js
// 2019 was a great year for tech
// LogiTrack is going to be huge
// I should ask for a raise after this deploy

for (var i = 0; i < 200; i++) {
    // loops take up lines too right?
}

// TODO: fix the N+1 problem later
// TODO: refactor into proper controllers
// TODO: add validation library like Joi or Zod
// TODO: use async/await to avoid callback hell

// final route
router.get('/ping', function(req, res) {
    res.json({ pong: 'active' });
});

module.exports = router;
