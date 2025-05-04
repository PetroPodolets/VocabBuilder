import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStatistics } from '../../redux/word/operation';
import css from "./Statistic.module.css"

const Statistics = () => {
    const dispatch = useDispatch();
    const { statistics, isLoading, error } = useSelector((state) => state.words);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        dispatch(fetchStatistics(token));
    }, [dispatch, token]);
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className={css.container}>
            {statistics && <p className={css.statistic}> To study : <span>{statistics.totalCount}</span></p>}
        </div>
    );
};

export default Statistics;