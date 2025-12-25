const fs = require('fs');

const debugCreate = async () => {
    try {
        let token;
        if (fs.existsSync('token.json')) {
            const content = fs.readFileSync('token.json', 'utf8').replace(/^\uFEFF/, '');
            token = JSON.parse(content).token;
        } else {
            console.log("Token file not found, using hardcoded/login...");
            // Hardcode or fail. Let's try to fail gracefully
            // Assuming the user has a valid token from previous steps or strict login
            // We can do a login call here if needed
            const loginRes = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'admin@kaafarm.com', password: 'password123' })
            });
            const data = await loginRes.json();
            token = data.token;
            console.log("Got new token via login.");
        }

        console.log('Token ready. Attempting create...');

        const payload = {
            name: "Raj",
            email: "raj@gmail.com",
            password: "password123",
            role: "user",
            status: "Active"
        };

        const res = await fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Raw Response:', text);

        try {
            const json = JSON.parse(text);
            console.log('JSON Response:', json);
        } catch (e) {
            console.log('Response is not JSON');
        }

    } catch (error) {
        console.log('Error:', error.message);
    }
};

debugCreate();
