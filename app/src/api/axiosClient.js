import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8000/api/qlcv',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosClient;
