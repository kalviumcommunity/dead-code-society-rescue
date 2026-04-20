const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Shipment = require('../models/Shipment');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const os = require('os');

// const md5 = require('md5');
// const path = require('path');
// const fs = require('fs');
// const http = require('http');

const JWT_SECRET = process.env.JWT_SECRET;

// ---------------------------------------------------------
// AUTH MIDDLEWARE
// ---------------------------------------------------------

async function verifyAuth(req, res, next) {
    try {
        const token = req.headers['authorization'];
        if (!token) return res.status(401).json({ error: 'Unauthorized: missing token' });

        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        req.userRole = decoded.role;

        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized: invalid token' });
    }
}

// ---------------------------------------------------------
// AUTH ROUTES
// ---------------------------------------------------------

// POST /register
router.post('/register', async function(req, res) {

    // var userData = { ...req.body };
    // userData.password = md5(userData.password);
    // var newUser = new User(userData);
    // newUser.save()
    //     .then(function(user) {
    //         res.json({ success: true, user: user });
    //     })
    //     .catch(function(err) {
    //         res.json({ success: false });
    //     });

    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields required' });
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
            role: 'user'
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            message: 'Account created',
            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email
            }
        });

    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST /login
router.post('/login', async function(req, res) {

    // User.findOne({ email: req.body.email })
    //     .then(function(user) {
    //         if (user.password === md5(req.body.password)) {
    //             var token = jwt.sign({ id: user._id }, JWT_SECRET);
    //             res.json({ token: token });
    //         }
    //     });

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// ---------------------------------------------------------
// SHIPMENTS
// ---------------------------------------------------------

// GET /shipments
router.get('/shipments', verifyAuth, async function(req, res) {

    // Shipment.find({ userId: req.userId })
    //     .then(function(shipments) {
    //         for (...) {
    //             User.findById(...)
    //         }
    //     });

    try {
        const shipments = await Shipment.find({ userId: req.userId })
            .populate('userId', 'name email');

        res.status(200).json({
            count: shipments.length,
            data: shipments
        });

    } catch (err) {
        res.status(500).json({ error: 'Fetch failed' });
    }
});

// GET /shipments/:id
router.get('/shipments/:id', verifyAuth, async function(req, res) {

    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'Invalid ID' });
        }

        const shipment = await Shipment.findById(req.params.id);

        if (!shipment) {
            return res.status(404).json({ error: 'Not found' });
        }

        if (
            shipment.userId.toString() !== req.userId &&
            req.userRole !== 'admin'
        ) {
            return res.status(403).json({ error: 'No access' });
        }

        res.status(200).json(shipment);

    } catch (err) {
        res.status(500).json({ error: 'Error fetching shipment' });
    }
});

// POST /shipments
router.post('/shipments', verifyAuth, async function(req, res) {

    // var newShipment = new Shipment({
    //     ...req.body
    // });

    try {
        const { origin, destination, weight, carrier } = req.body;

        if (!origin || !destination || !weight || !carrier) {
            return res.status(400).json({ error: 'All fields required' });
        }

        const trackingId =
            'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);

        const newShipment = new Shipment({
            origin,
            destination,
            weight,
            carrier,
            trackingId,
            userId: req.userId,
            status: 'pending'
        });

        const saved = await newShipment.save();

        res.status(201).json(saved);

    } catch (err) {
        res.status(500).json({ error: 'Error saving shipment' });
    }
});

// PATCH /shipments/:id/status
router.patch('/shipments/:id/status', verifyAuth, async function(req, res) {

    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: 'Status required' });
        }

        if (status === 'delivered' && req.userRole !== 'admin') {
            return res.status(403).json({ error: 'Admins only' });
        }

        const updated = await Shipment.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ error: 'Not found' });
        }

        res.status(200).json(updated);

    } catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
});

// DELETE /shipments/:id
router.delete('/shipments/:id', verifyAuth, async function(req, res) {

    // Shipment.findByIdAndDelete(req.params.id)

    try {
        const shipment = await Shipment.findById(req.params.id);

        if (!shipment) {
            return res.status(404).json({ error: 'Not found' });
        }

        if (
            shipment.userId.toString() !== req.userId &&
            req.userRole !== 'admin'
        ) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        await Shipment.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Deleted successfully' });

    } catch (err) {
        res.status(500).json({ error: 'Delete error' });
    }
});

// ---------------------------------------------------------
// USER PROFILE
// ---------------------------------------------------------

router.get('/profile', verifyAuth, async function(req, res) {

    try {
        const user = await User.findById(req.userId).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);

    } catch (err) {
        res.status(500).json({ error: 'Error fetching profile' });
    }
});

// ---------------------------------------------------------
// SYSTEM
// ---------------------------------------------------------

router.get('/status', function(req, res) {
    res.json({
        os: os.type(),
        uptime: process.uptime(),
        memory: process.memoryUsage().rss
    });
});

router.get('/ping', function(req, res) {
    res.json({ pong: 'active' });
});

module.exports = router;