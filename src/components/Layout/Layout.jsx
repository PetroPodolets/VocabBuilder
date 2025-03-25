import { memo } from "react";
import AppBar from "../AppBar/AppBar";
import css from "./Layout.module.css";

const Layout = memo(({ children }) => {
    return (
        <div className={css.div}>
            <AppBar />
            {children}
        </div>
    );
});

Layout.displayName = 'Layout';
export default Layout;