import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../redux/auth/selectors";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children, redirectTo }) {
    const isLoggedIn = useSelector(selectIsLoggedIn);
    // Якщо користувач НЕ авторизований, перенаправляємо на redirectTo ("/login")
    return isLoggedIn ? children : <Navigate to={redirectTo} replace />;
}

export default PrivateRoute;