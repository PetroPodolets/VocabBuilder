import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchUserTasks, submitAnswers } from '../../redux/word/operation';
import css from './TrainingPage.module.css';
import ProgressBar from '../../components/ProgressBar/ProgressBar';

class ErrorBoundary extends React.Component {
    state = { hasError: false };
    static getDerivedStateFromError(error) { return { hasError: true }; }
    render() { return this.state.hasError ? <h1>Something went wrong.</h1> : this.props.children; }
}

const TrainingPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const tasks = useSelector((state) => state.words.tasks);
    const token = useSelector((state) => state.auth.token);
    const loading = useSelector((state) => state.words.isLoading);
    const error = useSelector((state) => state.words.error);

    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [answers, setAnswers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [results, setResults] = useState(null);
    const [translationDirection, setTranslationDirection] = useState('en');
    const modalRef = useRef(null);

    useEffect(() => {
        console.log('Current token:', token);
        if (token && !tasks.length) {
            console.log('Fetching tasks with token:', token);
            dispatch(fetchUserTasks({ token }));
        }
    }, [dispatch, token, tasks.length]);

    useEffect(() => {
        console.log('Tasks updated:', tasks);
        console.log('Loading state:', loading);
        console.log('Error state:', error);
        if (error) {
            toast.error(`Error: ${error}`);
            console.error('Error Details:', error);
            if (error === 'Unauthorized' || error === 'Failed to fetch tasks') {
                navigate('/dictionary');
            }
        }
    }, [error, tasks, loading, navigate]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setIsModalOpen(false);
            }
        };

        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen]);

    const currentTask = tasks && tasks.length > 0 && currentTaskIndex < tasks.length ? tasks[currentTaskIndex] : null;
    console.log('Current task:', currentTask);

    const handleNext = () => {
        if (userAnswer.trim() && currentTask) {
            const targetField = translationDirection === 'en' ? 'en' : 'ua';
            const sourceField = translationDirection === 'en' ? 'ua' : 'en';
            const newAnswer = {
                _id: currentTask._id,
                [targetField]: userAnswer.trim(),
                [sourceField]: currentTask[sourceField] || '',
                task: translationDirection,
            };
            setAnswers([...answers, newAnswer]);
        }
        setUserAnswer('');
        setCurrentTaskIndex(currentTaskIndex + 1);
    };

    const handleSave = () => {
        let finalAnswers = [...answers];
        if (userAnswer.trim() && currentTask) {
            const targetField = translationDirection === 'en' ? 'en' : 'ua';
            const sourceField = translationDirection === 'en' ? 'ua' : 'en';
            finalAnswers = [...finalAnswers, {
                _id: currentTask._id,
                [targetField]: userAnswer.trim(),
                [sourceField]: currentTask[sourceField] || '',
                task: translationDirection,
            }];
        }
        if (finalAnswers.length === 0) {
            toast.error('No answers provided.');
            return;
        }
        dispatch(submitAnswers({ token, answers: finalAnswers }))
            .unwrap()
            .then((response) => {
                setResults({
                    total: response.length,
                    correct: response.filter((result) => result.isDone).length,
                    response,
                });
                setIsModalOpen(true);
                setUserAnswer('');
                setAnswers([]);
                setCurrentTaskIndex(0);
                toast.success('Answers successfully saved!');
            })
            .catch((error) => {
                console.error('Submit answers error:', error);
                toast.error('Failed to save answers.');
            });
    };

    const handleCancel = () => {
        setCurrentTaskIndex(0);
        setUserAnswer('');
        setAnswers([]);
        setIsModalOpen(false);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    return (
        <ErrorBoundary>
            <div className={css.Container}>
                <div className={css.trainingRoom}>
                    {loading && <p>Loading tasks...</p>}
                    {error && <p>Error: {error}</p>}
                    {!loading && !error && (!tasks || !tasks.length) && <p>No tasks available.</p>}
                    {!loading && !error && tasks.length > 0 && currentTask && (
                        <div className={css.container}>
                            <div className={css.progressBarContainer}>
                                <ProgressBar
                                    current={currentTaskIndex + 1}
                                    total={tasks.length}
                                    type="circular"
                                    height="20px"
                                    fillColor="#4caf50"
                                    backgroundColor="#e0e0e0"
                                />
                            </div>
                            <div className={css.containerTrainingText}>
                                <div className={css.leftSection}>
                                    <div className={css.containerInput}>
                                        <input
                                            type="text"
                                            value={userAnswer}
                                            onChange={(e) => setUserAnswer(e.target.value)}
                                            placeholder={` ${translationDirection === 'en' ? 'English' : 'Ukrainian'} translation`}
                                            className={css.input}
                                        />
                                        <p className={css.languageInput}>{translationDirection === 'en' ? 'English' : 'Ukrainian'}</p>
                                    </div>
                                    <div className={css.buttons}>
                                        {currentTaskIndex < tasks.length - 1 && (
                                            <button type="button" onClick={handleNext} className={css.nextButton}>
                                                Next{' '}
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M3.33334 9.99996H16.6667M16.6667 9.99996L13.3333 6.66663M16.6667 9.99996L13.3333 13.3333"
                                                        stroke="#85AA9F"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className={css.rightSection}>
                                    <p className={css.taskWord}>
                                        {translationDirection === 'en' ? currentTask.ua : currentTask.en || currentTask.ua}
                                    </p>
                                    <p className={css.language}>{translationDirection === 'ua' ? 'English' : 'Ukrainian'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {isModalOpen && results && (
                        <div className={css.modalOverlay}>
                            <div className={css.modal} ref={modalRef}>
                                <button onClick={handleModalClose} className={css.closeIcon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 6L18 18M18 6L6 18" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </button>
                                <h2 className={css.trainingModalTxt}>Well Done!</h2>
                                <div className={css.columnsContainer}>
                                    <div className={css.column}>
                                        <h4 className={css.answerColumn}>Correct Answers</h4>
                                        <ul className={css.listAnswer}>
                                            {results.response
                                                .filter((result) => result.isDone)
                                                .map((result) => (
                                                    <li key={result._id}>
                                                        {result.ua || result.en} → {result.en || result.ua}
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                    <div className={css.column}>
                                        <h4 className={css.answerColumn}>Mistakes:</h4>
                                        <ul className={css.listAnswer}>
                                            {results.response
                                                .filter((result) => !result.isDone)
                                                .map((result) => (
                                                    <li key={result._id}>
                                                        {result.ua || result.en} → {result.en || result.ua}
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className={css.containerButton}>
                        <button type="submit" onClick={handleSave} className={css.saveButton}>
                            Save
                        </button>
                        <button type="button" onClick={handleCancel} className={css.cancelButton}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default TrainingPage;    