const Chemical = require('../models/Chemical');

// @desc    Get all chemicals
// @route   GET /api/chemicals
// @access  Private
const getChemicals = async (req, res) => {
    try {
        const chemicals = await Chemical.find({}).sort({ expiryDate: 1 }); // Sort by expiry closest first
        res.json(chemicals);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add a new chemical
// @route   POST /api/chemicals
// @access  Private
const addChemical = async (req, res) => {
    const { name, type, quantity, unit, expiryDate, supplier, hazardLevel, description } = req.body;

    try {
        const chemical = new Chemical({
            name,
            type,
            quantity: Number(quantity),
            unit,
            expiryDate,
            supplier,
            hazardLevel,
            description
        });

        const createdChemical = await chemical.save();
        res.status(201).json(createdChemical);
    } catch (error) {
        res.status(400).json({ message: 'Invalid chemical data' });
    }
};

// @desc    Delete a chemical
// @route   DELETE /api/chemicals/:id
// @access  Private
const deleteChemical = async (req, res) => {
    try {
        const chemical = await Chemical.findById(req.params.id);

        if (chemical) {
            await chemical.deleteOne();
            res.json({ message: 'Chemical removed' });
        } else {
            res.status(404).json({ message: 'Chemical not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getChemicals,
    addChemical,
    deleteChemical
};
