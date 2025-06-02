import DataGrid from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchAllWords, addWordFromForeignUser } from '../../redux/word/operation';
import css from './RecommendTable.module.css';

const columns = [
    { key: 'word', name: 'Word', width: 372 },
    { key: 'translation', name: 'Translation', width: 364 },
    { key: 'category', name: 'Category', width: 260 },
    {
        key: 'actions',
        name: '',
        width: 208,
        renderCell: ({ row }) => {
            const dispatch = useDispatch();
            const token = useSelector((state) => state.auth.token);

            const handleAddWord = () => {
                dispatch(addWordFromForeignUser({ wordId: row.id, token }))
                    .unwrap()
                    .then(() => {
                        toast.success('Word added successfully!');
                    })
                    .catch((error) => {
                        toast.error(`Failed to add word: ${error}`);
                    });
            };

            return (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%',
                        justifyContent: 'center',
                        boxSizing: 'border-box',
                    }}
                >
                    <button onClick={handleAddWord} className={css.addButton}>
                        Add to dictionary{' '}
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M3.33325 9.99999H16.6666M16.6666 9.99999L13.3333 6.66666M16.6666 9.99999L13.3333 13.3333"
                                stroke="#85AA9F"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            );
        },
    },
];

const RecommendTable = () => {
    const dispatch = useDispatch();
    const allWords = useSelector((state) => state.words.allWords);
    const totalPages = useSelector((state) => state.words.totalPages);
    const currentPage = useSelector((state) => state.words.currentPage);
    const selectedCategory = useSelector((state) => state.words.selectedCategory);
    const loading = useSelector((state) => state.words.isLoading);
    const error = useSelector((state) => state.words.error);
    const token = useSelector((state) => state.auth.token);

    const [localPage, setLocalPage] = useState(1); // Завжди починаємо з 1

    // Синхронізуємо localPage із currentPage при першому завантаженні
    useEffect(() => {
        if (currentPage && currentPage !== localPage) {
            setLocalPage(currentPage);
        }
    }, [currentPage]);

    // Завантажуємо слова при зміні сторінки або категорії
    useEffect(() => {
        console.log('Fetching recommended words for page:', localPage);
        if (token) {
            dispatch(fetchAllWords({ token, page: localPage, limit: 7, category: selectedCategory }));
        }
    }, [dispatch, token, localPage, selectedCategory]);

    useEffect(() => {
        console.log('All Words:', allWords);
        console.log('Total Pages:', totalPages);
        console.log('Current Page:', currentPage);
        console.log('Local Page:', localPage);
        console.log('Loading:', loading);
        console.log('Error:', error);
        if (error) {
            toast.error(`Error: ${error}`);
            console.error('Error Details:', error);
        }
    }, [error, allWords, selectedCategory, totalPages, currentPage, loading, localPage]);

    const rows = allWords.map((word, index) => ({
        id: word._id || `${index + 1}`,
        word: word.en || 'N/A',
        translation: word.ua || 'N/A',
        category: word.category || 'N/A',
        actions: '',
        originalWord: word,
    }));

    const handlePageChange = (newPage) => {
        console.log('Attempting to switch to page:', newPage);
        if (newPage >= 1 && newPage <= totalPages) {
            setLocalPage(newPage);
            console.log('Page switched to:', newPage);
        } else {
            console.log('Invalid page number:', newPage);
        }
    };

    const renderPagination = () => {
        console.log('Rendering pagination, total pages:', totalPages);
        if (!totalPages || totalPages <= 1) {
            console.log('No pagination needed, total pages:', totalPages);
            return null; // Не відображаємо пагінацію, якщо сторінок немає або лише одна
        }

        const pageButtons = [];
        const maxVisiblePages = 5;
        let startPage = Math.max(1, localPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        pageButtons.push(
            <button
                key="first"
                onClick={() => handlePageChange(1)}
                disabled={localPage === 1}
                className={css.paginationButton}
            >
                First
            </button>
        );

        pageButtons.push(
            <button
                key="prev"
                onClick={() => handlePageChange(localPage - 1)}
                disabled={localPage === 1}
                className={css.paginationButton}
            >
                Prev
            </button>
        );

        for (let i = startPage; i <= endPage; i++) {
            pageButtons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`${css.paginationButton} ${localPage === i ? css.activePage : ''}`}
                >
                    {i}
                </button>
            );
        }

        pageButtons.push(
            <button
                key="next"
                onClick={() => handlePageChange(localPage + 1)}
                disabled={localPage === totalPages}
                className={css.paginationButton}
            >
                Next
            </button>
        );

        pageButtons.push(
            <button
                key="last"
                onClick={() => handlePageChange(totalPages)}
                disabled={localPage === totalPages}
                className={css.paginationButton}
            >
                Last
            </button>
        );

        return <div className={css.pagination}>{pageButtons}</div>;
    };

    return (
        <div className={css.wordTable}>
            <div className={css.tableContainer}>
                {loading && <p>Loading...</p>}
                {!loading && !error && (!allWords || allWords.length === 0) && (
                    <p className={css.noWords}>No recommended words available.</p>
                )}
                {!loading && !error && allWords.length > 0 && (
                    <>
                        <DataGrid
                            className={css.customDataGrid}
                            columns={columns}
                            rows={rows}
                            rowHeight={72}
                            style={{ minHeight: '577px', minWidth: '1200px', background: '#fff' }}
                        />
                        {renderPagination()}
                    </>
                )}
            </div>
        </div>
    );
};

export default RecommendTable;