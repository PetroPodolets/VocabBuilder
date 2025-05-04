import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../redux/auth/selectors";
import { logOut } from "../../redux/auth/operations";
import toast from 'react-hot-toast';
import css from "./UserMenu.module.css";

export default function UserMenu() {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);


    const handleLogOut = () => {
        dispatch(logOut())
            .unwrap()
            .then(() => {
                toast.success("Logout successful");
            })
            .catch(error => {
                toast.error("Login error: " + error);
            });
    };

    if (!user) {
        return (
            <div className={css.userMenu}>
                <p className={css.textUserMenu}>User not authorized</p>
                
            </div>
        );
    }

    return (
        <div className={css.userMenu}>
            <p className={css.textUserMenu}>
                {user.name}
            </p>
            <div className={css.icon}>
                <svg width="24" height="24">
                    <use href="/symbol.svg#icon-Vector-2" />
                </svg>
            </div>
            <button className={css.buttonUserMenu} onClick={handleLogOut}>
                Logout
                <svg width="16" height="16">
                    <use href="/symbol.svg#icon-arrow-right" />
                </svg>
            </button>
        </div>
    );
}