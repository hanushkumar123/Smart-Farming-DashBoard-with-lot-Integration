const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const users = [
    {
        name: 'Admin User',
        email: 'admin@smartfarm.com',
        password: 'password123',
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');

        await User.deleteMany(); // Clear existing users
        console.log('Users cleared');

        await User.create(users);
        console.log('Users created');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
