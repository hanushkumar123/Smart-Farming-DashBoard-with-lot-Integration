const Machine = require('../models/Machine');

// @desc    Get all machines
// @route   GET /api/machines
// @access  Public (or Private)
const getMachines = async (req, res) => {
    try {
        const machines = await Machine.find({});
        res.json(machines);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a machine
// @route   POST /api/machines
// @access  Public
const createMachine = async (req, res) => {
    try {
        const { name, type, status, batteryLevel, imageUrl, notes } = req.body;
        const machine = new Machine({
            name,
            type,
            status,
            batteryLevel: batteryLevel ? Number(batteryLevel) : 100,
            imageUrl,
            notes
        });
        const createdMachine = await machine.save();
        res.status(201).json(createdMachine);
    } catch (error) {
        res.status(400).json({ message: 'Invalid machine data' });
    }
};

// @desc    Update a machine
// @route   PUT /api/machines/:id
// @access  Public
const updateMachine = async (req, res) => {
    try {
        const machine = await Machine.findById(req.params.id);

        if (machine) {
            machine.name = req.body.name || machine.name;
            machine.type = req.body.type || machine.type;
            machine.status = req.body.status || machine.status;
            if (req.body.batteryLevel !== undefined) {
                machine.batteryLevel = Number(req.body.batteryLevel);
            }
            machine.imageUrl = req.body.imageUrl || machine.imageUrl;
            machine.notes = req.body.notes || machine.notes;
            machine.lastMaintenance = req.body.lastMaintenance || machine.lastMaintenance;

            const updatedMachine = await machine.save();
            res.json(updatedMachine);
        } else {
            res.status(404).json({ message: 'Machine not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a machine
// @route   DELETE /api/machines/:id
// @access  Public
const deleteMachine = async (req, res) => {
    try {
        const machine = await Machine.findById(req.params.id);

        if (machine) {
            await machine.deleteOne();
            res.json({ message: 'Machine removed' });
        } else {
            res.status(404).json({ message: 'Machine not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getMachines,
    createMachine,
    updateMachine,
    deleteMachine
};
