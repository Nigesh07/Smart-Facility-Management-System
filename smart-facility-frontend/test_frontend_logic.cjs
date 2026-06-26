const axios = require('axios');

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

const categoryService = {
  getActiveCategories: async () => {
    const res = await apiClient.get('/categories');
    return res.data.data;
  }
};

async function test() {
  try {
    const loginRes = await axios.post('http://localhost:8080/api/auth/login', {
      email: 'tickettester@gmail.com',
      password: 'password123'
    });
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${loginRes.data.token}`;
    
    const data = await categoryService.getActiveCategories();
    console.log("Returned data type:", Array.isArray(data) ? 'array' : typeof data);
    console.log("Data length:", data ? data.length : 0);
    console.log("Sample:", data ? data[0] : null);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

test();
