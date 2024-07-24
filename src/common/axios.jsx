import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Axios instance with baseUrl
const makeRequest = axios.create({
    baseURL:`${backendUrl}/api/`,
    withCredentials: true,
});

export default makeRequest;