import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../redux/auth/selectors";
import { logOut } from "../../redux/auth/operations";
import toast, { Toaster } from 'react-hot-toast';
import css from "./UserMenu.module.css"

export default function UserMenu() {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    const handleLogOut = () => {
        dispatch(logOut())
            .unwrap()
            .then(() => {
                toast.success("LogOut is success")
            })
            .catch(error => {
                toast.error(error);
            });

    }

    return (
        <div className={css.userMenu}>
            <p className={css.textUserMenu}>{user.name}</p>

            <button className={css.buttonUserMenu} color="error" onClick={handleLogOut}>Log out
                <svg width="16" height="16">
                    <use href="../../../public/symbol-defs.svg#icon-switch-horizontal-01"></use>
                </svg></button>
            <Toaster />
        </div>
    );
}