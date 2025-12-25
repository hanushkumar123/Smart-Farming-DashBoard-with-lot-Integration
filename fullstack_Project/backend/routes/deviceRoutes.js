const express = require('express');
const router = express.Router();
const { controlDevice, getDeviceStatus } = require('../controllers/deviceController');
const { protect } = require('../middleware/authMiddleware');

// Control route moved to controlRoutes.js to match spec /api/control/pump
router.get('/status', getDeviceStatus);

module.exports = router;
