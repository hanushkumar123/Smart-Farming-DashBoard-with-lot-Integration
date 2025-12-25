const mongoose = require('mongoose');

const ChemicalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: ['Pesticide', 'Fertilizer', 'Herbicide', 'Fungicide', 'Other']
    },
    quantity: { type: Number, required: true },
    unit: {
        type: String,
        required: true,
        enum: ['L', 'ml', 'kg', 'g', 'bags', 'bottles']
    },
    expiryDate: { type: Date, required: true },
    supplier: { type: String },
    hazardLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Extreme'],
        default: 'Low'
    },
    description: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('Chemical', ChemicalSchema);
