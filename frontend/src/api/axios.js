import axios from 'axios';
import axiosRetry from 'axios-retry';

// Create an instance of axios with retry functionality
const axiosClient = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true
});

// Configure axios-retry to retry failed requests
axiosRetry(axiosClient, {
    retries: 3,
    retryDelay: axiosRetry.exponentialDelay
});

axios.interceptors.response.use(
    response => response,
    error => {
      // Show an alert for Axios errors
      alert(`Axios error: ${error.message}`);
      return Promise.reject(error);
    }
  );

export { axiosClient };
