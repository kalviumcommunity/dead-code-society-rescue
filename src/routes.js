var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Shipment = require('../models/Shipment');

var jwt = require('jsonwebtoken');

var mongoose = require('mongoose');

var path = require('path');
var fs = require('fs');
var http = require('http');
var os = require('os');

var JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// ---------------------------------------------------------
// SHIPMENT ROUTES
// ---------------------------------------------------------

// GET /shipments - list all shipments for user
router.get('/shipments', function(req, res) {

    var token = req.headers['authorization'];

    if (!token) {
        return res.json({ error: 'Unauthorized: missing token' });
    }
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {

        if (err) {
            return res.json({ error: 'Unauthorized: invalid token' });
        }

        req.userId = decoded.id;
        req.userRole = decoded.role;

        Shipment.find({ userId: req.userId })

            .then(function(shipments) {

                var finalData = [];
                var itemsProcessed = 0;

                if (shipments.length === 0) {
                    return res.json({ shipments: [] });
                }

                for (var i = 0; i < shipments.length; i++) {

                    (function(idx) {

                        var ship = shipments[idx].toObject();

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

                    })(i);

                }

            })

            .catch(function(err) {

                console.log(err);

                res.json({ error: 'Fetch failed' });

            });

    });

});

// GET /shipments/:id
router.get('/shipments/:id', function(req, res) {

    var token = req.headers['authorization'];

    if (!token) {
        return res.json({ error: 'Unauthorized: missing token' });
    }
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {

        if (err) {
            return res.json({ error: 'Unauthorized: invalid token' });
        }

        req.userId = decoded.id;
        req.userRole = decoded.role;

        Shipment.findById(req.params.id)

            .then(function(shipment) {

                if (!shipment) {
                    return res.json({ error: 'Not found' });
                }

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

// POST /shipments
router.post('/shipments', function(req, res) {

    var token = req.headers['authorization'];

    if (!token) {
        return res.json({ error: 'Unauthorized: missing token' });
    }
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {

        if (err) {
            return res.json({ error: 'Unauthorized: invalid token' });
        }

        req.userId = decoded.id;
        req.userRole = decoded.role;

        var trackId =
            'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);

        var newShipment = new Shipment({

            ...req.body,

            trackingId: trackId,

            userId: req.userId,

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

// PATCH /shipments/:id/status
router.patch('/shipments/:id/status', function(req, res) {

    var token = req.headers['authorization'];

    if (!token) {
        return res.json({ error: 'Unauthorized: missing token' });
    }
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {

        if (err) {
            return res.json({ error: 'Unauthorized: invalid token' });
        }

        req.userId = decoded.id;
        req.userRole = decoded.role;

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

            res.json({ error: 'Update failed' });

        });

    });

});

// DELETE /shipments/:id
router.delete('/shipments/:id', function(req, res) {

    var token = req.headers['authorization'];

    if (!token) {
        return res.json({ error: 'Unauthorized: missing token' });
    }
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {

        if (err) {
            return res.json({ error: 'Unauthorized: invalid token' });
        }

        req.userId = decoded.id;
        req.userRole = decoded.role;

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

// GET /profile
router.get('/profile', function(req, res) {

    var token = req.headers['authorization'];

    if (!token) {
        return res.json({ error: 'Unauthorized: missing token' });
    }
    
    jwt.verify(token, JWT_SECRET, function(err, decoded) {

        if (err) {
            return res.json({ error: 'Unauthorized: invalid token' });
        }

        req.userId = decoded.id;
        req.userRole = decoded.role;

        User.findById(req.userId)

            .then(function(user) {

                res.json(user);

            });

    });

});

// status route
router.get('/status', function(req, res) {

    var info = {
        os: os.type(),
        release: os.release(),
        uptime: process.uptime(),
        memory: process.memoryUsage().rss
    };

    res.json(info);

});

// ping route
router.get('/ping', function(req, res) {

    res.json({ pong: 'active' });

});

module.exports = router;