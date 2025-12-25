const mongoose = require('mongoose');

const MachineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: ['Tractor', 'Drone', 'Sensor', 'Harvester', 'Tool', 'Other']
    },
    status: {
        type: String,
        required: true,
        enum: ['Active', 'Charging', 'Maintenance', 'Offline'],
        default: 'Active'
    },
    batteryLevel: { type: Number, default: 100 }, // Percentage
    fuelLevel: { type: Number }, // For gas types
    lastMaintenance: { type: Date, default: Date.now },
    maintenanceInterval: { type: Number, default: 30 }, // Days
    nextMaintenance: { type: Date },
    imageUrl: { type: String }, // URL or local asset path
    notes: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('Machine', MachineSchema);
