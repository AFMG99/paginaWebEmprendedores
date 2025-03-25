import axios from "axios";

const API_URL = "http://localhost:8085/";

export const registerUser = async (name, email, password, role = "Usuario") => {
    const response = await axios.post(`${API_URL}register`, {
        name,
        email,
        password,
        role,
    });
    return response.data;
};