import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:3000', 
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
