import './App.css'
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsRefreshing } from "./redux/auth/selectors";
import Layout from "./components/Layout/Layout";
import RestrictedRoute from "./components/RestrictedRoute";
import { Toaster } from "react-hot-toast";
import LoginPage from './pages/LoginPage/LoginPage';

const RegisterPage = lazy(() => import("./pages/RegisterPage/RegisterPage"));

function App() {
    const isRefreshing = useSelector(selectIsRefreshing);

    return isRefreshing ? (
        <div>REFRESHING USER...</div>
    ) : (
        <Layout >
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route 
                            path="/register"
                            
                            element={<RestrictedRoute component={<RegisterPage  />} redirectTo="/" />}
                        />
                        <Route
                            path="/login"

                            element={<RestrictedRoute component={<LoginPage />} redirectTo="/" />}
                        />
                </Routes>
            </Suspense>
            <Toaster />
        </Layout>
    );
}

export default App;
