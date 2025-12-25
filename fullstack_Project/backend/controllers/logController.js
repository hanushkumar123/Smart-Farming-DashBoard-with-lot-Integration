const Log = require('../models/Log');

// @desc    Get logs
// @route   GET /api/logs
// @access  Private
const getLogs = async (req, res, next) => {
    try {
        const { actionType, entity, user, search } = req.query;
        let query = {};

        if (actionType) {
            query.actionType = actionType;
        }

        if (entity) {
            query.entity = entity;
        }

        if (user) {
            query.user = { $regex: user, $options: 'i' };
        }

        if (search) {
            query.description = { $regex: search, $options: 'i' };
        }

        // Support simple filtering if needed, otherwise return all sorted by date
        const logs = await Log.find(query).sort({ timestamp: -1 }).limit(1000); // Increased limit
        res.status(200).json(logs);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a log entry (Internal use mainly)
// @route   POST /api/logs
// @access  Private
const createLog = async (req, res, next) => {
    try {
        const log = await Log.create(req.body);
        res.status(201).json(log);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete log entry
// @route   DELETE /api/logs/:id
// @access  Private
// @desc    Delete log entry
// @route   DELETE /api/logs/:id
// @access  Private
const deleteLog = async (req, res, next) => {
    try {
        const id = req.params.id.trim();
        console.log('Backend: Delete log request for ID:', id);

        const log = await Log.findByIdAndDelete(id);
        if (!log) {
            console.log('Backend: Log not found');
            return res.status(404).json({ message: 'Log not found' });
        }

        console.log('Backend: Log deleted successfully');
        res.status(200).json({ message: 'Log deleted', id });
    } catch (error) {
        console.error('Backend: Delete log error:', error);
        next(error);
    }
};

module.exports = {
    getLogs,
    createLog,
    deleteLog
};
