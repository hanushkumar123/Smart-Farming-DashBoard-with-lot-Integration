const Farm = require('../models/Farm');
const Log = require('../models/Log');

// @desc    Get all farms
// @route   GET /api/farms
// @access  Private
const getFarms = async (req, res, next) => {
    try {
        const farms = await Farm.find({});
        res.json(farms);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new farm
// @route   POST /api/farms
// @access  Private
const createFarm = async (req, res, next) => {
    try {
        const { name, location, description, status } = req.body;

        const farm = await Farm.create({
            name,
            location,
            description,
            status,
            user: req.user._id
        });

        if (farm) {
            // Log creation
            await Log.create({
                actionType: 'Create',
                entity: 'Farm',
                entityId: farm._id,
                description: `Created farm ${farm.name}`,
                user: req.user.email
            });

            res.status(201).json(farm);
        } else {
            res.status(400);
            throw new Error('Invalid farm data');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update farm
// @route   PUT /api/farms/:id
// @access  Private
const updateFarm = async (req, res, next) => {
    try {
        const farm = await Farm.findById(req.params.id);

        if (farm) {
            farm.name = req.body.name || farm.name;
            farm.location = req.body.location || farm.location;
            farm.description = req.body.description || farm.description;
            farm.status = req.body.status || farm.status;

            const updatedFarm = await farm.save();

            // Log update
            await Log.create({
                actionType: 'Update',
                entity: 'Farm',
                entityId: farm._id,
                description: `Updated farm ${farm.name}`,
                user: req.user.email
            });

            res.json(updatedFarm);
        } else {
            res.status(404);
            throw new Error('Farm not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete farm
// @route   DELETE /api/farms/:id
// @access  Private
const deleteFarm = async (req, res, next) => {
    try {
        const farm = await Farm.findById(req.params.id);

        if (farm) {
            await Farm.deleteOne({ _id: farm._id });

            // Log deletion
            await Log.create({
                actionType: 'Delete',
                entity: 'Farm',
                entityId: req.params.id,
                description: `Deleted farm ${farm.name}`,
                user: req.user.email
            });

            res.json({ message: 'Farm removed' });
        } else {
            res.status(404);
            throw new Error('Farm not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getFarms,
    createFarm,
    updateFarm,
    deleteFarm
};
