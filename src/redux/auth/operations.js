import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
axios.defaults.baseURL = "https://vocab-builder-backend.p.goit.global/"

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
            setAuthHeader(res.data.token);
            return res.data;
        } catch (error) {
            // Перевірка на наявність помилки email
            if (error.response && error.response.data.message === "Such email already exists") {
                return thunkAPI.rejectWithValue("This email is already in use.");
            }
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const logIn = createAsyncThunk(
    "auth/signin",
    async (userInfo, thunkAPI) => {
        try {
            const response = await axios.post("/api/users/signin", userInfo); // Важливо вказати правильний шлях
            setAuthHeader(response.data.token);
            return response.data;
        } catch (error) {
            // Перевірка на помилку 401 або інші коди помилок
            if (error.response?.status === 401) {
                return thunkAPI.rejectWithValue("Invalid email or password");
            }
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed");
        }
    }
);



export const logOut = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
        try {
            await axios.post("/users/logout");
            clearAuthHeader();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
);

