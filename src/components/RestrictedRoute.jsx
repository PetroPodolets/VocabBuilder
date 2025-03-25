import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../redux/auth/selectors";
import { Navigate } from "react-router-dom";

function RestrictedRoute({ children, redirectTo }) {
    const isLoggedIn = useSelector(selectIsLoggedIn);
    // Якщо користувач авторизований, перенаправляємо на redirectTo ("/dictionary")
    return isLoggedIn ? <Navigate to={redirectTo} replace /> : children;
}

export default RestrictedRoute;