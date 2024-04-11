// api/usersApi.js
import { axiosClient } from "../../../api/axios";

export async function handleLogin( email, password, setEmail, setPassword) {
    axiosClient
                    .get("/sanctum/csrf-cookie")
                    .then((response) => {
                        axiosClient
                            .post(`api/login`, data)
                            .then((res) => {
                                if (res.data.status === 200) {
                                    console.log("res:", res.data);
                                    localStorage.setItem(
                                        "auth_token",
                                        res.data.token
                                    );
                                    localStorage.setItem(
                                        "auth_name",
                                        res.data.username
                                    );
                                    handleLoginSuccess(res.data.username);
                                    fetchAndUpdateRole(res.data.token);
                                    console.log(localStorage);
                                    setName(res.data.username);
                                    message.success(
                                        `Bienvenue: ${localStorage.getItem(
                                            "user_role"
                                        )} ${localStorage.getItem("auth_name")}`
                                    );
                                } else if (res.data.status === 401) {
                                    console.log(res.data)
                                    setAlertVisible(true); // Show error message
                                    setAlertMessage(<p key="error-message">L'adresse e-mail ou le mot de passe est incorrect. <br></br> Veuillez réessayer.</p>);

                                } else {
                                    // Handle other status codes or validation errors
                                    console.error(
                                        "Login failed:",
                                        res.data.message
                                    );
                                }
                            })
                            .catch((error) => {
                                console.error(
                                    "An error occurred during login:",
                                    error
                                );
                                // Log the error
                                // You can also handle the error or display an error message to the user if needed
                            });
                    })
                    .catch((error) => {
                        console.error(
                            "An error occurred while fetching CSRF token:",
                            error
                        );
                        // Log the error
                        // You can also handle the error or display an error message to the user if needed
                    });
    
}
export default handleLogin;
