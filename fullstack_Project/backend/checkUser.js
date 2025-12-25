const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const user = await User.findOne({ email: 'admin@smartfarm.com' });
        console.log('User found:', user ? 'YES' : 'NO');
        if (user) {
            console.log('User Details:', {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                passwordHash: user.password ? user.password.substring(0, 10) + '...' : 'MISSING'
            });
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

check();
