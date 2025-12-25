const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const testLogin = async () => {
    try {
        const email = 'admin@kaafarm.com';
        const password = 'password123';

        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found in DB');
        } else {
            console.log(`User found: ${user.email}, Role: ${user.role}, Status: ${user.status}`);
            console.log(`Stored Hash: ${user.password}`);
            const isMatch = await user.matchPassword(password);
            console.log(`Password match result: ${isMatch}`);
        }
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

testLogin();
