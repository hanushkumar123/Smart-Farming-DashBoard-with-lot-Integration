const express = require('express');
const router = express.Router();
const { getLogs, createLog, deleteLog } = require('../controllers/logController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getLogs)
    .post(protect, createLog);

router.route('/:id')
    .delete(protect, deleteLog);

module.exports = router;
