// SMELL: [MEDIUM] Using var causes hoisting issues. Use const/let instead.
var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Shipment = require('../models/Shipment');

var jwt = require('jsonwebtoken');

// SMELL: [CRITICAL] MD5 is insecure for password hashing and easily crackable.
var md5 = require('md5');

var mongoose = require('mongoose');

// SMELL: [MEDIUM] Unused imports increase noise and reduce maintainability.
var path = require('path');
var fs = require('fs');
var http = require('http');
var os = require('os');

// SMELL: [HIGH] Hardcoded fallback secret is insecure in production.
var JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// ---------------------------------------------------------
// AUTH ROUTES
// ---------------------------------------------------------

// POST /register - make a new account
router.post('/register', function(req, res) {

    // SMELL: [CRITICAL] Directly spreading req.body enables NoSQL injection attacks.
    var userData = { ...req.body };

    // SMELL: [CRITICAL] Passwords should use bcrypt, not MD5 hashing.
    userData.password = md5(userData.password);

    var newUser = new User(userData);

    // SMELL: [HIGH] Promise chains reduce readability and should use async/await.
    newUser.save()
        .then(function(user) {
            console.log('Registered user: ' + user.email);

            res.json({
                success: true,
                message: 'Account created!',
                user: user
            });
        })
        .catch(function(err) {
            console.log('Error in register: ' + err);

            res.json({
                success: false,
                error: 'Cannot register'
            });
        });
});

// POST /login - get a token
router.post('/login', function(req, res) {

    // SMELL: [CRITICAL] No validation on req.body allows malicious payloads.
    User.findOne({ email: req.body.email })
        .then(function(user) {

            if (!user) {
                return res.json({
                    error: 'No user found with that email'
                });
            }

            // SMELL: [CRITICAL] Comparing MD5 hashes is insecure authentication logic.
            if (user.password === md5(req.body.password)) {

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

                res.json({
                    error: 'Password does not match'
                });

            }
        })
        .catch(function(err) {

            console.log('Login crash: ' + err);

            res.json({
                error: 'Server error'
            });

        });
});

// ---------------------------------------------------------
// SHIPMENT ROUTES
// ---------------------------------------------------------

// GET /shipments - list all shipments for user
router.get('/shipments', function(req, res) {

    // SMELL: [MEDIUM] Repeated JWT verification violates DRY principle.
    var token = req.headers['authorization'];

    if (!token) {
        return res.json({
            error: 'Unauthorized: missing token'
        });
    }

    jwt.verify(token, JWT_SECRET, function(err, decoded) {

        if (err) {
            return res.json({
                error: 'Unauthorized: invalid token'
            });
        }

        req.userId = decoded.id;
        req.userRole = decoded.role;

        Shipment.find({ userId: req.userId })

            .then(function(shipments) {

                // SMELL: [HIGH] Database queries inside loops create N+1 query problems.
                var finalData = [];
                var itemsProcessed = 0;

                if (shipments.length === 0) {
                    return res.json({
                        shipments: []
                    });
                }

                for (var i = 0; i < shipments.length; i++) {

                    (function(idx) {

                        var ship = shipments[idx].toObject();

                        // SMELL: [HIGH] Querying DB inside loops severely impacts performance.
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
                            });

                        // SMELL: [HIGH] Missing catch block can silently fail queries.

                    })(i);

                }
            })

            .catch(function(err) {

                console.log(err);

                res.json({
                    error: 'Fetch failed'
                });

            });
    });
});

// GET /shipments/:id - get one shipment
router.get('/shipments/:id', function(req, res) {

    // SMELL: [MEDIUM] Repeated authentication code should be middleware.
    var token = req.headers['authorization'];

    if (!token) {
        return res.json({
            error: 'Unauthorized: missing token'
        });
    }

    jwt.verify(token, JWT_SECRET, function(err, decoded) {

        if (err) {
            return res.json({
                error: 'Unauthorized: invalid token'
            });
        }

        req.userId = decoded.id;
        req.userRole = decoded.role;

        Shipment.findById(req.params.id)

            .then(function(shipment) {

                if (!shipment) {
                    return res.json({
                        error: 'Not found'
                    });
                }

                if (
                    shipment.userId.toString() !== req.userId &&
                    req.userRole !== 'admin'
                ) {

                    return res.json({
                        error: 'No access to this shipment'
                    });

                }

                res.json(shipment);

            })

            .catch(function(err) {

                res.json({
                    error: 'Error on findById'
                });

            });
    });
});

// POST /shipments - create shipment
router.post('/shipments', function(req, res) {

    // SMELL: [MEDIUM] Authentication logic duplicated again.
    var token = req.headers['authorization'];

    if (!token) {
        return res.json({
            error: 'Unauthorized: missing token'
        });
    }

    jwt.verify(token, JWT_SECRET, function(err, decoded) {

        if (err) {
            return res.json({
                error: 'Unauthorized: invalid token'
            });
        }

        req.userId = decoded.id;
        req.userRole = decoded.role;

        var trackId =
            'SHIP-' +
            Date.now() +
            '-' +
            Math.floor(Math.random() * 100);

        // SMELL: [CRITICAL] Spreading req.body directly is unsafe.
        var newShipment = new Shipment({
            ...req.body,
            trackingId: trackId,
            userId: req.userId,

            // SMELL: [MEDIUM] Magic string values reduce maintainability.
            status: 'pending'
        });

        newShipment.save()

            .then(function(saved) {

                res.json(saved);

            })

            .catch(function(err) {

                console.log('Error saving shipment');

                res.json({
                    error: err
                });

            });
    });
});

// PATCH /shipments/:id/status - change status
router.patch('/shipments/:id/status', function(req, res) {

    // SMELL: [MEDIUM] Authentication logic duplicated multiple times.
    var token = req.headers['authorization'];

    if (!token) {
        return res.json({
            error: 'Unauthorized: missing token'
        });
    }

    jwt.verify(token, JWT_SECRET, function(err, decoded) {

        if (err) {
            return res.json({
                error: 'Unauthorized: invalid token'
            });
        }

        req.userId = decoded.id;
        req.userRole = decoded.role;

        // SMELL: [MEDIUM] Magic string comparison should use constants/enums.
        if (req.body.status === 'delivered') {

            if (req.userRole !== 'admin') {

                return res.json({
                    error: 'Admins only can deliver'
                });

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

                res.json({
                    error: 'Update failed'
                });

            });
    });
});

// DELETE /shipments/:id - remove shipment
router.delete('/shipments/:id', function(req, res) {

    // SMELL: [MEDIUM] Repeated JWT verification should be extracted to middleware.
    var token = req.headers['authorization'];

    if (!token) {
        return res.json({
            error: 'Unauthorized: missing token'
        });
    }

    jwt.verify(token, JWT_SECRET, function(err, decoded) {

        if (err) {
            return res.json({
                error: 'Unauthorized: invalid token'
            });
        }

        req.userId = decoded.id;
        req.userRole = decoded.role;

        // SMELL: [CRITICAL] Missing authorization check allows deleting any shipment.
        Shipment.findByIdAndDelete(req.params.id)

            .then(function() {

                res.json({
                    message: 'Deleted ' + req.params.id
                });

            })

            .catch(function(e) {

                res.json({
                    error: 'Delete error'
                });

            });
    });
});

// ---------------------------------------------------------
// USER MANAGEMENT
// ---------------------------------------------------------

// GET /profile - current user
router.get('/profile', function(req, res) {

    // SMELL: [MEDIUM] Repeated authentication logic should be middleware.
    var token = req.headers['authorization'];

    if (!token) {
        return res.json({
            error: 'Unauthorized: missing token'
        });
    }

    jwt.verify(token, JWT_SECRET, function(err, decoded) {

        if (err) {
            return res.json({
                error: 'Unauthorized: invalid token'
            });
        }

        req.userId = decoded.id;
        req.userRole = decoded.role;

        User.findById(req.userId)

            .then(function(user) {

                res.json(user);

            });

        // SMELL: [HIGH] Missing catch block may crash silently.

    });
});

/*
// SMELL: [MEDIUM] Dead/commented code reduces maintainability.

router.get('/all-users', function(req, res) {
    User.find({}).then(u => res.json(u));
});
*/

/*
// SMELL: [MEDIUM] Old unused testing route should be removed.

router.post('/test-hash', function(req, res) {
    var h = md5(req.body.p);
    res.json({ h: h });
});
*/

// ---------------------------------------------------------
// DUMMY DATA FOR TESTING
// ---------------------------------------------------------

router.get('/status', function(req, res) {

    var info = {
        os: os.type(),
        release: os.release(),
        uptime: process.uptime(),
        memory: process.memoryUsage().rss
    };

    res.json(info);

});

// SMELL: [MEDIUM] Unnecessary loop used only for padding file length.
for (var i = 0; i < 200; i++) {

}

// TODO: fix the N+1 problem later
// TODO: refactor into proper controllers
// TODO: add validation library like Joi or Zod
// TODO: use async/await to avoid callback hell

router.get('/ping', function(req, res) {

    res.json({
        pong: 'active'
    });

});

module.exports = router;