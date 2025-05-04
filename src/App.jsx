import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { selectIsRefreshing } from "./redux/auth/selectors";
import { refreshUser } from "./redux/auth/operations";
import Layout from "./components/Layout/Layout";
import RestrictedRoute from "./components/RestrictedRoute";
import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "react-hot-toast";
import './App.css';

const LoginPage = lazy(() => import("./pages/LoginPage/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage/RegisterPage"));
const DictionaryPage = lazy(() => import("./pages/DictionaryPage/DictionaryPage"));

function App() {
    const dispatch = useDispatch();
    const isRefreshing = useSelector(selectIsRefreshing);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            dispatch(refreshUser());
        }
    }, [dispatch]);

    if (isRefreshing) {
        return <div style={{ textAlign: "center", padding: "20px" }}>Завантаження...</div>;
    }

    return (
        <Layout>
            <Toaster position="top-right" reverseOrder={false} />
            <Suspense fallback={<div>Завантаження...</div>}>
                <Routes>
                    <Route
                        path="/"
                        element={<RestrictedRoute redirectTo="/dictionary"><LoginPage /></RestrictedRoute>}
                    />
                    <Route
                        path="/register"
                        element={<RestrictedRoute redirectTo="/dictionary"><RegisterPage /></RestrictedRoute>}
                    />
                    <Route
                        path="/login"
                        element={<RestrictedRoute redirectTo="/dictionary"><LoginPage /></RestrictedRoute>}
                    />
                    <Route
                        path="/dictionary"
                        element={<PrivateRoute redirectTo="/login"><DictionaryPage /></PrivateRoute>}
                    />
                    
                    <Route
                        path="*"
                        element={<RestrictedRoute redirectTo="/dictionary"><LoginPage /></RestrictedRoute>}
                    />
                </Routes>
            </Suspense>
            
        </Layout>
    );
}

export default App;