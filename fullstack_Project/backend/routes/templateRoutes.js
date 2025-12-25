const express = require('express');
const router = express.Router();
const {
    getTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate
} = require('../controllers/templateController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getTemplates)
    .post(protect, createTemplate);

router.route('/:id')
    .put(protect, updateTemplate)
    .delete(protect, deleteTemplate);

module.exports = router;
