import { createSlice } from "@reduxjs/toolkit";
import { logIn, logOut, register, refreshUser } from "./operations";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: JSON.parse(localStorage.getItem("user")) || { name: null, email: null, _id: null }, 
        token: localStorage.getItem("token") || null,
        isLoggedIn: Boolean(localStorage.getItem("token")),
        isRefreshing: false,
        isLoading: false,
    },
    extraReducers: builder =>
        builder
            .addCase(register.pending, state => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                console.log("Register payload:", action.payload);
                state.user = {
                    name: action.payload.name,
                    email: action.payload.email,
                    _id: action.payload._id, 
                };
                state.token = action.payload.token;
                state.isLoading = false;
                state.isLoggedIn = true;
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("user", JSON.stringify(state.user));
            })
            .addCase(register.rejected, state => {
                state.isLoading = false;
            })
            .addCase(logIn.pending, state => {
                state.isLoading = true;
            })
            .addCase(logIn.fulfilled, (state, action) => {
                state.user = {
                    name: action.payload.name,
                    email: action.payload.email,
                    _id: action.payload._id, 
                };
                state.token = action.payload.token;
                state.isLoggedIn = true;
                state.isLoading = false;
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("user", JSON.stringify(state.user));
            })
            .addCase(logIn.rejected, state => {
                state.isLoading = false;
            })
            .addCase(logOut.fulfilled, state => {
                state.user = { name: null, email: null, _id: null }; 
                state.token = null;
                state.isLoggedIn = false;
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            })
            .addCase(refreshUser.pending, state => {
                state.isRefreshing = true;
            })
            .addCase(refreshUser.fulfilled, (state, action) => {
                state.user = {
                    name: action.payload.name,
                    email: action.payload.email,
                    _id: action.payload._id, 
                };
                state.isLoggedIn = true;
                state.isRefreshing = false;
                localStorage.setItem("user", JSON.stringify(state.user));
            })
            .addCase(refreshUser.rejected, state => {
                state.isRefreshing = false;
                state.isLoggedIn = false;
                localStorage.removeItem("user");
            }),
});

export default authSlice.reducer;