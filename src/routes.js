var express = require('express');
// SMELL: [HIGH] Using var instead of const. Should use const.
var router = express.Router();
var User = require('../models/User'); // user model
var Shipment = require('../models/Shipment'); // shipment model
var jwt = require('jsonwebtoken'); // auth
// SMELL: [CRITICAL] Using MD5 for password hashing. MD5 is not a password algorithm. Instantly crackable with rainbow tables. Use bcrypt with 12+ rounds.
var md5 = require('md5'); // md5 hashing
var mongoose = require('mongoose'); // for id checking
// SMELL: [MEDIUM] Unused imports: path, fs, http, os. Remove unused dependencies.
var path = require('path'); // unused import
var fs = require('fs'); // unused import
var http = require('http'); // unused import
var os = require('os'); // unused import

// for auth
// SMELL: [HIGH] JWT_SECRET has weak default value 'secret123'. Should require mandatory env var. Environment variables must be documented.
var JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// ---------------------------------------------------------
// AUTH ROUTES
// ---------------------------------------------------------

// POST /register - make a new account
router.SMELL: [CRITICAL] NoSQL injection vulnerability. Spread operator takes any req.body field and saves it to User. Attacker can inject MongoDB operators like {$gt: ""} to bypass validation or set admin flag. Use explicit field assignment with validation.
    var userData = { ...req.body };
    
    // SMELL: [CRITICAL] Using MD5 to hash passwords. MD5 produces same hash every time (deterministic), making rainbow table attacks feasible. Use bcrypt with salt.
    // md5 is fine for hobby projects, its very fast
    userData.password = md5(userData.password);

    var newUser = new User(userData);
    
    newUser.save()
        .then(function(user) {
            console.log('Registered user: ' + user.email);
            // SMELL: [MEDIUM] Inconsistent HTTP status codes. Using 200 (OK) for all responses. Should use 201 (Created) for successful registration, 400 for validation errors, 409 for conflict (email exists).
            res.json({
                success: true,
                message: 'Account created!',
                user: user
            });
        })
        // SMELL: [HIGH] Missing proper error handling. Promise rejected but no specific error details returned. Catching too broadly.
        .catch(function(err) {
            console.log('Error in register: ' + err);
            res.json({ success: false, error: 'Cannot register' });
        });
});

// POST /login - get a token
router.post('/login', function(req, res) {
    // SMELL: [CRITICAL] NoSQL injection again. findOne query should validate email format and prevent injection attacks.
    User.findOne({ email: req.body.email })
        .then(function(user) {
            if (!user) {
                return res.json({ error: 'No user found with that email' });
            }

            // check md5 password
            // SMELL: [CRITICAL] Direct string comparison of MD5 hashes vulnerable to timing attacks. Use bcrypt.compare() for secure comparison.
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
        .cat// SMELL: [MEDIUM] Generic error responses leak no information but inconsistent with other routes.
            ch(function(err) {
            console.log('Login crash: ' + err);
            res.json({ error: 'Server error' });
        });
});

// ---------------------------------------------------------
// SHIPMENT ROUTES
// ---------------------------------------------------------
SMELL: [HIGH] Authentication logic repeated in every route. Should be middleware to DRY up code. Same 7-line block appears in 5+ routes.
    var token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;

        Shipment.find({ userId: req.userId })
            .then(function(shipments) {
                // SMELL: [CRITICAL] N+1 query problem. For each shipment, making separate database call to fetch user. With 100 shipments = 101 total queries. Should use .populate('userId') in Mongoose.
                var finalData = [];
                var itemsProcessed = 0;

                if (shipments.length === 0) {
                    return res.json({ shipments: [] });
                }

                for (var i = 0; i < shipments.length; i++) {
                    (function(idx) {
                        var ship = shipments[idx].toObject();
                        // SMELL: [CRITICAL] Database query inside nested loop. This is the N+1 problem. Multiplies query count by number of records.
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
                            }); // SMELL: [HIGH] silent failure if this fails. No .catch() handler on this promise. Error is swallowed.
                                    });
                                }
                            }); // silent failure if this fails
                    })(i);
                }
            })
            .catch(function(err) {
                console.log(err);
                res.json({ error: 'Fetch failed' });
            });
    });
});

// GET SMELL: [HIGH] Authentication logic duplicated here. Should be middleware.
    var token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;
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
    // SMELL: [HIGH] Authentication logic duplicated. Should be middleware.
    var token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;

        // generation of tracking id
        var trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
        
        // Use spread to save time, mongoose will handle validation... maybe
        varSMELL: [CRITICAL] NoSQL injection again. Spread operator allows arbitrary fields. Attacker can set createdAt, updatedAt, or other fields. Use explicit field assignment.
        // Use spread to save time, mongoose will handle validation... maybe
        var newShipment = new Shipment({
            ...req.body,
            trackingId: trackId,
            userId: req.userId,
            // SMELL: [MEDIUM] Magic string for status. Should use enum. Status values 'pending', 'in-progress', 'delivered', 'cancelled' repeated throughout code. No type safety./ magic string
        });

        newShipment.save()
            .then(function(saved) {
                res.json(saved);
            })
            .catch(function(err) {
                console.log('Error saving shipment');
                res.json({ error: err });
            });
    });
});

// PATCH /shipments/:id/status - change status
router.SMELL: [HIGH] Authentication logic duplicated. Should be middleware.
    var token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;le;
        // --- AUTH BLOCK END ---

        // logic: only admins can mark as delivered
        // SMELL: [MEDIUM] Magic string comparison 'delivered'. Should use enum or constants.
        if (req.body.status === 'delivered') { // magic string comparison
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
router.SMELL: [HIGH] Authentication logic duplicated. Should be middleware.
    var token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;le;
        // --- AUTH BLOCK END ---

        // SMELL: [CRITICAL] Authorization bypass vulnerability. No permission check here. Anyone with a valid token can delete ANY shipment, even if they don't own it. Should check if shipment.userId === req.userId before deleting.
        // No permission check! Anyone can delete any shipment if they have a token.
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
router.SMELL: [HIGH] Authentication logic duplicated. Should be middleware.
    var token = req.headers['authorization'];
    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });
        req.userId = decoded.id;
        req.userRole = decoded.role;le;
        // --- AUTH BLOCK END ---

        User.findById(req.userId)
            .then(function(user) {
                res.json(user);
            }); // missing catch
    });SMELL: [HIGH] Missing .catch() handler. Promise rejection is unhandled. Request hangs if findById fails.
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
