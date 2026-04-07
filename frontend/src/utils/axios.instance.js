import axis from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const axiosInstance = axis.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: (Optional) If you manually attach tokens from local storage instead of cookies
// axiosInstance.interceptors.request.use(
//     (config) => {
//         // Example: const token = localStorage.getItem('accessToken');
//         // if (token) config.headers.Authorization = `Bearer ${token}`;
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// // Response Interceptor: To cleanly handle errors or trigger refresh tokens
// axiosInstance.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     async (error) => {
//         // Example: Handle 401 Unauthorized for Refresh Token logic here later
//         // if (error.response && error.response.status === 401) { ... }
//         return Promise.reject(error);
//     }
// );
export { axiosInstance };