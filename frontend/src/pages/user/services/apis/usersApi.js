// api/usersApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';

export async function fetchUsers() {
  try {
    const response = await axios.get(`${BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
}

export const deleteUser = async (userId) => {
  try {
      const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
          method: "DELETE",
      });
      return response;
  } catch (error) {
      throw new Error("Failed to delete user: " + error.message);
  }
};
export default fetchUsers;
