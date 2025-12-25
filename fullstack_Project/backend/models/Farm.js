const mongoose = require('mongoose');

const farmSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a farm name'],
        unique: true
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Farm', farmSchema);
