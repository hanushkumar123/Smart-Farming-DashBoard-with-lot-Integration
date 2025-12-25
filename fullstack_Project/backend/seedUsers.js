const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const seedUsers = async () => {
    try {
        await User.deleteMany();
        console.log('Users cleared...');

        const users = [
            {
                name: 'Admin User',
                email: 'hanu@farm.com',
                password: 'hanu8888',
                role: 'admin',
                status: 'Active'
            },
            {
                name: 'Operator User',
                email: 'operator@kaafarm.com',
                password: 'password123',
                role: 'operator',
                status: 'Active'
            }
        ];

        for (const user of users) {
            await User.create(user);
        }
        console.log('Users Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedUsers();
