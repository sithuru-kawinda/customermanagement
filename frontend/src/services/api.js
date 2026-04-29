import axios from 'axios';
import { toast } from 'react-toastify';

// Your backend is running on port 8080 with context path /api
const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`📤 Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`📥 Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please try again.');
    } else if (error.response) {
      console.error('API Error:', error.response.data);
      const message = error.response.data?.message || 'An error occurred';
      if (!error.config.url.includes('/health')) {
        toast.error(message);
      }
    } else if (error.request) {
      console.error('No response from server:', error.request);
      if (!error.config.url.includes('/health')) {
        toast.error('Cannot connect to server. Please make sure backend is running on port 8080');
      }
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Customer APIs
export const getCustomers = (page = 0, size = 20, sortBy = 'id', direction = 'ASC') => 
  api.get('/api/customers', {
    params: { page, size, sortBy, direction }
  });

export const getCustomerById = (id) => 
  api.get(`/api/customers/${id}`);

export const createCustomer = (customer) => 
  api.post('/api/customers', customer);

export const updateCustomer = (id, customer) => 
  api.put(`/api/customers/${id}`, customer);

export const deleteCustomer = (id) => 
  api.delete(`/api/customers/${id}`);

export const searchCustomers = (keyword, page = 0, size = 20) => 
  api.get('/api/customers/search', {
    params: { keyword, page, size }
  });

// Bulk upload API
export const bulkUploadCustomers = (formData, onProgress) => {
  return axios.post(`${API_BASE_URL}/api/customers/bulk-upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 600000,
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
};

// Master data APIs
export const getCities = () => 
  api.get('/api/master-data/cities');

export const getCountries = () => 
  api.get('/api/master-data/countries');

// Health check
export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/api/health');
    return response;
  } catch (error) {
    console.error('Health check failed:', error.message);
    throw error;
  }
};

export default api;