const Sensor = require('../models/Sensor');
const Log = require('../models/Log');

// @desc    Get all sensors
// @route   GET /api/sensors
// @access  Private
const getSensors = async (req, res, next) => {
    try {
        const sensors = await Sensor.find().populate('assignedField', 'name');
        res.status(200).json(sensors);
    } catch (error) {
        next(error);
    }
};

// @desc    Create sensor
// @route   POST /api/sensors
// @access  Private
const createSensor = async (req, res, next) => {
    try {
        const sensor = await Sensor.create(req.body);

        // Create API Log
        try {
            await Log.create({
                actionType: 'Create',
                entity: 'Sensor',
                entityId: sensor._id,
                description: `Created sensor: ${sensor.sensorId}`,
                user: req.user ? req.user.email : 'Unknown'
            });
        } catch (logError) {
            console.error('Logging failed:', logError.message);
        }

        res.status(201).json(sensor);
    } catch (error) {
        next(error);
    }
};

// @desc    Update sensor
// @route   PUT /api/sensors/:id
// @access  Private
const updateSensor = async (req, res, next) => {
    try {
        const sensor = await Sensor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!sensor) {
            return res.status(404).json({ message: 'Sensor not found' });
        }

        // Update API Log
        try {
            await Log.create({
                actionType: 'Update',
                entity: 'Sensor',
                entityId: sensor._id,
                description: `Updated sensor: ${sensor.sensorId}`,
                user: req.user ? req.user.email : 'Unknown'
            });
        } catch (logError) {
            console.error('Logging failed:', logError.message);
        }

        res.status(200).json(sensor);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete sensor
// @route   DELETE /api/sensors/:id
// @access  Private
const deleteSensor = async (req, res, next) => {
    try {
        const sensor = await Sensor.findByIdAndDelete(req.params.id);
        if (!sensor) {
            return res.status(404).json({ message: 'Sensor not found' });
        }

        // Delete API Log
        try {
            await Log.create({
                actionType: 'Delete',
                entity: 'Sensor',
                entityId: sensor._id,
                description: `Deleted sensor: ${sensor.sensorId}`,
                user: req.user ? req.user.email : 'Unknown'
            });
        } catch (logError) {
            console.error('Logging failed:', logError.message);
        }

        res.status(200).json({ message: 'Sensor deleted', id: req.params.id });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSensors,
    createSensor,
    updateSensor,
    deleteSensor
};
