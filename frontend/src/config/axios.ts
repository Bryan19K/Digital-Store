import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:5000/api',
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth-storage')
            ? JSON.parse(localStorage.getItem('auth-storage')!).state?.token
            : null;

        // Note: The previous auth store might strictly store the whole state. 
        // We need to ensure we grab the token correctly. 
        // Actually, let's just use useAuthStore.getState().token if possible or just read from localstorage standard.
        // For now, let's rely on the store setting the header or just grabbing it here if we assume the standard persist structure.

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
