const Device = require('../models/Device');

// @desc    Control Device (Irrigation)
// @route   POST /api/device/control
// @access  Private
const controlDevice = async (req, res, next) => {
    try {
        const { action, autoMode, deviceId } = req.body;
        // deviceId could be hardcoded for single device setup or passed in

        // Find or create device for demo purposes
        let device = await Device.findOne({ deviceId: deviceId || 'ESP32_MAIN' });
        if (!device) {
            device = await Device.create({ deviceId: deviceId || 'ESP32_MAIN' });
        }

        if (autoMode !== undefined) device.autoMode = autoMode;

        // If not in auto mode, apply manual action
        if (!device.autoMode && action) {
            device.isIrrigationOn = action === 'ON';
        }

        await device.save();
        res.json(device);
    } catch (error) {
        next(error);
    }
};

// @desc    Get Device Status (for polling from IoT)
// @route   GET /api/device/status
// @access  Public (IoT needs to access this)
const getDeviceStatus = async (req, res, next) => {
    try {
        // Return status for the main device
        const device = await Device.findOne({ deviceId: 'ESP32_MAIN' });
        if (!device) return res.json({ isIrrigationOn: false, autoMode: false });
        res.json(device);
    } catch (error) {
        next(error);
    }
};

module.exports = { controlDevice, getDeviceStatus };
