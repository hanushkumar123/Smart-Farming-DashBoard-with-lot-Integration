const Rule = require('../models/Rule');
const Log = require('../models/Log');

// @desc    Get all rules
// @route   GET /api/rules
// @access  Private
const getRules = async (req, res, next) => {
    try {
        const rules = await Rule.find().sort({ createdAt: -1 });
        res.status(200).json(rules);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a rule
// @route   POST /api/rules
// @access  Private
const createRule = async (req, res, next) => {
    try {
        const rule = await Rule.create(req.body);

        // Create API Log
        try {
            await Log.create({
                actionType: 'Create',
                entity: 'Rule',
                entityId: rule._id,
                description: `Created rule: ${rule.name}`,
                user: req.user ? req.user.email : 'Unknown'
            });
        } catch (logError) {
            console.error('Logging failed:', logError.message);
        }

        res.status(201).json(rule);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a rule
// @route   PUT /api/rules/:id
// @access  Private
const updateRule = async (req, res, next) => {
    try {
        const rule = await Rule.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!rule) {
            return res.status(404).json({ message: 'Rule not found' });
        }

        // Update API Log
        try {
            await Log.create({
                actionType: 'Update',
                entity: 'Rule',
                entityId: rule._id,
                description: `Updated rule: ${rule.name}`,
                user: req.user ? req.user.email : 'Unknown'
            });
        } catch (logError) {
            console.error('Logging failed:', logError.message);
        }

        res.status(200).json(rule);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a rule
// @route   DELETE /api/rules/:id
// @access  Private
const deleteRule = async (req, res, next) => {
    try {
        const rule = await Rule.findByIdAndDelete(req.params.id);
        if (!rule) {
            return res.status(404).json({ message: 'Rule not found' });
        }

        // Delete API Log
        try {
            await Log.create({
                actionType: 'Delete',
                entity: 'Rule',
                entityId: rule._id,
                description: `Deleted rule: ${rule.name}`,
                user: req.user ? req.user.email : 'Unknown'
            });
        } catch (logError) {
            console.error('Logging failed:', logError.message);
        }

        res.status(200).json({ message: 'Rule deleted', id: req.params.id });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getRules,
    createRule,
    updateRule,
    deleteRule
};
