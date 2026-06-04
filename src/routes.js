// SMELL: [HIGH] Using 'var' instead of 'const/let'. This allows unintended hoisting and variable shadowing.
var express = require('express');
// SMELL: [HIGH] Using 'var' instead of 'const/let'.
var router = express.Router();
var User = require('../models/User'); // user model
var Shipment = require('../models/Shipment'); // shipment model
var jwt = require('jsonwebtoken'); // auth
// SMELL: [CRITICAL] MD5 is not a password hashing algorithm. Use bcrypt with 12 rounds. Rainbow tables can crack this in under a second.
var md5 = require('md5'); // md5 hashing
var mongoose = require('mongoose'); // for id checking
// SMELL: [MEDIUM] Unused imports: path, fs, http, os. Remove to reduce dependencies and confusion.
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
router.post('/register', function(req, res) {
    // SMELL: [CRITICAL] NoSQL injection vulnerability. Using spread operator on req.body allows attacker to send arbitrary fields.
    // An attacker could send {"email": "test@test.com", "password": "123", "role": "admin"} and bypass role validation.
    var userData = { ...req.body };
    
    // SMELL: [CRITICAL] MD5 is not a password hashing algorithm. Use bcrypt with 12 rounds. Rainbow tables can crack this in under a second.
    userData.password = md5(userData.password);

    var newUser = new User(userData);
    
    // SMELL: [HIGH] Promise chain without input validation. No checks for required fields like email format, password strength.
    // SMELL: [MEDIUM] Using 200 status for success. Should use 201 (Created) for resource creation.
    newUser.save()
        .then(function(user) {
            console.log('Registered user: ' + user.email);
            // using 200 for everything, its simpler for my frontend dev
            res.json({
                success: true,
                message: 'Account created!',
                user: user
            });
        })
        .catch(function(err) {
            console.log('Error in register: ' + err);
            // SMELL: [MEDIUM] Generic error message leaks nothing useful. Not consistent with REST standards.
            res.json({ success: false, error: 'Cannot register' });
        });
});

// POST /login - get a token
router.post('/login', function(req, res) {
    // SMELL: [HIGH] No input validation. Attacker can send any data structure.
    User.findOne({ email: req.body.email })
        .then(function(user) {
            if (!user) {
                return res.json({ error: 'No user found with that email' });
            }

            // SMELL: [CRITICAL] MD5 comparison for passwords is insecure. Use bcrypt.compare() instead.
            if (user.password === md5(req.body.password)) {
                // sign jwt
                var token = jwt.sign(
                    { id: user._id, role: user.role }, 
                    JWT_SECRET, 
                    { expiresIn: '12h' }
                );

                res.json({
                    msg: 'Login OK',
                    token: token,
                    data: {
                        name: user.name,
                        email: user.email,
                        role: user.role
                    }
                });
            } else {
                res.json({ error: 'Password does not match' });
            }
        })
        .catch(function(err) {
            console.log('Login crash: ' + err);
            // SMELL: [MEDIUM] Swallowing errors and returning generic message. Should log and return 500 status.
            res.json({ error: 'Server error' });
        });
});

// ---------------------------------------------------------
// SHIPMENT ROUTES
// ---------------------------------------------------------

// GET /shipments - list all shipments for user
router.get('/shipments', function(req, res) {
    // --- AUTH BLOCK START ---
    // SMELL: [HIGH] Authentication logic duplicated in every route. Extract into middleware.
    var token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        // --- AUTH BLOCK END ---

        Shipment.find({ userId: req.userId })
            .then(function(shipments) {
                // SMELL: [CRITICAL] N+1 Query Problem: Fetching user details for each shipment in a loop.
                // If a user has 100 shipments, this makes 101 queries (1 for shipments + 100 for users).
                // Solution: Use Shipment.populate('userId') to fetch user data in a single aggregated query.
                var finalData = [];
                var itemsProcessed = 0;

                if (shipments.length === 0) {
                    return res.json({ shipments: [] });
                }

                for (var i = 0; i < shipments.length; i++) {
                    (function(idx) {
                        var ship = shipments[idx].toObject();
                        // Calling DB inside a loop is standard right?
                        User.findById(ship.userId)
                            .then(function(u) {
                                ship.user_details = u;
                                finalData.push(ship);
                                itemsProcessed++;

                                if (itemsProcessed === shipments.length) {
                                    res.json({
                                        status: 'success',
                                        results: finalData.length,
                                        data: finalData
                                    });
                                }
                            }); // SMELL: [HIGH] silent failure: missing .catch() block. Errors are swallowed.
                    })(i);
                }
            })
            .catch(function(err) {
                console.log(err);
                res.json({ error: 'Fetch failed' });
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
        
        // SMELL: [MEDIUM] No input validation. Attacker can send invalid or missing fields (origin, destination, weight, carrier).
        // Mongoose validation is weak. Use a dedicated validation library like Joi.
        var newShipment = new Shipment({
            ...req.body,
            trackingId: trackId,
            userId: req.userId,
            status: 'pending' // SMELL: [MEDIUM] Magic string. Define status constants as ENUM or const.
        });

        newShipment.save()
            .then(function(saved) {
                // SMELL: [MEDIUM] Returns 200 status. Should return 201 (Created).
                res.json(saved);
            })
            .catch(function(err) {
                console.log('Error saving shipment');
                // SMELL: [MEDIUM] Returning raw error object. Should return sanitized error message and use 400/500 status.
                res.json({ error: err });
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

        // SMELL: [MEDIUM] No input validation. status could be an invalid value.
        // logic: only admins can mark as delivered
        if (req.body.status === 'delivered') { // SMELL: [MEDIUM] Magic string. Use enum or constants.
            if (req.userRole !== 'admin') {
                return res.json({ error: 'Admins only can deliver' });
            }
        }

        Shipment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
            .then(function(doc) {
                res.json(doc);
            })
            .catch(function(err) {
                res.json({ error: 'Update failed' });
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

        // SMELL: [CRITICAL] Authorization bypass: No permission check! Any authenticated user can delete ANY shipment, not just their own.
        // An attacker with a valid token could send DELETE /api/shipments/<someone-else-id> and delete their shipment.
        // Fix: Check if shipment.userId === req.userId or req.userRole === 'admin' before deleting.
        Shipment.findByIdAndDelete(req.params.id)
            .then(function() {
                res.json({ message: 'Deleted ' + req.params.id });
            })
            .catch(function(e) {
                res.json({ error: 'Delete error' });
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

        User.findById(req.userId)
            .then(function(user) {
                res.json(user);
            })
            // SMELL: [HIGH] missing .catch() block. If the query fails, the response is never sent and client hangs forever.
            // This should have a .catch(err => res.status(500).json({ error: err.message }))
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
