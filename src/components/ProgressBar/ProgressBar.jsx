import PropTypes from 'prop-types';
import css from './ProgressBar.module.css';

const ProgressBar = ({
    progress,
    current,
    total,
    type = 'linear',
    width = '100px',
    height = '10px',
    fillColor = '#4caf50',
    backgroundColor = '#e0e0e0',
    size = 40,
}) => {
    const calculatedProgress = progress !== undefined ? progress : (current / total) * 100;
    const clampedProgress = Math.min(Math.max(calculatedProgress, 0), 100); 

    if (type === 'circular') {
        const circleSize = size;
        const strokeWidth = 4;
        const radius = (circleSize - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

        return (
            <div className={css.circularProgressBar} style={{ width: circleSize, height: circleSize }}>
                <svg width={circleSize} height={circleSize} viewBox={`0 0 ${circleSize} ${circleSize}`}>
                    <circle
                        cx={circleSize / 2}
                        cy={circleSize / 2}
                        r={radius}
                        stroke={backgroundColor}
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    <circle
                        cx={circleSize / 2}
                        cy={circleSize / 2}
                        r={radius}
                        stroke={fillColor}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        transform={`rotate(-90 ${circleSize / 2} ${circleSize / 2})`}
                    />
                    <text
                        x="50%"
                        y="50%"
                        dy=".3em"
                        textAnchor="middle"
                        fontSize="12px"
                        fill="#000"
                    >
                        {Math.round(clampedProgress)}%
                    </text>
                </svg>
            </div>
        );
    }

    const containerStyle = {
        width,
        height,
        backgroundColor,
        borderRadius: '4px',
        overflow: 'hidden',
    };

    const fillStyle = {
        width: `${clampedProgress}%`,
        height: '100%',
        backgroundColor: fillColor,
        transition: 'width 0.3s ease-in-out',
    };

    return (
        <div className={css.progressBar} style={containerStyle}>
            <div className={css.progressFill} style={fillStyle} />
        </div>
    );
};

ProgressBar.propTypes = {
    progress: PropTypes.number,
    current: PropTypes.number,
    total: PropTypes.number,
    type: PropTypes.oneOf(['linear', 'circular']),
    width: PropTypes.string,
    height: PropTypes.string,
    fillColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    size: PropTypes.number,
};

export default ProgressBar;