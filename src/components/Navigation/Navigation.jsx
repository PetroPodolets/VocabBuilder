import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux"
import { selectIsLoggedIn } from "../../redux/auth/selectors";
import css from "./Navigation.module.css"

export default function Navigation() {
    const isLoggedIn = useSelector(selectIsLoggedIn);

    const getButtonStyle = (isActive) => ({
        color: isActive ? 'white' : 'black',
        fontWeight: isActive ? '500' : '85AA9F',
        backgroundColor: isActive ? '#85AA9F' : 'transparent'
        ,
    });


    return (
        <nav className={css.nav}>
            {isLoggedIn && (<>
                <NavLink to="/dictionary" className={({ isActive }) => (isActive ? css.active : "")}>
                    {({ isActive }) => (
                        <button style={getButtonStyle(isActive)}>Dictionary</button>
                    )}
                </NavLink>

                <NavLink to="/recommend" className={({ isActive }) => (isActive ? css.active : "")}>
                    {({ isActive }) => (
                        <button style={getButtonStyle(isActive)}>Recommend</button>
                    )}
                </NavLink>

                <NavLink to="/training" className={({ isActive }) => (isActive ? css.active : "")}>
                    {({ isActive }) => (
                        <button style={getButtonStyle(isActive)}>Training</button>
                    )}
                </NavLink>
            </>
            )}
        </nav>
    )
}