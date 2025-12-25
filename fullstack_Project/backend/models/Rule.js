const mongoose = require('mongoose');

const RuleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    conditionField: { type: String, required: true }, // e.g., 'soilMoisture'
    operator: { type: String, required: true, enum: ['<', '>', '=', '<=', '>='] },
    conditionValue: { type: Number, required: true },
    action: { type: String, required: true }, // e.g., 'Start Irrigation'
    duration: { type: Number }, // in minutes, optional
    mode: {
        type: String,
        required: true,
        enum: ['Manual', 'Auto'],
        default: 'Manual'
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Rule', RuleSchema);
