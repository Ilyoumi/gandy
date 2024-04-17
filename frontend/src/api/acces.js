import axios from "axios";

const fetchUserData = async (userContext) => {
    try {
        // Obtain CSRF token first
        await obtainCSRFToken();

        const authToken = localStorage.getItem("auth_token");
        if (!authToken) {
            console.log("User is not logged in. No auth token found.");
            return;
        }

        const response = await axios.get("http://localhost:8000/api/user", {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        const { role, id, nom, prenom } = response.data;

        userContext.setUserRole(role);
        userContext.setUserId(id);
        userContext.setUserName(`${prenom} ${nom}`);
        
        console.log("User info fetched successfully:", { role, id, name: `${prenom} ${nom}` });
    } catch (error) {
        console.error("Error fetching user data:", error.message);
    }
};

const obtainCSRFToken = async () => {
    try {
        // Make a request to obtain CSRF token
        await axios.get("http://localhost:8000/sanctum/csrf-cookie");
        console.log("CSRF token obtained successfully.");
    } catch (error) {
        console.error("Error obtaining CSRF token:", error.message);
        throw new Error("Failed to obtain CSRF token.");
    }
};

export default fetchUserData;
