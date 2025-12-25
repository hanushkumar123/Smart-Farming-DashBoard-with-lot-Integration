const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Field = require('./models/Field');

dotenv.config();

const fields = [
    { name: 'Field Alpha', location: 'North Sector', size: 1.5, cropType: 'Wheat', status: 'Active' },
    { name: 'Field Beta', location: 'South Field', size: 2.0, cropType: 'Corn', status: 'Active' },
    { name: 'Field Gamma', location: 'East Ridge', size: 0.8, cropType: 'Rice', status: 'Active' },
    { name: 'Field Delta', location: 'West Valley', size: 3.2, cropType: 'Soybeans', status: 'Active' },
    { name: 'Field Epsilon', location: 'Greenhouse A', size: 0.5, cropType: 'Tomatoes', status: 'Active' },
    { name: 'Plot 101', location: 'Greenhouse B', size: 0.4, cropType: 'Potatoes', status: 'Inactive' },
    { name: 'Plot 102', location: 'Greenhouse C', size: 0.4, cropType: 'Barley', status: 'Active' },
    { name: 'Plot 103', location: 'Orchard Zone C', size: 5.0, cropType: 'Sugarcane', status: 'Active' },
    { name: 'Plot 201', location: 'Riverside Plot', size: 1.2, cropType: 'Cotton', status: 'Active' },
    { name: 'Sector X-1', location: 'Hilltop Area', size: 4.5, cropType: 'Oats', status: 'Active' },
    { name: 'Sector X-2', location: 'North Sector', size: 2.8, cropType: 'Sunflower', status: 'Active' },
    { name: 'Sector Y-1', location: 'South Field', size: 3.0, cropType: 'Alfalfa', status: 'Active' },
    { name: 'Sector Z-9', location: 'East Ridge', size: 1.1, cropType: 'Wheat', status: 'Inactive' }
];

const seedFields = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding Fields');

        await Field.deleteMany(); // Clear existing fields
        console.log('Fields cleared');

        await Field.create(fields);
        console.log('Fields created successfully');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedFields();
