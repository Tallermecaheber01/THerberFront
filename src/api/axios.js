import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3000', // Cambia esto a la URL de tu backend
    headers : {
        "Content-Type":"application/json"
    }
});

export default api;
