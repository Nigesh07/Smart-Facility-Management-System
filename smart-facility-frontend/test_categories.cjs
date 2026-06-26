const axios = require('axios');

async function test() {
  try {
    const loginRes = await axios.post('http://localhost:8080/api/auth/login', {
      email: 'tickettester@gmail.com',
      password: 'password123'
    });
    const token = loginRes.data.token;
    console.log('Logged in, token:', token);

    const res = await axios.get('http://localhost:8080/api/categories?active=true', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('ACTIVE CATEGORIES:', res.data);
  } catch (err) {
    console.error('ERROR:', err.response ? err.response.data : err.message);
  }
}

test();
