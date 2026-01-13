const axios = require('axios');

const baseUrl = 'http://localhost:3000/api/v1';

async function testAuth() {
    try {
        console.log('--- Testing Registration ---');
        const regRes = await axios.post(`${baseUrl}/auth/register`, {
            email: 'newuser@example.com',
            password: 'password123',
            name: 'New User',
            role: 'STUDENT'
        });
        console.log('Registration Success:', regRes.data);
    } catch (e) {
        console.log('Registration Failed:', e.response?.data || e.message);
    }

    try {
        console.log('\n--- Testing Login ---');
        const loginRes = await axios.post(`${baseUrl}/auth/login`, {
            email: 'newuser@example.com',
            password: 'password123'
        });
        console.log('Login Success:', loginRes.data);
    } catch (e) {
        console.log('Login Failed:', e.response?.data || e.message);
    }
}

testAuth();
