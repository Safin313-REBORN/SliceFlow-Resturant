import axios from 'axios';
import { getMockFallback } from './mockFallback';

const isStaticHost =
  typeof window !== 'undefined' &&
  (window.location.hostname.includes('github.io') ||
   window.location.hostname.includes('pages.dev') ||
   window.location.hostname.includes('surge.sh'));

const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: If running on a static host (GitHub Pages) with no live VITE_API_URL configured,
// immediately resolve with static demo mock data to ensure instant response without 404 network overhead.
api.interceptors.request.use(async (config) => {
  if (isStaticHost && !import.meta.env.VITE_API_URL) {
    const url = config.url || '';
    const method = (config.method || 'get').toLowerCase();
    const mock = getMockFallback(url, method, config.data);
    if (mock !== undefined) {
      config.adapter = async () => ({
        data: mock,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        request: {},
      });
    }
  }
  return config;
});

// Response interceptor: unwraps data and catches any failed requests to provide seamless mock fallback
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const config = error.config || {};
    const url = config.url || '';
    const method = (config.method || 'get').toLowerCase();

    // If an API request failed (e.g. backend server is not running or returned 404/Network Error)
    const mockResponse = getMockFallback(url, method, config.data);
    if (mockResponse !== undefined) {
      console.info(`[SliceFlow Demo Mode] Serving demo fallback for ${method.toUpperCase()} ${url}`);
      return mockResponse;
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';
    return Promise.reject({ ...error, message, response: error.response });
  }
);

export default api;
