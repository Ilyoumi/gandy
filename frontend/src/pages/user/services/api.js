import axios from 'axios';
import { message } from "antd";

const BASE_URL = 'http://localhost:8000/api';

export async function addUser(formData) {
    try {
        const response = await axios.post(`${BASE_URL}/users`, formData);
        console.log(response.data);
        message.success("User created successfully");
    } catch (error) {
        console.error('Error creating user:', error);
        message.error("Failed to create user");
    }
}

export async function fetchUsers() {
    try {
        const response = await axios.get(`${BASE_URL}/users`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch users:', error);
        throw error;
    }
}

export async function deleteUser(userId) {
    try {
        const response = await axios.delete(`${BASE_URL}/users/${userId}`);
        return response;
    } catch (error) {
        throw new Error("Failed to delete user: " + error.message);
    }
}
