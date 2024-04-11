import { axiosClient } from "./axios";
import { useAuth } from "../AuthContext";

// Function to fetch user data
const fetchUserData = async () => {
    try {
        // Check if the user is logged in
        const authToken = localStorage.getItem("auth_token");
        if (!authToken) {
            // User is not logged in, do nothing
            console.log("User is not logged in")
            return;
        }

        // User is logged in, fetch user data
        const response = await axiosClient.get("/api/user", {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        // const { role } = response.data;
        // setUserRole(role);
        // console.log("User Role", role)

    } catch (error) {
        console.error("Error fetching user data:", error);
    }
};

// Export the fetchUserData function
export default fetchUserData;
