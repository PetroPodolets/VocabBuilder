import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.baseURL = "https://vocab-builder-backend.p.goit.global/";

const setAuthHeader = token => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

const clearAuthHeader = () => {
    axios.defaults.headers.common["Authorization"] = "";
};

export const register = createAsyncThunk(
    "auth/register",
    async (newUser, thunkAPI) => {
        try {
            const res = await axios.post("/api/users/signup", newUser);
            console.log("Register response:", res.data); // Додаємо
            if (!res.data.token) throw new Error("No token received");
            setAuthHeader(res.data.token);
            localStorage.setItem("token", res.data.token);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const logIn = createAsyncThunk(
    "auth/signin",
    async (userInfo, thunkAPI) => {
        try {
            const response = await axios.post("/api/users/signin", userInfo);
            console.log("Login response:", response.data); // Додаємо
            if (!response.data.token) throw new Error("No token received");
            setAuthHeader(response.data.token);
            localStorage.setItem("token", response.data.token);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed");
        }
    }
);

export const refreshUser = createAsyncThunk(
    "auth/refreshUser",
    async (_, thunkAPI) => {
        const token = localStorage.getItem("token");
        if (!token) {
            return thunkAPI.rejectWithValue("No token found");
        }
        setAuthHeader(token);
        try {
            const response = await axios.get("/api/users/current");
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const logOut = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
        try {
            await axios.post("/api/users/signout");
            clearAuthHeader();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);