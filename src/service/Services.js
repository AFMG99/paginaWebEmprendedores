import axios from "axios";

const API_URL = "http://localhost:8085/";

export const showAllUser = async () => {
    const response = await axios.get(`${API_URL}users`);
    return response.data;
};

export const userLogin = async (name, password) => {
    const response = await axios.post(`${API_URL}login`, { name, password });
    return response.data;
};

export const registerUser = async (name, email, password, role = "Usuario") => {
    const response = await axios.post(`${API_URL}register`, {
        name,
        email,
        password,
        role,
    });
    return response.data;
};

export const editUser = async (id, updatedData) => {
    const response = await axios.put(`${API_URL}user/${id}`, updatedData);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await axios.delete(`${API_URL}user/${id}`);
    return response.data;
};
