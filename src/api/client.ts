import axios from 'axios';
import { BASE_API_URL } from '../../api.config';

export const apiClient = axios.create({
    baseURL: BASE_API_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor для добавления токена
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor для обработки ошибок
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Можно добавить логику для refresh token или редирект на login
            console.error('Unauthorized - token expired or invalid');
        }
        return Promise.reject(error);
    }
);
