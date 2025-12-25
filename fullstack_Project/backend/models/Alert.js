const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
    type: { type: String, required: true }, // e.g., 'Warning', 'Critical'
    message: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    threshold: { type: Number },
    timestamp: { type: Date, default: Date.now },
    viewed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Alert', AlertSchema);
