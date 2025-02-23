// src/services/userService.ts
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';  // URL бекенду

export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
        headers: {
            'Authorization': 'Bearer <your-token>'
        }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};
