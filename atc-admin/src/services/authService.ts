import axios from 'axios';

export const loginService = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { username, password });
    return response.data; // { message, token }
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};
