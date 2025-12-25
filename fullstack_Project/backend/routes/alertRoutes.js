const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res, next) => {
    try {
        const alerts = await Alert.find().sort({ timestamp: -1 }).limit(20);
        res.json(alerts);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
