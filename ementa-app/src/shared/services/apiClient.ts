import axios from 'axios';

// Configuração centralizada da conexão com o Django
export const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});