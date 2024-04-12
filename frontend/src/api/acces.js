import { axiosClient } from "./axios";

// Function to fetch user data
const fetchUserData = async (userContext) => {
    try {
        // Check if the user is logged in
        const authToken = localStorage.getItem("auth_token");
        if (!authToken) {
            // User is not logged in, do nothing
            console.log("User is not logged in");
            return;
        }

        // User is logged in, fetch user data
        const response = await axiosClient.get("/api/user", {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        const { role, id } = response.data;

        // Update userRole state using setUserRole function
        userContext.setUserRole(response.data.role);
        userContext.setUserId(response.data.id);
        console.log("User info", role, id);
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
};

export default fetchUserData;
