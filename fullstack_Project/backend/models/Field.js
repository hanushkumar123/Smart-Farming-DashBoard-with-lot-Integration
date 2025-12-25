const mongoose = require('mongoose');

const FieldSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    size: { type: Number, required: true }, // in acres
    cropType: { type: String, required: true },
    farm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm'
    },
    status: {
        type: String,
        required: true,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Field', FieldSchema);
