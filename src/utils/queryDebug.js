/**
 * Database query debugging utility
 * Use to monitor query counts and performance
 */

let queryCount = 0;
let queryLog = [];

/**
 * Start tracking queries
 * Resets query count and log for new test session
 * @returns {void}
 */
exports.startTracking = () => {
    queryCount = 0;
    queryLog = [];
};

/**
 * Get current query count
 * @returns {number} Total number of queries logged in current session
 */
exports.getQueryCount = () => queryCount;

/**
 * Get query log array
 * @returns {Array<Object>} Array of query log entries with count, operation, model, filter, timestamp
 */
exports.getQueryLog = () => queryLog;

/**
 * Log a database query operation
 * Increments counter and stores operation details for performance analysis
 * @param {string} operation - Database operation type (FIND, INSERT, FINDBYID, etc.)
 * @param {string} model - Mongoose model name (User, Shipment, etc.)
 * @param {Object} [filter={}] - Query filter object for logging
 * @returns {void}
 */
exports.logQuery = (operation, model, filter = {}) => {
    queryCount++;
    const query = {
        count: queryCount,
        operation,
        model,
        filter,
        timestamp: new Date().toISOString()
    };
    queryLog.push(query);
    console.log(`[Query #${queryCount}] ${operation} on ${model}`, filter);
};

/**
 * Reset tracking
 * Clears query count and log for new test session
 * @returns {void}
 */
exports.resetTracking = () => {
    queryCount = 0;
    queryLog = [];
};

/**
 * Get summary of all queries in current session
 * Includes total count and full query log
 * @returns {Object} Object with totalQueries number and queryLog array
 */
exports.getSummary = () => {
    return {
        totalQueries: queryCount,
        queryLog
    };
};
