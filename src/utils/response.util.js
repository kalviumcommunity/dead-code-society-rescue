/**
 * Converts a user document to the public API shape.
 * @param {Object} user - User document or plain object.
 * @returns {{id: string, name: string, email: string, role: string, createdAt?: Date, updatedAt?: Date}} Public user payload.
 */
function serializeUser(user) {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}

/**
 * Creates a standard success response payload.
 * @param {string} message - Human-readable success message.
 * @param {*} data - Response body payload.
 * @returns {{success: true, message: string, data: *}} Structured API response.
 */
function successResponse(message, data) {
    return {
        success: true,
        message,
        data
    };
}

module.exports = {
    serializeUser,
    successResponse
};