const express = require('express');
const router = express.Router();
const { getSensors, createSensor, updateSensor, deleteSensor } = require('../controllers/sensorController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getSensors)
    .post(protect, createSensor);

router.route('/:id')
    .put(protect, updateSensor)
    .delete(protect, deleteSensor);

module.exports = router;
