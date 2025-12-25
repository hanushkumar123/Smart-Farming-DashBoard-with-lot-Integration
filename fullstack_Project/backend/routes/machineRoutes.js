const express = require('express');
const router = express.Router();
const {
    getMachines,
    createMachine,
    updateMachine,
    deleteMachine
} = require('../controllers/machineController');

router.route('/')
    .get(getMachines)
    .post(createMachine);

router.route('/:id')
    .put(updateMachine)
    .delete(deleteMachine);

module.exports = router;
