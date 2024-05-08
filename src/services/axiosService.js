import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8082/api', // Replace with your actual baseURL
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

export default axiosInstance;
