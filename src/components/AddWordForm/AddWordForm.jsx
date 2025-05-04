import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addWord, fetchWords } from '../../redux/word/operation';
import { closeAddWordModal } from '../../redux/word/slise';
import Flag from 'react-flagkit';
import toast from 'react-hot-toast';
import css from './AddWordForm.module.css';

const AddWordForm = () => {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.words.categories);
    const token = useSelector((state) => state.auth.token);
    const selectedCategory = useSelector((state) => state.words.selectedCategory);
    const searchTerm = useSelector((state) => state.words.searchTerm);
    const [formData, setFormData] = useState({
        category: '',
        isIrregular: false,
        en: '',
        ua: '',
    });

    const enPattern = /\b[A-Za-z'-]+(?:\s+[A-Za-z'-]+)*\b/;
    const uaPattern = /^(?![A-Za-z])[А-ЯІЄЇҐґа-яієїʼ\s]+$/u;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const validateForm = () => {
        const errors = [];
        if (!formData.category) errors.push('Category is required');
        if (!enPattern.test(formData.en.trim())) errors.push('English word is invalid');
        if (!uaPattern.test(formData.ua.trim())) errors.push('Ukrainian word is invalid');
        if (formData.category === 'verb' && formData.isIrregular === undefined) {
            errors.push('Verb type is required');
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            toast.error(`Error: ${validationErrors.join(', ')}`);
            return;
        }

        if (!token) {
            toast.error('Error: No authentication token found. Please log in.');
            return;
        }

        const wordData = {
            en: formData.en.trim(),
            ua: formData.ua.trim(),
            category: formData.category,
            token,
            ...(formData.category === 'verb' && { isIrregular: formData.isIrregular }),
        };

        try {
            await dispatch(addWord(wordData)).unwrap();
            await dispatch(
                fetchWords({
                    token,
                    keyword: searchTerm || undefined,
                    category: selectedCategory || undefined,
                    isIrregular: selectedCategory === 'verb' ? formData.isIrregular : undefined,
                })
            ).unwrap();
            toast.success('Word added successfully');
            setFormData({
                category: '',
                isIrregular: false,
                en: '',
                ua: '',
            });
            dispatch(closeAddWordModal());
        } catch (error) {
            toast.error(`Error: ${error || 'Failed to add word. Check server availability.'}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={css.container}>
            <div className={css.containerText}>
                <h2>Add Word</h2>
                <p>
                    Adding a new word to the dictionary is an <br /> important step in enriching the language base and <br /> expanding the vocabulary.
                </p>
            </div>
            <div className={css.selectContainer}>
                <select className={css.select} name="category" value={formData.category} onChange={handleChange}>
                    <option value="">Category</option>
                    {categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                            {cat.label}
                        </option>
                    ))}
                </select>
            </div>
            {formData.category === 'verb' && (
                <div className={css.radioGroup}>
                    <div className={css.containerLabel}>
                        <label className={css.radioLabel}>
                            <input
                                type="radio"
                                name="isIrregular"
                                value="false"
                                checked={formData.isIrregular === false}
                                onChange={() => setFormData((prev) => ({ ...prev, isIrregular: false }))}
                                className={css.hiddenRadio}
                            />
                            <span className={`${css.customRadio} ${formData.isIrregular === false ? css.checked : ''}`}></span>
                            Regular
                        </label>
                        <label className={css.radioLabel}>
                            <input
                                type="radio"
                                name="isIrregular"
                                value="true"
                                checked={formData.isIrregular === true}
                                onChange={() => setFormData((prev) => ({ ...prev, isIrregular: true }))}
                                className={css.hiddenRadio}
                            />
                            <span className={`${css.customRadio} ${formData.isIrregular === true ? css.checked : ''}`}></span>
                            Irregular
                        </label>
                    </div>
                    {formData.isIrregular === true && (
                        <p className={css.irregularNote}>
                            Such data must be entered in the format I form-II form-III form.
                        </p>
                    )}
                </div>
            )}
            <div className={css.inputWithFlag}>
                <input
                    className={css.Input}
                    type="text"
                    name="ua"
                    value={formData.ua}
                    onChange={handleChange}
                    placeholder="Ukrainian word"
                />
                <div className={css.flagContainer}>
                    <Flag country="UA" className={css.flag} />
                    Ukrainian
                </div>
            </div>
            <div className={css.inputWithFlag}>
                <input
                    className={css.Input}
                    type="text"
                    name="en"
                    value={formData.en}
                    onChange={handleChange}
                    placeholder="English word"
                />
                <div className={css.flagContainer}>
                    <Flag country="GB" className={css.flag} />
                    English
                </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button className={css.addButton} type="submit">
                    Add
                </button>
                <button
                    className={css.cancelButton}
                    type="button"
                    onClick={() => dispatch(closeAddWordModal())}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default AddWordForm;