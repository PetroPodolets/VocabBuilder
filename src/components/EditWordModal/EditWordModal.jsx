import { useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import { closeEditWordModal } from '../../redux/word/slise';
import css from './EditWordModal.module.css';
import Flag from 'react-flagkit';

const EditWordModal = ({ word, onSave }) => {
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.words.editModal.isOpen);
    const [formData, setFormData] = useState({
        en: word?.en || '',
        ua: word?.ua || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedWord = {
            ...formData,
            _id: word?._id,
            category: word?.category || '',
            isIrregular: word?.isIrregular || false,
        };
        console.log('Submitting word:', updatedWord);
        onSave(updatedWord);
        dispatch(closeEditWordModal());
    };

    const handleOverlayClick = (e) => {
        console.log('Overlay clicked:', { target: e.target, currentTarget: e.currentTarget });
        if (e.target === e.currentTarget) {
            dispatch(closeEditWordModal());
        }
    };

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) {
        console.error('Modal root element not found');
        return null;
    }

    if (!isOpen || !word) {
        return null;
    }

    return ReactDOM.createPortal(
        <div className={css.modalOverlay} onClick={handleOverlayClick}>
            <div className={css.modal} onClick={(e) => e.stopPropagation()}>
                <button
                    className={css.closeButtonStyle}
                    onClick={() => dispatch(closeEditWordModal())}
                >
                    ✕
                </button>
                <form onSubmit={handleSubmit}>
                    <div className={css.formGroup}>
                       
                        <input
                            type="text"
                            name="ua"
                            value={formData.ua}
                            onChange={handleChange}
                            required
                        />
                        <label className={css.flagContainer}>
                            <Flag country="UA" className={css.flag} />
                            Ukrainian
                        </label>
                    </div>
                    <div className={css.formGroup}>
                       
                        <input
                            type="text"
                            name="en"
                            value={formData.en}
                            onChange={handleChange}
                            required
                        />
                        <label className={css.flagContainer}>
                            <Flag country="GB" className={css.flag} />
                            English
                        </label>
                    </div>
                    <div className={css.buttonGroup}>
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => dispatch(closeEditWordModal())}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        modalRoot
    );
};

export default EditWordModal;