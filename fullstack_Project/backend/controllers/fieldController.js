const Field = require('../models/Field');
const Log = require('../models/Log');

// @desc    Get all fields
// @route   GET /api/fields
// @access  Private
const getFields = async (req, res, next) => {
    try {
        const fields = await Field.find().sort({ createdAt: -1 });
        res.status(200).json(fields);
    } catch (error) {
        next(error);
    }
};

// @desc    Create new field
// @route   POST /api/fields
// @access  Private
const createField = async (req, res, next) => {
    try {
        const field = await Field.create(req.body);

        // Create API Log
        try {
            await Log.create({
                actionType: 'Create',
                entity: 'Field',
                entityId: field._id,
                description: `Created field: ${field.name}`,
                user: req.user ? req.user.email : 'Unknown'
            });
        } catch (logError) {
            console.error('Logging failed:', logError.message);
        }

        res.status(201).json(field);
    } catch (error) {
        next(error);
    }
};

// @desc    Update field
// @route   PUT /api/fields/:id
// @access  Private
const updateField = async (req, res, next) => {
    try {
        const field = await Field.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!field) {
            return res.status(404).json({ message: 'Field not found' });
        }

        // Update API Log
        try {
            await Log.create({
                actionType: 'Update',
                entity: 'Field',
                entityId: field._id,
                description: `Updated field: ${field.name}`,
                user: req.user ? req.user.email : 'Unknown'
            });
        } catch (logError) {
            console.error('Logging failed:', logError.message);
        }

        res.status(200).json(field);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete field
// @route   DELETE /api/fields/:id
// @access  Private
const deleteField = async (req, res, next) => {
    try {
        const id = req.params.id.trim();
        console.log('Backend: Delete request received for ID:', id);

        const field = await Field.findByIdAndDelete(id);

        if (!field) {
            console.log('Backend: Field not found');
            return res.status(404).json({ message: 'Field not found' });
        }

        // Delete API Log
        try {
            await Log.create({
                actionType: 'Delete',
                entity: 'Field',
                entityId: field._id,
                description: `Deleted field: ${field.name}`,
                user: req.user ? req.user.email : 'Unknown'
            });
        } catch (logError) {
            console.error('Logging failed:', logError.message);
        }

        console.log('Backend: Field deleted successfully');
        res.status(200).json({ message: 'Field deleted', id });
    } catch (error) {
        console.error('Backend: Delete error:', error);
        next(error);
    }
};

module.exports = {
    getFields,
    createField,
    updateField,
    deleteField
};
