import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/auth/selectors";
import css from "./Navigation.module.css";

export default function Navigation() {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <nav className={css.nav}>
      {isLoggedIn && (
        <>
          <NavLink
            to="/dictionary"
            className={({ isActive }) => (isActive ? css.active : css.inactive)}
          >
            <button className={css.button}>Dictionary</button>
          </NavLink>

          <NavLink
            to="/recommend"
            className={({ isActive }) => (isActive ? css.active : css.inactive)}
          >
            <button className={css.button}>Recommend</button>
          </NavLink>

          <NavLink
            to="/training"
            className={({ isActive }) => (isActive ? css.active : css.inactive)}
          >
            <button className={css.button}>Training</button>
          </NavLink>
        </>
      )}
    </nav>
  );
}
