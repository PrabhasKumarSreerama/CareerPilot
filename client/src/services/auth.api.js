import axios from "axios";

const API_URL = "http://localhost:3000/api";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export async function signup(name, email, password) {
    try {
        const response = await api.post(`/auth/signup`, { name, email, password });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function signin(email, password) {
    try {
        const response = await api.post(`/auth/signin`, { email, password });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export async function signout() {
    try {
        const response = await api.get(`/auth/signout`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getCurrentUser() {
    try {
        const response = await api.get(`/auth/my-details`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

