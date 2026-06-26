const axios = require('axios');

async function test() {
  try {
    const loginRes = await axios.post('http://localhost:8080/api/auth/login', {
      email: 'tickettester@gmail.com',
      password: 'password123'
    });
    const token = loginRes.data.token;
    console.log('Logged in, token:', token);

    const payload = {
      title: 'Test Ticket from Axios',
      description: 'Axios test',
      location: 'Room 101',
      priority: 'HIGH',
      categoryId: 1,
      issueImageUrl: ''
    };

    const res = await axios.post('http://localhost:8080/api/tickets', payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('SUCCESS:', res.data);
  } catch (err) {
    console.error('ERROR:', err.response ? err.response.data : err.message);
  }
}

test();
