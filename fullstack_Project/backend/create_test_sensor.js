const dotenv = require('dotenv');

dotenv.config();

const createSensor = async () => {
    try {
        // Need to login first to get token
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@smartfarm.com',
                password: 'password123'
            })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Logged in, token obtained.');

        const sensorData = {
            sensorId: 'TEST-DELETE-ME',
            type: 'Moisture',
            status: 'Enabled',
            minThreshold: 10,
            maxThreshold: 90
        };

        const res = await fetch('http://localhost:5000/api/sensors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(sensorData)
        });
        const data = await res.json();
        console.log('Sensor created:', data);
    } catch (error) {
        console.error('Error:', error);
    }
};

createSensor();
