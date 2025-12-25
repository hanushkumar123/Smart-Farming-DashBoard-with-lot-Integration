const Template = require('../models/Template');
const Log = require('../models/Log');

// @desc    Get all templates
// @route   GET /api/templates
// @access  Private
const getTemplates = async (req, res, next) => {
    try {
        const templates = await Template.find({}).sort({ createdAt: -1 });
        res.json(templates);
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new template
// @route   POST /api/templates
// @access  Private
const createTemplate = async (req, res, next) => {
    try {
        const { name, type, config, description } = req.body;

        const template = await Template.create({
            name,
            type,
            config,
            description,
            createdBy: req.user ? req.user.email : 'Unknown'
        });

        // Log action
        try {
            await Log.create({
                actionType: 'Create',
                entity: 'Template',
                entityId: template._id,
                description: `Created template: ${name} (${type})`,
                user: req.user ? req.user.email : 'System'
            });
        } catch (logError) {
            console.error('Logging failed:', logError);
        }

        res.status(201).json(template);
    } catch (error) {
        next(error);
    }
};

// @desc    Update template
// @route   PUT /api/templates/:id
// @access  Private
const updateTemplate = async (req, res, next) => {
    try {
        const template = await Template.findById(req.params.id);

        if (template) {
            template.name = req.body.name || template.name;
            template.type = req.body.type || template.type;
            template.config = req.body.config || template.config;
            template.description = req.body.description || template.description;

            const updatedTemplate = await template.save();

            // Log action
            try {
                await Log.create({
                    actionType: 'Update',
                    entity: 'Template',
                    entityId: template._id,
                    description: `Updated template: ${template.name}`,
                    user: req.user ? req.user.email : 'System'
                });
            } catch (logError) {
                console.error('Logging failed:', logError);
            }

            res.json(updatedTemplate);
        } else {
            res.status(404);
            throw new Error('Template not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete template
// @route   DELETE /api/templates/:id
// @access  Private
const deleteTemplate = async (req, res, next) => {
    try {
        const id = req.params.id.trim();
        const template = await Template.findById(id);

        if (template) {
            await Template.deleteOne({ _id: id });

            // Log action
            try {
                await Log.create({
                    actionType: 'Delete',
                    entity: 'Template',
                    entityId: id,
                    description: `Deleted template: ${template.name}`,
                    user: req.user ? req.user.email : 'System'
                });
            } catch (logError) {
                console.error('Logging failed:', logError);
            }

            res.json({ message: 'Template removed' });
        } else {
            res.status(404);
            throw new Error('Template not found');
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate
};
