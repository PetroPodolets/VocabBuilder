import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, fetchWords } from '../../redux/word/operation';
import { setSelectedCategory, setSearchTerm } from '../../redux/word/slise';
import css from './Filters.module.css';
import { GoSearch } from 'react-icons/go';
import { ProgressBar } from 'react-loader-spinner';

function SearchFilter() {
    const [verbType, setVerbType] = useState('');
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    const dispatch = useDispatch();
    const categories = useSelector((state) => state.words.categories);
    const selectedCategory = useSelector((state) => state.words.selectedCategory);
    const searchTerm = useSelector((state) => state.words.searchTerm);
    const token = useSelector((state) => state.auth.token);
    const loading = useSelector((state) => state.words.isLoading);
    const error = useSelector((state) => state.words.error);

    useEffect(() => {
        if (token) {
            dispatch(fetchCategories(token));
            dispatch(
                fetchWords({
                    token,
                    keyword: searchTerm.trim() || undefined,
                    category: selectedCategory || undefined,
                    isIrregular: selectedCategory === 'verb' ? verbType === 'irregular' : undefined,
                })
            );
        }
    }, [dispatch, token]);

    const handleSearchChange = (event) => {
        const value = event.target.value;
        dispatch(setSearchTerm(value));

        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const newTimeout = setTimeout(() => {
            const sanitizedSearch = value.trim();
            if (token) {
                dispatch(
                    fetchWords({
                        token,
                        keyword: sanitizedSearch || undefined,
                        category: selectedCategory || undefined,
                        isIrregular: selectedCategory === 'verb' ? verbType === 'irregular' : undefined,
                    })
                );
            }
        }, 300);

        setDebounceTimeout(newTimeout);
    };

    const handleCategoryChange = (event) => {
        const newCategory = event.target.value;
        dispatch(setSelectedCategory(newCategory));
        setVerbType('');

        if (token) {
            dispatch(
                fetchWords({
                    token,
                    keyword: searchTerm.trim() || undefined,
                    category: newCategory || undefined,
                    isIrregular: undefined,
                })
            );
        }
    };

    const handleVerbTypeChange = (event) => {
        const newVerbType = event.target.value;
        setVerbType(newVerbType);

        if (token) {
            dispatch(
                fetchWords({
                    token,
                    keyword: searchTerm.trim() || undefined,
                    category: selectedCategory,
                    isIrregular: newVerbType === 'irregular',
                })
            );
        }
    };

    return (
        <div className={css.filterContainer}>
            <div className={css.searchInputContainer}>
                <input
                    className={css.searchInput}
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Знайти слово"
                    disabled={loading}
                />
                <div className={css.searchIcon}>
                    <GoSearch />
                </div>
            </div>
            <div className={css.containerCategory}>
                <select
                    className={css.categorySelect}
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    disabled={loading || !categories.length}
                >
                    <option value="">Category</option>
                    {categories?.map((category) => (
                        <option key={category.value} value={category.value}>
                            {category.label}
                        </option>
                    ))}
                </select>
            </div>
            {selectedCategory === 'verb' && (
                <div className={css.verbTypeRadio}>
                    <label>
                        <input
                            type="radio"
                            value="regular"
                            checked={verbType === 'regular'}
                            onChange={handleVerbTypeChange}
                            disabled={loading}
                        />
                        Regular
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="irregular"
                            checked={verbType === 'irregular'}
                            onChange={handleVerbTypeChange}
                            disabled={loading}
                        />
                        Irregular
                    </label>
                </div>
            )}
            {loading && (
                <div className={css.loader}>
                    <ProgressBar
                        visible={true}
                        height="50"
                        width="70"
                        color="#4fa94d"
                        ariaLabel="progress-bar-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                    />
                </div>
            )}
            {error && <p className={css.loader}>{error}</p>}
        </div>
    );
}

export default SearchFilter;