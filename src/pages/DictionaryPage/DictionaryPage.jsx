import Dashboard from "../../components/Dashboard/Dashboard";
import WordsTable from "../../components/WordsTable/WordsTable";
import css from "./DictionaryPage.module.css"


export default function DictionaryPage() {


    return (
        <div className={css.container}>

            <Dashboard />
            <WordsTable/>
        </div>


    )
}