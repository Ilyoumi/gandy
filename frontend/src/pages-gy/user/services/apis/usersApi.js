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
export default fetchUsers;