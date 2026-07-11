import axios from 'axios';

let errorRateEnabled = true;

export function setErrorRate(enabled: boolean) {
  errorRateEnabled = enabled;
}

const apiClient = axios.create({
  baseURL: '/api',
});

apiClient.interceptors.request.use((config) => {
  config.headers.Authorization = 'Bearer mock-token';
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export { apiClient };
