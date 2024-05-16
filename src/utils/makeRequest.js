import axios from 'axios';
import { getUserToken } from './Utils';

const apiClient = axios.create({
  baseURL: 'https://financial-management-backend-one.vercel.app/', // Base API URL
  // baseURL: 'http://localhost:8000/', // Base API UR
  headers: {
    'Content-Type': 'application/json',
  },
});
// Request interceptor for adding authorization header with bearer token
apiClient.interceptors.request.use((config) => {
  const token = getUserToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const makeRequest = async (url, method = 'get', data = null, customHeaders = {}) => {
  try {
    const config = {
      url,
      method,
      data,
      headers: {
        ...apiClient.defaults.headers,
        ...customHeaders,
      },
    };
    const response = await apiClient.request(config);
    return response.data;
  } catch (error) {
    console.error('Request Error:', error);
    throw error;
  }
};
