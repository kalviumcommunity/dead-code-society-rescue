/**
 * Query Optimization Test Examples
 * 
 * Before running these tests:
 * 1. npm install mongoose (should already be installed)
 * 2. Ensure MongoDB is running
 * 3. Update DB_URL in your .env
 */

// Example 1: Track a single operation
/*
const queryDebug = require('./src/utils/queryDebug');
const shipmentService = require('./src/services/shipmentService');

async function testSingleOperation() {
    // Start tracking
    queryDebug.startTracking();
    
    // Perform operation
    const shipments = await shipmentService.getUserShipments('user123');
    
    // Get results
    const summary = queryDebug.getSummary();
    console.log(`Total queries: ${summary.totalQueries}`);
    console.log(`Expected: 1 (with .populate())`);
    console.log('Actual queries:', summary.queryLog);
}
*/

// Example 2: Using the test wrapper
/*
const { testWithQueryLogging } = require('./src/utils/queryTest');
const shipmentService = require('./src/services/shipmentService');

async function testWithWrapper() {
    await testWithQueryLogging('Get user shipments', async () => {
        return await shipmentService.getUserShipments('user123');
    });
}
*/

// Example 3: Before/After comparison
/*
const { compareQueryCounts } = require('./src/utils/queryTest');

// Simulate "before" - with N+1 problem
async function simulateN_Plus_One(userId, shipmentIds) {
    // This would be the old code with loop inside query
    let result = [];
    for (const shipId of shipmentIds) {
        // Each iteration = separate query (simulating the old problem)
        result.push(`Query for shipment ${shipId}`);
    }
    return result;
}

// Actual "after" - optimized with populate
async function optimized(userId, shipmentIds) {
    // Single query with populate
    return shipmentIds;
}

async function compare() {
    await compareQueryCounts(
        'Shipment fetch optimization',
        async () => await simulateN_Plus_One('user1', ['ship1', 'ship2', 'ship3']),
        async () => await optimized('user1', ['ship1', 'ship2', 'ship3'])
    );
}
*/

// Example 4: Monitoring production queries
/*
const queryDebug = require('./src/utils/queryDebug');

// Enable at app startup
queryDebug.startTracking();

// ... app runs ...

// Check queries periodically
setInterval(() => {
    const summary = queryDebug.getSummary();
    console.log(`Queries in last interval: ${summary.totalQueries}`);
    
    // Check for suspicious patterns
    const finds = summary.queryLog.filter(q => q.operation.includes('FIND'));
    const inserts = summary.queryLog.filter(q => q.operation.includes('INSERT'));
    const updates = summary.queryLog.filter(q => q.operation.includes('UPDATE'));
    
    console.log(`Reads: ${finds.length}, Writes: ${inserts.length + updates.length}`);
    
    queryDebug.resetTracking();
}, 60000); // Every minute
*/

console.log(`
Query Optimization Testing Guide
================================

1. Single Operation Test:
   npm run test -- --grep "single operation"

2. Before/After Comparison:
   npm run test -- --grep "comparison"

3. Monitor Production:
   - Enable queryDebug.startTracking() in app startup
   - Call queryDebug.getSummary() to get counts
   - Look for unexpected query spikes

4. Red Flags to Watch For:
   - Query count increasing with list size (N+1 problem)
   - Same query running multiple times in sequence
   - Missing .populate() calls for foreign keys

Example Query Log Output:
========================
[Query #1] FIND with POPULATE on Shipment { userId: '507f...' }
[Query #2] INSERT on Shipment { trackingId: 'SHIP-...' }
[Query #3] FINDBYID with POPULATE on Shipment { _id: '60d5...' }

✅ Good: 3 queries, each needed, 1 uses .populate()
❌ Bad: 11 queries (N+1 problem), many find operations in loop

Running Tests:
==============
npm test -- --reporter json > query-test-results.json
npm test -- --reporter html > query-test-results.html
`);
