import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeAddWordModal } from "../../redux/word/slise";
import AddWordForm from "../AddWordForm/AddWordForm";
import css from "./AddModal.module.css";

const AddWordModal = () => {
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.words.isAddWordModalOpen);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && isOpen) {
                dispatch(closeAddWordModal());
            }
        };
        window.addEventListener("keydown", handleEscape);
        return () => window.removeEventListener("keydown", handleEscape);
    }, [dispatch, isOpen]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            dispatch(closeAddWordModal());
        }
    };

    return (
        <div className={css.modalOverlayStyle} onClick={handleBackdropClick}>
            <div className={css.modalContentStyle}>
                <button
                    className={css.closeButtonStyle}
                    onClick={() => dispatch(closeAddWordModal())}
                >
                    ✕
                </button>
                <AddWordForm />
            </div>
        </div>
    );
};

export default AddWordModal;