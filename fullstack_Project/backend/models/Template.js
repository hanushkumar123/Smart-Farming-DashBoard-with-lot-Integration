const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Sensor Config', 'Rule Preset', 'Field Layout', 'Alert Config', 'Report Setup', 'Task Chain', 'Other']
    },
    config: {
        type: mongoose.Schema.Types.Mixed, // Stores JSON configuration
        required: true
    },
    description: {
        type: String
    },
    createdBy: {
        type: String, // User email or ID
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Template', TemplateSchema);
