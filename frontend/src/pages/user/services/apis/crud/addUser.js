import axios from 'axios';
import {message } from "antd";
const BASE_URL = 'http://localhost:8000/api';


export async function addUser(formData) {
    try {
        // Make API request to Laravel backend
        const response = await axios.post(`${BASE_URL}/users`, formData);
        console.log(response.data); // Log response from server
        // Handle success, show message or redirect user
        message.success("User created successfully");
    } catch (error) {
        console.error('Error creating user:', error);
        // Handle error, show error message
        message.error("Failed to create user");
    }
};

export default addUser;
