const User = require('../models/User');
const Log = require('../models/Log');
const generateToken = require('../utils/generateToken');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new user
// @route   POST /api/users
// @access  Private/Admin
const fs = require('fs');

const createUser = async (req, res, next) => {
    try {
        fs.appendFileSync('debug.log', `[${new Date().toISOString()}] Entered createUser\n`);
        fs.appendFileSync('debug.log', `Body: ${JSON.stringify(req.body)}\n`);

        console.log('Create User Body:', req.body);
        const { name, email, password, role, status } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            fs.appendFileSync('debug.log', 'User exists\n');
            console.log('User exists');
            res.status(400);
            throw new Error('User already exists');
        }

        // Create user
        console.log('Creating DB entry...');
        fs.appendFileSync('debug.log', 'About to create user...\n');

        const user = await User.create({
            name,
            email,
            password,
            role,
            status
        });

        fs.appendFileSync('debug.log', `User created: ${user._id}\n`);

        if (user) {
            // Log creation (Non-blocking)
            try {
                fs.appendFileSync('debug.log', 'About to log action...\n');
                await Log.create({
                    actionType: 'Create',
                    entity: 'User',
                    entityId: user._id,
                    description: `Created user ${user.name} (${user.role})`,
                    user: req.user ? req.user.email : 'System'
                });
                fs.appendFileSync('debug.log', 'Action logged.\n');
            } catch (logError) {
                console.error('Logging failed:', logError.message);
                fs.appendFileSync('debug.log', `Logging failed: ${logError.message}\n`);
            }

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        fs.appendFileSync('debug.log', `Caught Error: ${error.message}\nStack: ${error.stack}\n`);
        console.error('Create User Error:', error);
        res.status(500).json({
            message: error.message || 'Unknown Error',
            stack: error.stack
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            // Log update
            await Log.create({
                actionType: 'Update',
                entity: 'User',
                entityId: user._id,
                description: `User updated own profile`,
                user: updatedUser.email
            });

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                status: updatedUser.status,
                token: generateToken(updatedUser._id),
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.role = req.body.role || user.role;
            user.status = req.body.status || user.status;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            // Log update
            await Log.create({
                actionType: 'Update',
                entity: 'User',
                entityId: user._id,
                description: `Updated user ${user.name}`,
                user: req.user.email
            });

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                status: updatedUser.status
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await User.deleteOne({ _id: user._id });

            // Log deletion
            await Log.create({
                actionType: 'Delete',
                entity: 'User',
                entityId: req.params.id,
                description: `Deleted user ${user.name}`,
                user: req.user.email
            });

            res.json({ message: 'User removed' });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    updateUserProfile
};
