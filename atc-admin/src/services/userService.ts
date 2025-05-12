// src/services/userService.ts
import axios from 'axios';

export const getUsers = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
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
