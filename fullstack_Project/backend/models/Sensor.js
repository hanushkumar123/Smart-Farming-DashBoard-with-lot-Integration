const mongoose = require('mongoose');

const SensorSchema = new mongoose.Schema({
    sensorId: { type: String, required: true, unique: true },
    type: {
        type: String,
        required: true,
        enum: ['Moisture', 'Temperature', 'Humidity', 'Light', 'Other']
    },
    assignedField: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Field'
    },
    minThreshold: { type: Number },
    maxThreshold: { type: Number },
    status: {
        type: String,
        required: true,
        enum: ['Enabled', 'Disabled'],
        default: 'Enabled'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Sensor', SensorSchema);
