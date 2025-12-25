const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            const err = new Error('Not authorized, token failed');
            err.status = 401; // helper for error handler
            next(err);
        }
    }

    if (!token) {
        res.status(401);
        const err = new Error('Not authorized, no token');
        err.status = 401;
        next(err);
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401);
        const err = new Error('Not authorized as an admin');
        err.status = 401;
        next(err);
    }
};

module.exports = { protect, admin };
