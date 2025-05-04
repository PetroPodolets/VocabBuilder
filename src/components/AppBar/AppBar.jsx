import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/auth/selectors";
import css from "./AppBar.module.css";
import Navigation from "../Navigation/Navigation";
import UserMenu from "../UserMenu/UserMenu";
export default function AppBar() {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <header className={css.header}>
      <a href="/" className={css.logo}>
        <svg width="24" height="24">
          <use href="/symbol.svg#icon-logo"></use>
        </svg>
        <p>VocabBuilder</p>
      </a>

      {isLoggedIn && (
        <>
          <Navigation />
          <UserMenu />
        </>
      )}
    </header>
  );
}
