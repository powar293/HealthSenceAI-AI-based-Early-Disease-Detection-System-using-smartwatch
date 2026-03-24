import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = async (email, password) => {
  const formData = new URLSearchParams();
  formData.append('username', email); // OAuth2 expects username
  formData.append('password', password);
  
  const response = await api.post('/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};

export const signup = async (userData) => {
  const response = await api.post('/signup', userData);
  return response.data;
};

export const fetchHealthData = async () => {
  const response = await api.get('/health-data');
  return response.data;
};

export const fetchAlerts = async () => {
  const response = await api.get('/alerts');
  return response.data;
};

export const postHealthData = async (data) => {
  const response = await api.post('/health-data', data);
  return response.data;
};

export const getEmergencyContacts = async () => {
  const response = await api.get('/emergency-contacts');
  return response.data;
};

export const addEmergencyContact = async (contactData) => {
  const response = await api.post('/emergency-contacts', contactData);
  return response.data;
};

export const deleteEmergencyContact = async (contactId) => {
  const response = await api.delete(`/emergency-contacts/${contactId}`);
  return response.data;
};

export const performAlertAction = async (alertId, action, latitude = null, longitude = null) => {
  const payload = { action };
  if (latitude !== null && longitude !== null) {
    payload.latitude = latitude;
    payload.longitude = longitude;
  }
  const response = await api.post(`/alerts/${alertId}/action`, payload);
  return response.data;
};

export default api;
