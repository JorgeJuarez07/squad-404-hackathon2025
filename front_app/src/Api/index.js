// src/api/index.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api',
});

apiClient.interceptors.request.use(config => {
    const tokens = JSON.parse(localStorage.getItem('tokens'));
    if (tokens?.access_token) {
        config.headers.Authorization = `Bearer ${tokens.access_token}`;
    }
    return config;
});

export const getConversations = async () => {
    const response = await apiClient.get('/conversations');
    return response.data;
};