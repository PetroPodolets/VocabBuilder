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
import LoginPage from './pages/LoginPage/LoginPage';
import DictionaryPage from './pages/DictionaryPage/DictionaryPage';
import './App.css';
const RegisterPage = lazy(() => import("./pages/RegisterPage/RegisterPage"));

function App() {
    const dispatch = useDispatch();
    const isRefreshing = useSelector(selectIsRefreshing);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            dispatch(refreshUser()); // Викликаємо refreshUser при наявності токена
        }
    }, [dispatch]);

    if (isRefreshing) {
        return <div>Оновлення користувача...</div>;
    }

    return (
        <Layout>
            <Suspense fallback={<div>Завантаження...</div>}>
                <Routes>
                    <Route
                        path="/"
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
                </Routes>
            </Suspense>
            <Toaster />
        </Layout>
    );
}

export default App;