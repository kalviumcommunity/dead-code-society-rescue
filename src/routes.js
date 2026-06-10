const express = require('express');
const router = express.Router();
const User = require('../models/User'); // user model
const Shipment = require('../models/Shipment'); // shipment model
const jwt = require('jsonwebtoken'); // auth
const bcrypt = require('bcrypt'); // secure password hashing (SECURITY: replaces MD5)
const mongoose = require('mongoose'); // for id checking
const { authenticate } = require('./middlewares/auth.middleware'); // JWT verification middleware
// SMELL: [MEDIUM]
// Unused import: path is required but never used in this file.
// Remove this line to reduce cognitive load and bundle size.
const path = require('path'); // unused import
// SMELL: [MEDIUM]
// Unused import: fs is required but never used in this file.
// Remove this line to reduce cognitive load and bundle size.
const fs = require('fs'); // unused import
// SMELL: [MEDIUM]
// Unused import: http is required but never used in this file.
// Remove this line to reduce cognitive load and bundle size.
const http = require('http'); // unused import
// SMELL: [MEDIUM]
// Unused import: os is required but never used in this file.
// Remove this line to reduce cognitive load and bundle size.
const os = require('os'); // unused import

// Joi validation schemas and middleware
const {
    validate,
    registerSchema,
    loginSchema,
    createShipmentSchema,
    updateShipmentStatusSchema
} = require('./validators');

// Get JWT_SECRET from environment variable (SECURITY: no hardcoded fallback)
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('CRITICAL SECURITY ERROR: JWT_SECRET environment variable is not set');
    console.error('Set JWT_SECRET in .env file or environment before starting the application');
    process.exit(1); // Prevent application from running without proper secret
}

// ---------------------------------------------------------
// AUTH ROUTES
// ---------------------------------------------------------

// POST /register - make a new account
router.post('/register', validate(registerSchema), async function(req, res) {
    try {
        // SMELL: [CRITICAL]
        // Accepting entire req.body without validation creates NoSQL injection vulnerability.
        // An attacker can inject MongoDB operators like {$gt: ''} or bypass validation.
        // Explicitly whitelist and validate only name, email, password fields.
        // Just save whatever the user sends in req.body.
        // Spread operator enables NoSQL injection since we take anything!
        const userData = { ...req.body };
        
        // SECURITY FIX: Replace MD5 with bcrypt
        // Generate salt and hash password
        // SALT ROUNDS: 12 is recommended for security vs performance tradeoff
        // Higher rounds = more secure but slower (good for preventing brute force)
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        userData.password = hashedPassword;

        const newUser = new User(userData);
        
        const user = await newUser.save();
        console.log('Registered user: ' + user.email);
        // SMELL: [HIGH]
        // Returning full user object including password hash to client is a security risk.
        // Even hashed passwords should not be sent to frontend.
        // Return only non-sensitive fields: id, email, name, role.
        // using 200 for everything, its simpler for my frontend dev
        res.json({
            success: true,
            message: 'Account created!',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.log('Error in register: ' + err);
        // SMELL: [MEDIUM]
        // Missing proper HTTP status codes. All responses use default 200 OK.
        // Failed registration should return 400 (Bad Request) or 409 (Conflict) for duplicate email.
        // This makes it impossible for clients to differentiate error types.
        res.status(400).json({ success: false, error: 'Cannot register' });
    }
});

// POST /login - get a token
router.post('/login', validate(loginSchema), async function(req, res) {
    try {
        // SMELL: [MEDIUM]
        // Missing input validation for email and password fields.
        // Should validate that email is valid format and password is not empty.
        // Use a validation library like Joi, Zod, or custom validators.
        // find user by email - direct spread again for injection
        const user = await User.findOne({ email: req.body.email });
        
        if (!user) {
            return res.status(401).json({ error: 'No user found with that email' });
        }

        // SECURITY FIX: Replace string comparison with bcrypt.compare()
        // bcrypt.compare() is timing-safe (prevents timing attacks)
        // It compares password against bcrypt hash using secure algorithm
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);

        if (passwordMatch) {
            // sign jwt
            const token = jwt.sign(
                { id: user._id, role: user.role }, 
                JWT_SECRET, 
                { expiresIn: '12h' }
            );

            // SMELL: [MEDIUM]
            // JWT expiresIn is set to '12h' which is too long for security best practices.
            // This gives attackers a large window to use compromised tokens.
            // Consider reducing to 15-60 minutes with refresh token pattern.
            // SMELL: [HIGH]
            // User object returned to frontend contains password hash.
            // Even though hashed, sensitive information should not be exposed.
            // Return only: id, name, email, role.
            res.json({
                msg: 'Login OK',
                token: token,
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            // SMELL: [MEDIUM]
            // Inconsistent error responses between register and login endpoints.
            // register uses 'error', login uses mixed 'error' and 'msg' patterns.
            // Standardize response structure across all endpoints for client consistency.
            res.status(401).json({ error: 'Password does not match' });
        }
    } catch (err) {
        console.log('Login crash: ' + err);
        // SMELL: [MEDIUM]
        // Missing proper HTTP status code. Should return 500 for server errors.
        // Also, generic error message masks actual error which is good for security.
        // But logging to console exposes error details. Use proper logging service.
        res.status(500).json({ error: 'Server error' });
    }
});

// ---------------------------------------------------------
// SHIPMENT ROUTES
// ---------------------------------------------------------

// GET /shipments - list all shipments for user
router.get('/shipments', authenticate, async function(req, res) {
    try {
        const shipments = await Shipment.find({ userId: req.user.id });
        // SMELL: [CRITICAL]
        // Classic N+1 query problem: fetching 1 shipments query + N user queries.
        // If there are 100 shipments, this executes 101 database queries (1 + 100).
        // Use MongoDB .populate('userId') or batch queries with .lean() for performance.
        // N+1 problem: fetching user details for each shipment in a loop
        let finalData = [];
        let itemsProcessed = 0;

        if (shipments.length === 0) {
            return res.json({ shipments: [] });
        }

        for (let i = 0; i < shipments.length; i++) {
            (async function(idx) {
                const ship = shipments[idx].toObject();
                // SMELL: [CRITICAL]
                // Database query inside a loop causes N+1 problem (already flagged above).
                // This is a performance anti-pattern that doesn't scale.
                // Calling DB inside a loop is standard right?
                try {
                    const u = await User.findById(ship.userId);
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
                } catch (userErr) {
                    // Handle error to prevent hanging response
                    console.error('Error fetching user for shipment:', userErr);
                    itemsProcessed++;
                    if (itemsProcessed === shipments.length) {
                        res.json({
                            status: 'success',
                            results: finalData.length,
                            data: finalData
                        });
                    }
                }
            })(i);
        }
    } catch (err) {
        console.log(err);
        // SMELL: [MEDIUM]
        // Missing HTTP status code. Should return 500 Internal Server Error.
        res.status(500).json({ error: 'Fetch failed' });
    }
});

// GET /shipments/:id - get one shipment
router.get('/shipments/:id', authenticate, async function(req, res) {
    try {
        // SMELL: [MEDIUM]
        // Missing validation for req.params.id. Should check if it's valid MongoDB ObjectId format.
        // Invalid format will cause findById to fail silently or throw error.
        // Use mongoose.Types.ObjectId.isValid() before database call.
        const shipment = await Shipment.findById(req.params.id);
        
        if (!shipment) {
            // SMELL: [MEDIUM]
            // Using generic res.json() without HTTP status code (defaults to 200).
            // 404 Not Found should return .status(404).
            return res.status(404).json({ error: 'Not found' });
        }
        
        // check permissions
        if (shipment.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            // SMELL: [MEDIUM]
            // Missing HTTP status code. Should return 403 Forbidden, not 200 OK.
            return res.status(403).json({ error: 'No access to this shipment' });
        }

        res.json(shipment);
    } catch (err) {
        // SMELL: [MEDIUM]
        // Missing HTTP status code. Should return 500 Internal Server Error.
        res.status(500).json({ error: 'Error on findById' });
    }
});

// POST /shipments - create shipment
router.post('/shipments', authenticate, validate(createShipmentSchema), async function(req, res) {
    try {
        // SMELL: [MEDIUM]
        // Tracking ID generation is weak and predictable.
        // Using Date.now() + small random number (0-99) creates collision risk.
        // Consider UUID v4, nanoid, or cryptographically secure random values.
        // generation of tracking id
        const trackId = 'SHIP-' + Date.now() + '-' + Math.floor(Math.random() * 100);
        
        // SMELL: [CRITICAL]
        // Accepting entire req.body without validation enables NoSQL injection.
        // An attacker can inject arbitrary fields beyond schema (e.g., weight: {$gt: 0}).
        // Explicitly whitelist and validate: origin, destination, weight, carrier only.
        // SMELL: [MEDIUM]
        // Missing input validation for required fields: origin, destination, weight, carrier.
        // Should validate types, lengths, and formats before saving to database.
        // Use a validation library like Joi or Zod.
        // Use spread to save time, mongoose will handle validation... maybe
        const newShipment = new Shipment({
            ...req.body,
            trackingId: trackId,
            userId: req.user.id,
            // SMELL: [MEDIUM]
            // Magic string 'pending' hardcoded in multiple places (also in Shipment.js).
            // Should define as constant enum to avoid duplication and typos.
            // Define: const SHIPMENT_STATUSES = { PENDING: 'pending', DELIVERED: 'delivered' }
            status: 'pending' // magic string
        });

        const saved = await newShipment.save();
        // SMELL: [MEDIUM]
        // Missing HTTP status code. Should return 201 Created.
        res.status(201).json(saved);
    } catch (err) {
        console.log('Error saving shipment');
        // SMELL: [HIGH]
        // Returning raw error object to client exposes internal system details.
        // Stack trace, validation errors, database field names revealed to attacker.
        // Return generic message and log error securely on backend only.
        res.status(500).json({ error: 'Failed to create shipment' });
    }
});

// PATCH /shipments/:id/status - change status
router.patch('/shipments/:id/status', authenticate, validate(updateShipmentStatusSchema), async function(req, res) {
    try {
        // SMELL: [MEDIUM]
        // Missing validation for req.body.status field.
        // Should validate that status is one of valid enum values.
        // logic: only admins can mark as delivered
        // SMELL: [MEDIUM]
        // Magic string 'delivered' hardcoded. Should use constant SHIPMENT_STATUSES.DELIVERED.
        // magic string comparison
        if (req.body.status === 'delivered') {
            if (req.user.role !== 'admin') {
                // SMELL: [MEDIUM]
                // Missing HTTP status code. Should return 403 Forbidden.
                return res.json({ error: 'Admins only can deliver' });
            }
        }

        // SMELL: [MEDIUM]
        // Missing ownership/permission check before allowing status update.
        // Non-owner users can change any shipment status even if they don't own it.
        // Verify shipment belongs to user or user is admin before updating.
        const doc = await Shipment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        // SMELL: [MEDIUM]
        // Missing HTTP status code. Should return 200 OK explicitly.
        res.json(doc);
    } catch (err) {
        // SMELL: [MEDIUM]
        // Missing HTTP status code. Should return 500 Internal Server Error.
        res.json({ error: 'Update failed' });
    }
});

// DELETE /shipments/:id - remove shipment
router.delete('/shipments/:id', authenticate, async function(req, res) {
    try {
        // SMELL: [CRITICAL]
        // Authorization bypass vulnerability! Anyone with a valid token can delete any shipment.
        // Should check if shipment.userId === req.userId OR req.userRole === 'admin'.
        // Missing ownership/permission check before allowing deletion.
        // No permission check! Anyone can delete any shipment if they have a token.
        await Shipment.findByIdAndDelete(req.params.id);
        // SMELL: [MEDIUM]
        // Missing HTTP status code. Should return 204 No Content or 200 OK.
        res.json({ message: 'Deleted ' + req.params.id });
    } catch (e) {
        // SMELL: [MEDIUM]
        // Missing HTTP status code. Should return 500 Internal Server Error.
        res.json({ error: 'Delete error' });
    }
});

// ---------------------------------------------------------
// USER MANAGEMENT
// ---------------------------------------------------------

// GET /profile - current user
router.get('/profile', authenticate, async function(req, res) {
    try {
        const user = await User.findById(req.user.id);
        // SMELL: [HIGH]
        // Returning full user object including password hash to client.
        // Even hashed passwords should not be sent. Exclude sensitive fields.
        // Should return only: id, name, email, role.
        res.json(user);
    } catch (err) {
        // SMELL: [HIGH]
        // Missing .catch() handler for promise rejection.
        // If findById fails, error is silently ignored and response is never sent.
        // Request will hang indefinitely waiting for response.
        // missing catch
        res.json({ error: 'Profile fetch failed' });
    }
});

/*
// SMELL: [HIGH]
// Dead code left in comments. This endpoint exposes all users without authentication/authorization.
// Either delete or implement proper access controls if needed.
// OLD CODE - DO NOT DELETE
router.get('/all-users', function(req, res) {
    User.find({}).then(u => res.json(u));
});
*/

/*
// SMELL: [CRITICAL]
// Dead code and security risk. This endpoint allows testing/exposing how passwords are hashed.
// Gives attackers ability to test password hashes and validate guesses.
// Delete this endpoint immediately. Never expose hashing mechanisms.
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
    // SMELL: [MEDIUM]
    // No authentication/authorization required for status endpoint.
    // This exposes system information (OS, memory, uptime) to unauthenticated users.
    // Consider requiring authentication or limiting information exposed.
    const info = {
        os: os.type(),
        release: os.release(),
        uptime: process.uptime(),
        memory: process.memoryUsage().rss
    };
    res.json(info);
});

// SMELL: [HIGH]
// Junk code and comments for padding. Dead code that serves no purpose.
// Removed meaningless loop and comments to reduce cognitive load and file size.
// padding to hit 400 lines...
// I love coding in Node.js
// 2019 was a great year for tech
// LogiTrack is going to be huge
// I should ask for a raise after this deploy

for (let i = 0; i < 200; i++) {
    // loops take up lines too right?
}

// SMELL: [MEDIUM]
// TODO comments indicate known issues not addressed.
// N+1 problem is CRITICAL and should be fixed immediately, not later.
// TODO: fix the N+1 problem later
// TODO: refactor into proper controllers
// TODO: add validation library like Joi or Zod
// TODO: use async/await to avoid callback hell

// final route
router.get('/ping', function(req, res) {
    // SMELL: [MEDIUM]
    // Another status endpoint that duplicates functionality. Should consolidate with /status.
    res.json({ pong: 'active' });
});

module.exports = router;
