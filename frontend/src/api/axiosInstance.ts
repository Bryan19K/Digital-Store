import axios from 'axios';

const api = axios.create({
  // Asegúrate de que este puerto coincida con el de tu backend (usualmente 5000)
  baseURL: 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;