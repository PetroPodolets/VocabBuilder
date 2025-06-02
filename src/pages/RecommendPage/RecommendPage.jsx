import Dashboard from "../../components/Dashboard/Dashboard";
import RecommendTable from "../../components/RecommendTable/RecommendTable";

import css from "./RecommendPage.module.css"





export default function RecommendPage() {
    return (
        <div className={css.containerRecommend}>
            < Dashboard />
            <RecommendTable/>
        </div>
    )
}