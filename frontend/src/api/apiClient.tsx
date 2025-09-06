import axios from 'axios';

// Get the token from localStorage
const getAuthToken = (): string | null => {
  try {
    const token = localStorage.getItem('authToken');
    return token;
  } catch (error) {
    console.error('Could not retrieve auth token from localStorage', error);
    return null;
  }
};

// Create an Axios instance with a base URL
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Your FastAPI backend URL
});

// Add a request interceptor to include the Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      // Add the token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

export default apiClient;
