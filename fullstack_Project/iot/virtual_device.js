/**
 * Virtual IoT Device Simulator for Smart Farming Dashboard
 * 
 * This script mimics the behavior of an ESP32 sensor node.
 * It generates realistic random sensor data and sends it to the backend.
 * It also polls the backend for control commands (e.g., turning the pump on/off).
 * 
 * Usage: node iot/virtual_device.js
 */

const http = require('http');

// Configuration
const CONFIG = {
    SERVER_HOST: 'localhost',
    SERVER_PORT: 5000,
    DEVICE_ID: 'ESP32_MAIN', // Must match backend
    POLL_INTERVAL: 5000,     // 5 Seconds
};

// State
let pumpState = false;

// Helpers for Console Colors
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    blue: "\x1b[34m"
};

console.log(`${colors.bright}${colors.cyan}=== Smart Farm Virtual IoT Device Started ===${colors.reset}`);
console.log(`Target Server: http://${CONFIG.SERVER_HOST}:${CONFIG.SERVER_PORT}`);
console.log(`Device ID: ${CONFIG.DEVICE_ID}\n`);

// Function to generate random float between min and max
const random = (min, max) => (Math.random() * (max - min) + min).toFixed(1);
// Function to generate random int
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// Main Interval Loop
setInterval(() => {
    runCycle();
}, CONFIG.POLL_INTERVAL);

async function runCycle() {
    console.log(`${colors.reset}----------------------------------------`);
    const timestamp = new Date().toLocaleTimeString();

    // 1. Generate Sensor Data
    // Simulate slight fluctuations
    const temperature = random(22, 28);      // 22-28 Celsius
    const humidity = random(40, 60);         // 40-60 %
    const soilMoisture = randomInt(20, 80);  // 20-80 % (Varies widely to test alerts)
    const light = randomInt(200, 800);       // Lux
    const waterLevel = randomInt(50, 100);   // Tank Level %

    const payload = JSON.stringify({
        temperature: parseFloat(temperature),
        humidity: parseFloat(humidity),
        soilMoisture: soilMoisture,
        light: light,
        waterLevel: waterLevel
    });

    // 2. Send Data (POST)
    postData('/api/sensors', payload, (res) => {
        if (res.statusCode === 201 || res.statusCode === 200) {
            console.log(`[${timestamp}] ${colors.green}✔ Data Sent${colors.reset}: Temp ${temperature}°C, Moist ${soilMoisture}%, Light ${light}lx`);

            // Check for local alert simulation logic
            if (soilMoisture < 30) console.log(`   ${colors.red}⚠ ALERT: Soil Moisture Low!${colors.reset}`);
            if (temperature > 30) console.log(`   ${colors.red}⚠ ALERT: High Temperature!${colors.reset}`);

        } else {
            console.log(`[${timestamp}] ${colors.red}✘ Data Send Failed${colors.reset}: Status ${res.statusCode}`);
        }
    });

    // 3. Check Control Status (GET)
    getData('/api/device/status', (data) => {
        if (data) {
            try {
                const status = JSON.parse(data);
                const isPumpOn = status.isIrrigationOn;

                // State Change Logic
                if (isPumpOn !== pumpState) {
                    pumpState = isPumpOn;
                    if (pumpState) {
                        console.log(`[${timestamp}] ${colors.bright}${colors.blue}💦 COMMAND RECEIVED: Pump Turned ON${colors.reset}`);
                    } else {
                        console.log(`[${timestamp}] ${colors.yellow}🛑 COMMAND RECEIVED: Pump Turned OFF${colors.reset}`);
                    }
                } else {
                    // Status check ok, no change
                    // console.log(`[${timestamp}] Pump Status: ${pumpState ? 'ON' : 'OFF'}`);
                }

                if (status.autoMode) {
                    console.log(`   ${colors.cyan}🤖 Auto Mode Active${colors.reset}`);
                }

            } catch (e) {
                console.error('Error parsing status:', e.message);
            }
        }
    });

}

// Generic HTTP POST Helper
function postData(path, data, callback) {
    const options = {
        hostname: CONFIG.SERVER_HOST,
        port: CONFIG.SERVER_PORT,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    const req = http.request(options, (res) => {
        callback(res);
    });

    req.on('error', (error) => {
        console.error(`${colors.red}Server Error:${colors.reset} ${error.message}`);
    });

    req.write(data);
    req.end();
}

// Generic HTTP GET Helper
function getData(path, callback) {
    const options = {
        hostname: CONFIG.SERVER_HOST,
        port: CONFIG.SERVER_PORT,
        path: path,
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            callback(data);
        });
    });

    req.on('error', (error) => {
        // Suppress tedious connection errors in loop
    });

    req.end();
}
