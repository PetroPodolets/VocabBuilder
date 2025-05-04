import AddWord from "../AddWord/AddWord";
import Filters from "../Filters/Filters";
import Statistics from "../Statistic/Statistic";
import css from "./Dashboard.module.css"


export default function Dashboard() {

    return (
        <div className={css.containerDashboard}>
            <Filters />
            <div className={css.container}>
                <Statistics />
                <AddWord />
            </div>
        </div>
    );
}
