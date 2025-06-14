import DataGrid from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import ProgressBar from '../ProgressBar/ProgressBar';
import ActionsMenu from '../ActionsMenu/ActionsMenu';
import { fetchWords } from '../../redux/word/operation';
import css from './WordsTable.module.css';

const columns = [
    { key: 'word', name: 'Word', width: 280 },
    { key: 'translation', name: 'Translation', width: 274 },
    { key: 'category', name: 'Category', width: 260 },
    {
        key: 'status',
        name: 'Status',
        width: 254,
        renderCell: ({ row }) => (
            <div style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                <ProgressBar
                    type="circular"
                    progress={row.progress || 0}
                    size={40}
                    fillColor="#4caf50"
                    backgroundColor="#e0e0e0"
                />
            </div>
        ),
    },
    {
        key: 'actions',
        name: '',
        width: 132,
        renderCell: ({ row }) => (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'center',
                    boxSizing: 'border-box',
                }}
            >
                <ActionsMenu row={row} />
            </div>
        ),
    },
];

const WordsTable = () => {
    const dispatch = useDispatch();
    const words = useSelector((state) => state.words.words);
    const totalPages = useSelector((state) => state.words.totalPages);
    const currentPage = useSelector((state) => state.words.currentPage);
    const selectedCategory = useSelector((state) => state.words.selectedCategory);
    const loading = useSelector((state) => state.words.isLoading);
    const error = useSelector((state) => state.words.error);
    const token = useSelector((state) => state.auth.token);

    const [localPage, setLocalPage] = useState(currentPage || 1);

    useEffect(() => {
        console.log('Fetching words for page:', localPage);
        dispatch(fetchWords({ token, page: localPage, limit: 7, category: selectedCategory }));
    }, [dispatch, token, localPage, selectedCategory]);

    useEffect(() => {
     
        if (error) {
            toast.error(`Error: ${error}`);
            console.error('Error Details:', error);
        }
    }, [error, words, selectedCategory, totalPages, currentPage, loading]);

    const rows = words.map((word, index) => ({
        id: word._id || `${index + 1}`,
        word: word.en || 'N/A',
        translation: word.ua || 'N/A',
        category: word.category || 'N/A',
        progress: word.progress || 0,
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

    useEffect(() => {
        console.log('Local Page updated to:', localPage);
    }, [localPage]);

    const renderPagination = () => {
        console.log('Rendering pagination, total pages:', totalPages);
        if (totalPages <= 1) {
            console.log('No pagination needed, total pages:', totalPages);
            return null; // Повертаємо null, щоб пагінація не відображалася
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
                {!loading && !error && (!words || words.length === 0) && <p className={css.noWords}>No words available.</p>}
                {!loading && !error && words.length > 0 && (
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

export default WordsTable;