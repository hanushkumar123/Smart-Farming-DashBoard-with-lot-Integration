const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
    deviceId: { type: String, required: true, unique: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    isIrrigationOn: { type: Boolean, default: false },
    autoMode: { type: Boolean, default: false },
    location: { type: String },
    totalWaterUsage: { type: Number, default: 0 }, // Liters
    lastRunDuration: { type: Number, default: 0 }, // Minutes
    lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Device', DeviceSchema);
