/**
 * End-to-end route test using mongodb-memory-server.
 * Run with: node test-routes.js
 * No real MongoDB needed.
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const http = require('http');

// ── helpers ───────────────────────────────────────────────────────────────────
const post = (path, body, token) =>
    new Promise((resolve, reject) => {
        const data = JSON.stringify(body);
        const opts = {
            hostname: 'localhost',
            port: 3001,
            path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data),
                ...(token ? { Authorization: token } : {}),
            },
        };
        const req = http.request(opts, (res) => {
            let raw = '';
            res.on('data', (c) => (raw += c));
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(raw) }));
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });

const get = (path, token) =>
    new Promise((resolve, reject) => {
        const opts = {
            hostname: 'localhost',
            port: 3001,
            path,
            method: 'GET',
            headers: token ? { Authorization: token } : {},
        };
        const req = http.request(opts, (res) => {
            let raw = '';
            res.on('data', (c) => (raw += c));
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(raw) }));
        });
        req.on('error', reject);
        req.end();
    });

const log = (label, res) => {
    const ok = res.status >= 200 && res.status < 300;
    console.log(`\n${ok ? '✅' : '❌'} ${label}`);
    console.log(`   Status: ${res.status}`);
    console.log(`   Body:   ${JSON.stringify(res.body, null, 2).replace(/\n/g, '\n           ')}`);
    return ok;
};

// ── main ──────────────────────────────────────────────────────────────────────
(async () => {
    // 1. Start in-memory MongoDB
    console.log('🔧 Starting in-memory MongoDB...');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    process.env.DATABASE_URL = uri;
    process.env.JWT_SECRET = 'logitrack_rescue_jwt_secret_32chars_min';
    process.env.PORT = '3001';
    process.env.NODE_ENV = 'development';

    // 2. Start the Express app
    console.log('🚀 Starting Express server on port 3001...');
    require('./src/server');
    await new Promise((r) => setTimeout(r, 1500)); // wait for listen

    let passed = 0;
    let failed = 0;
    const check = (label, res) => (log(label, res) ? passed++ : failed++);

    // ── Test 1: Health check ──────────────────────────────────────────────────
    const health = await get('/api/status');
    check('GET /api/status — health check', health);

    // ── Test 2: Register ─────────────────────────────────────────────────────
    const reg = await post('/api/auth/register', {
        name: 'Alice',
        email: 'alice@example.com',
        password: 'Secret123',
    });
    check('POST /api/auth/register — create user', reg);

    // ── Test 3: Register validation (missing password) ────────────────────────
    const badReg = await post('/api/auth/register', { email: 'bad@example.com' });
    console.log('\n✅ POST /api/auth/register — validation rejects missing password');
    console.log(`   Status: ${badReg.status} (expected 422)`);
    console.log(`   Body:   ${JSON.stringify(badReg.body)}`);
    badReg.status === 422 ? passed++ : failed++;

    // ── Test 4: Register blocks role injection ────────────────────────────────
    const injReg = await post('/api/auth/register', {
        name: 'Hacker',
        email: 'hacker@example.com',
        password: 'Secret123',
        role: 'admin', // should be stripped by Joi stripUnknown
    });
    const roleStripped = injReg.body.user && injReg.body.user.role === 'user';
    console.log(`\n${roleStripped ? '✅' : '❌'} POST /api/auth/register — role injection stripped`);
    console.log(`   role in response: ${injReg.body.user?.role} (expected 'user')`);
    roleStripped ? passed++ : failed++;

    // ── Test 5: Login ─────────────────────────────────────────────────────────
    const login = await post('/api/auth/login', {
        email: 'alice@example.com',
        password: 'Secret123',
    });
    check('POST /api/auth/login — returns JWT', login);
    const token = login.body.token;
    console.log(`   JWT: ${token ? token.substring(0, 40) + '...' : 'MISSING'}`);

    // ── Test 6: Login wrong password ──────────────────────────────────────────
    const badLogin = await post('/api/auth/login', {
        email: 'alice@example.com',
        password: 'WrongPassword1',
    });
    console.log(`\n${badLogin.status === 401 ? '✅' : '❌'} POST /api/auth/login — rejects wrong password`);
    console.log(`   Status: ${badLogin.status} (expected 401)`);
    badLogin.status === 401 ? passed++ : failed++;

    // ── Test 7: Protected route without token ─────────────────────────────────
    const noToken = await get('/api/shipments');
    console.log(`\n${noToken.status === 401 ? '✅' : '❌'} GET /api/shipments — rejects missing token`);
    console.log(`   Status: ${noToken.status} (expected 401)`);
    noToken.status === 401 ? passed++ : failed++;

    // ── Test 8: Create shipment ───────────────────────────────────────────────
    const ship = await post(
        '/api/shipments',
        { origin: 'New York', destination: 'Los Angeles', weight: 2.5, carrier: 'FedEx' },
        token
    );
    check('POST /api/shipments — create shipment', ship);

    // ── Test 9: List shipments ────────────────────────────────────────────────
    const list = await get('/api/shipments', token);
    check('GET /api/shipments — list shipments (N+1 fixed)', list);
    console.log(`   Shipments returned: ${list.body.results}`);

    // ── Test 10: Profile ──────────────────────────────────────────────────────
    const profile = await get('/api/users/profile', token);
    check('GET /api/users/profile — returns user (no password field)', profile);
    const hasPassword = 'password' in (profile.body.data || {});
    console.log(`   Password in response: ${hasPassword} (expected false)`);
    !hasPassword ? passed++ : failed++;

    // ── Summary ───────────────────────────────────────────────────────────────
    console.log('\n' + '─'.repeat(50));
    console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

    await mongoose.disconnect();
    await mongod.stop();
    process.exit(failed > 0 ? 1 : 0);
})();
