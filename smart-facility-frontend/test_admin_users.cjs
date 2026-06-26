555const axios = require('axios');

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

const userService = {
  getAllUsers: async () => {
    const res = await apiClient.get('/users');
    return res.data.data;
  }
};

async function test() {
  try {
    const loginRes = await axios.post('http://localhost:8080/api/auth/login', {
      email: 'admin@gmail.com',
      password: 'password123'
    });
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${loginRes.data.token}`;
    
    const data = await userService.getAllUsers();
    console.log("Returned data type:", Array.isArray(data) ? 'array' : typeof data);
    console.log("Data length:", data ? data.length : 0);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

test();
