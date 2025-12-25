const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    actionType: {
        type: String,
        required: true,
        enum: ['Create', 'Update', 'Delete', 'System']
    },
    entity: { type: String, required: true }, // e.g., 'Field', 'Sensor'
    entityId: { type: String },
    description: { type: String },
    user: { type: String, required: true }, // User email or ID
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', LogSchema);
