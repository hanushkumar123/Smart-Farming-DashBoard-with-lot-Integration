const express = require('express');
const router = express.Router();
const { getRules, createRule, updateRule, deleteRule } = require('../controllers/ruleController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getRules)
    .post(protect, createRule);

router.route('/:id')
    .put(protect, updateRule)
    .delete(protect, deleteRule);

module.exports = router;
