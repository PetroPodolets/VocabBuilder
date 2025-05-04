import DataGrid from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import ProgressBar from '../ProgressBar/ProgressBar';
import ActionsMenu from '../ActionsMenu/ActionsMenu';
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
    const words = useSelector((state) => state.words.words);
    const selectedCategory = useSelector((state) => state.words.selectedCategory);
    const loading = useSelector((state) => state.words.isLoading);
    const error = useSelector((state) => state.words.error);

    useEffect(() => {
        if (error) {
            toast.error(`Error: ${error}`);
        }
    }, [error]);




    const filteredWords = useMemo(() => {
        if (!selectedCategory || selectedCategory === '') return words;
        return words.filter((word) => word.category === selectedCategory);
    }, [words, selectedCategory]);

    const rows = useMemo(() => {
        return filteredWords.slice(0, 8).map((word, index) => ({
            id: index + 1,
            word: word.en || 'N/A',
            translation: word.ua || 'N/A',
            category: word.category || 'N/A',
            progress: word.progress || 0,
            actions: '',
            originalWord: word,
        }));
    }, [filteredWords]);

    const gridColumns = useMemo(() => columns, []);

    return (
        <div className={css.wordTable}>
            <div className={css.tableContainer}>
                {loading && <p>Loading...</p>}
                {!loading && !error && words.length === 0 && (
                    <p className={css.noWords}>No words available.</p>
                )}
                {!loading && !error && words.length > 0 && filteredWords.length === 0 && selectedCategory && (
                    <p className={css.noWords}>No words found for the selected category.</p>
                )}
                {!loading && filteredWords.length > 0 && (
                    <DataGrid
                        className={css.customDataGrid}
                        columns={gridColumns}
                        rows={rows}
                        rowHeight={72}
                        style={{ minHeight: '577px', minWidth: '1200px', background: '#fff' }}
                    />
                )}
            </div>
        </div>
    );
};

export default WordsTable;