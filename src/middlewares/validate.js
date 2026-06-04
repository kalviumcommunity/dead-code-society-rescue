const allowedShipmentStatuses = ['pending', 'in-progress', 'delivered', 'cancelled'];

function requireFields(fields) {
    return function(req, res, next) {
        const missing = fields.filter(function(field) {
            return req.body[field] === undefined || req.body[field] === null || req.body[field] === '';
        });

        if (missing.length > 0) {
            return res.status(400).json({
                error: 'Missing required fields',
                missing: missing
            });
        }

        return next();
    };
}

function validateRegister(req, res, next) {
    return requireFields(['name', 'email', 'password'])(req, res, next);
}

function validateLogin(req, res, next) {
    return requireFields(['email', 'password'])(req, res, next);
}

function validateShipmentCreate(req, res, next) {
    return requireFields(['origin', 'destination', 'weight', 'carrier'])(req, res, next);
}

function validateShipmentStatus(req, res, next) {
    if (allowedShipmentStatuses.indexOf(req.body.status) === -1) {
        return res.status(400).json({
            error: 'Invalid shipment status',
            allowed: allowedShipmentStatuses
        });
    }

    return next();
}

module.exports = {
    validateRegister: validateRegister,
    validateLogin: validateLogin,
    validateShipmentCreate: validateShipmentCreate,
    validateShipmentStatus: validateShipmentStatus
};