import axios from 'axios';
import i18n from '../i18n';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to include the token and language in headers
api.interceptors.request.use(
    (config) => {
        // Token
        const token = localStorage.getItem('auth-storage')
            ? JSON.parse(localStorage.getItem('auth-storage')!).state?.token
            : null;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Language
        config.headers['Accept-Language'] = i18n.language || 'es';

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
