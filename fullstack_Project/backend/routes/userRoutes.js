const express = require('express');
const router = express.Router();
const {
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    updateUserProfile
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/profile')
    .put(protect, updateUserProfile);

router.route('/')
    .get(protect, admin, getUsers)
    .post(protect, admin, createUser);

router.route('/:id')
    .put(protect, admin, updateUser)
    .delete(protect, admin, deleteUser);

module.exports = router;
