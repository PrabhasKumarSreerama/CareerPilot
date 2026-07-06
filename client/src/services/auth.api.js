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

export async function signin(email, password, rememberMe) {
    try {
        const response = await api.post(`/auth/signin`, { email, password, rememberMe });
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

export async function forgotPassword(email) {
    try {
        const response = await api.post(`/auth/forgot-password`, { email });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function verifyOtp(email, otp) {
    try {
        const response = await api.post(`/auth/verify-otp`, { email, otp });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function resetPassword(email, otp, newPassword) {
    try {
        const response = await api.post(`/auth/reset-password`, { email, otp, newPassword });
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

