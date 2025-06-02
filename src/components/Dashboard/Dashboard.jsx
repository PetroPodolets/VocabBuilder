import { NavLink, useLocation } from "react-router-dom";
import AddWord from "../AddWord/AddWord";
import Filters from "../Filters/Filters";
import Statistics from "../Statistic/Statistic";
import css from "./Dashboard.module.css";

export default function Dashboard() {
    const location = useLocation(); // Отримуємо поточний маршрут

    // Показуємо AddWord лише на сторінці /dashboard
    const showAddWord = location.pathname === "/dictionary";

    return (
        <div className={css.containerDashboard}>
            <Filters />
            <div className={css.container}>
                <Statistics />

                {/* Умовно рендеримо AddWord */}
                {showAddWord && <AddWord />}

                {/* NavLink показуємо на всіх сторінках */}
                <NavLink to="/training" className={css.linkTraining}>
                    Train oneself{" "}
                    <svg
                        width="16"
                        height="10"
                        viewBox="0 0 16 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M1.33337 5.00002H14.6667M14.6667 5.00002L11.3334 1.66669M14.6667 5.00002L11.3334 8.33335"
                            stroke="#85AA9F"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </NavLink>
            </div>
        </div>
    );
}