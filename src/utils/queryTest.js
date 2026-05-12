/**
 * Query Performance Test Utilities
 * Use for before/after comparisons
 */

const queryDebug = require('./queryDebug');

/**
 * Test wrapper that measures query count
 * Executes test function while tracking database queries and timing
 * @param {string} testName - Human-readable test name for logging
 * @param {Function} testFn - Async test function to execute
 * @returns {Promise<*>} Result from testFn execution
 * @throws {Error} Re-throws any error from testFn after logging failure
 */
exports.testWithQueryLogging = async (testName, testFn) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Test: ${testName}`);
    console.log('='.repeat(60));

    queryDebug.startTracking();
    const startTime = Date.now();

    try {
        const result = await testFn();
        const duration = Date.now() - startTime;
        const summary = queryDebug.getSummary();

        console.log(`\n✅ Test completed in ${duration}ms`);
        console.log(`📊 Total queries: ${summary.totalQueries}`);
        console.log('\nQuery Log:');
        summary.queryLog.forEach(log => {
            console.log(`  #${log.count}: ${log.operation} on ${log.model}`);
        });

        return result;
    } catch (err) {
        console.error(`\n❌ Test failed: ${err.message}`);
        throw err;
    } finally {
        queryDebug.resetTracking();
    }
};

/**
 * Comparison test - run before and after optimizations
 * Executes beforeFn and afterFn, logs query counts and percentage improvement
 * @param {string} testName - Comparison test name for logging
 * @param {Function} beforeFn - Async function representing unoptimized code
 * @param {Function} afterFn - Async function representing optimized code
 * @returns {Promise<void>}
 */
exports.compareQueryCounts = async (testName, beforeFn, afterFn) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Comparison: ${testName}`);
    console.log('='.repeat(60));

    // Test before
    queryDebug.startTracking();
    try {
        await beforeFn();
    } catch (err) {
        console.error('Before test error:', err.message);
    }
    const beforeCount = queryDebug.getQueryCount();
    queryDebug.resetTracking();

    // Test after
    queryDebug.startTracking();
    try {
        await afterFn();
    } catch (err) {
        console.error('After test error:', err.message);
    }
    const afterCount = queryDebug.getQueryCount();
    queryDebug.resetTracking();

    const improvement = ((beforeCount - afterCount) / beforeCount * 100).toFixed(1);

    console.log(`\n📊 Query Count Comparison:`);
    console.log(`   Before optimization: ${beforeCount} queries`);
    console.log(`   After optimization:  ${afterCount} queries`);
    console.log(`   Improvement:         ${improvement}% reduction ✅`);
};
