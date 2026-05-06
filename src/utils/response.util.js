/**
 * Sends a successful JSON response.
 *
 * @param {import('express').Response} res - Express response object.
 * @param {unknown} data - Payload to return to the client.
 * @returns {import('express').Response}
 */
function sendOk(res, data) {
    return res.json(data);
}

/**
 * Sends a created JSON response.
 *
 * @param {import('express').Response} res - Express response object.
 * @param {unknown} data - Payload to return to the client.
 * @returns {import('express').Response}
 */
function sendCreated(res, data) {
    return res.status(201).json(data);
}

module.exports = {
    sendOk,
    sendCreated
};