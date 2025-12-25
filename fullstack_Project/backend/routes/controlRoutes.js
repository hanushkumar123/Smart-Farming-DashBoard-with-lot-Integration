const express = require('express');
const router = express.Router();
const { controlDevice } = require('../controllers/deviceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/pump', protect, controlDevice);

module.exports = router;
