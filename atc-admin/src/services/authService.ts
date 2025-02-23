import axios from 'axios';

const API_URL = 'http://localhost:3000/api'; // Замініть на свій бекенд

export const loginService = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    return response.data; // { message, token }
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};
