// api/usersApi.js
import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

export async function handleLogin( email, password, setEmail, setPassword) {
    try {
        const response = await axios.post(`${BASE_URL}/login`, {email, password});
        setEmail("")
        setPassword("")
        console.log("Login successful", email)

    } catch (error) {
        console.error("Failed to login:", error);
        throw error;
    }
}
export default handleLogin;
