import { useDispatch } from "react-redux";
import { openAddWordModal } from "../../redux/word/slise";
import AddWordModal from "../AddModal/AddModal";
import css from "./AddWord.module.css"
const WordManager = () => {
    const dispatch = useDispatch();

    return (
        <div>
            <button className={css.addButton} onClick={() => dispatch(openAddWordModal())}>Add Word <span>+</span></button>
            <AddWordModal />
        </div>
    );
};

export default WordManager;