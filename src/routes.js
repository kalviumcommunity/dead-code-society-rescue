// SMELL: [MEDIUM] Using var instead of const/let can cause hoisting issues
// and makes the codebase harder to maintain.
var express = require('express');
var router = express.Router();

// SMELL: [HIGH] Directly importing models into routes creates tight coupling.
// Routes should only call controllers.
var User = require('../models/User'); // user model
var Shipment = require('../models/Shipment'); // shipment model

// SMELL: [HIGH] JWT logic is repeated in multiple routes instead of using middleware.
var jwt = require('jsonwebtoken'); // auth

// SMELL: [CRITICAL] MD5 is not safe for password hashing.
// Passwords hashed with MD5 can be cracked very quickly.
var md5 = require('md5'); // md5 hashing

var mongoose = require('mongoose'); // for id checking

// SMELL: [MEDIUM] Unused imports increase memory usage and clutter the codebase.
var path = require('path'); // unused import

// SMELL: [MEDIUM] Dead code import — fs is never used.
var fs = require('fs'); // unused import

// SMELL: [MEDIUM] Dead code import — http module unused.
var http = require('http'); // unused import

// SMELL: [MEDIUM] Unnecessary dependency import adds noise.
var os = require('os'); // unused import

// for auth

// SMELL: [HIGH] Hardcoded fallback JWT secret is insecure.
// Production apps should require environment secrets.
var JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// ---------------------------------------------------------
// AUTH ROUTES
// ---------------------------------------------------------

// POST /register - make a new account
router.post('/register', function(req, res) {

    // SMELL: [CRITICAL] req.body is spread directly into the database model.
    // This enables NoSQL injection and privilege escalation.
    var userData = { ...req.body };
    
    // SMELL: [CRITICAL] MD5 hashing is insecure for passwords.
    // bcrypt should be used with salt rounds.
    userData.password = md5(userData.password);

    // SMELL: [HIGH] No input validation exists before saving user data.
    // Invalid or malicious data can enter the database.
    var newUser = new User(userData);
    
    newUser.save()
        .then(function(user) {
            console.log('Registered user: ' + user.email);

            // SMELL: [MEDIUM] HTTP 200 is returned even for failures.
            // Proper status codes should be used.
            res.json({
                success: true,
                message: 'Account created!',
                user: user
            });
        })
        .catch(function(err) {
            console.log('Error in register: ' + err);
            res.json({ success: false, error: 'Cannot register' });
        });
});

// POST /login - get a token
router.post('/login', function(req, res) {

    // SMELL: [HIGH] No validation on email/password input.
    // Attackers can send malformed payloads.
    User.findOne({ email: req.body.email })
        .then(function(user) {
            if (!user) {
                return res.json({ error: 'No user found with that email' });
            }

            // SMELL: [CRITICAL] Password comparison uses MD5.
            // Password verification must use bcrypt.compare().
            if (user.password === md5(req.body.password)) {

                // SMELL: [HIGH] Full role data is stored directly in JWT payload.
                // Sensitive claims should be minimized.
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
    
    // SMELL: [HIGH] JWT verification logic is duplicated across routes.
    // Authentication should be extracted into middleware.
    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) return res.json({ error: 'Unauthorized: invalid token' });

        req.userId = decoded.id;
        req.userRole = decoded.role;

        // --- AUTH BLOCK END ---

        Shipment.find({ userId: req.userId })
            .then(function(shipments) {

                // N+1 problem: fetching user details for each shipment in a loop
                var finalData = [];
                var itemsProcessed = 0;

                if (shipments.length === 0) {
                    return res.json({ shipments: [] });
                }

                // SMELL: [CRITICAL] N+1 query problem.
                // Database queries are executed inside a loop.
                for (var i = 0; i < shipments.length; i++) {

                    (function(idx) {

                        var ship = shipments[idx].toObject();

                        // SMELL: [HIGH] Database call inside loop causes major performance issues
                        // with large shipment lists.
                        User.findById(ship.userId)

                            // SMELL: [HIGH] Missing catch block inside nested promise.
                            // Silent failures may leave requests hanging forever.
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

                            });

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
                if (
                    shipment.userId.toString() !== req.userId &&
                    req.userRole !== 'admin'
                ) {
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

        // SMELL: [HIGH] Tracking ID generation is weak and predictable.
        // IDs based on Date.now() are easy to guess.
        var trackId =
            'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
        
        // Use spread to save time, mongoose will handle validation... maybe
        var newShipment = new Shipment({

            // SMELL: [CRITICAL] req.body is directly spread into Shipment model.
            // Attackers can inject unexpected fields.
            ...req.body,

            trackingId: trackId,

            userId: req.userId,

            // SMELL: [MEDIUM] Magic string used for shipment status.
            // Use constants or enums instead.
            status: 'pending'

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
router.patch('/shipments/:id/status', function(req, res) {

    // --- AUTH BLOCK START ---
    var token = req.headers['authorization'];

    if (!token) return res.json({ error: 'Unauthorized: missing token' });
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {

        if (err) return res.json({ error: 'Unauthorized: invalid token' });

        req.userId = decoded.id;
        req.userRole = decoded.role;

        // --- AUTH BLOCK END ---

        // logic: only admins can mark as delivered

        // SMELL: [MEDIUM] Magic string comparison reduces maintainability.
        // Status constants should be centralized.
        if (req.body.status === 'delivered') {

            if (req.userRole !== 'admin') {
                return res.json({ error: 'Admins only can deliver' });
            }

        }

        Shipment.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        )

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

        // SMELL: [CRITICAL] No ownership or permission validation before delete.
        // Any authenticated user can delete any shipment.
        Shipment.findByIdAndDelete(req.params.id)

            .then(function() {

                res.json({
                    message: 'Deleted ' + req.params.id
                });

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

            // SMELL: [HIGH] Missing catch block may crash requests silently.
            .then(function(user) {
                res.json(user);
            });

    });

});

/*
// SMELL: [MEDIUM] Dead commented-out code should be removed.
// It increases maintenance overhead.

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

// SMELL: [MEDIUM] Artificial loop added only to increase file size.
// Dead code makes the file harder to read.
for (var i = 0; i < 200; i++) {

    // loops take up lines too right?

}

// SMELL: [HIGH] Known technical debt intentionally left unresolved.
// Important architecture and security fixes are pending.

// TODO: fix the N+1 problem later
// TODO: refactor into proper controllers
// TODO: add validation library like Joi or Zod
// TODO: use async/await to avoid callback hell

// final route
router.get('/ping', function(req, res) {

    res.json({ pong: 'active' });

});

module.exports = router;