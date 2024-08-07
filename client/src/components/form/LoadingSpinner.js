import React, { useState, useEffect } from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ onCompletion }) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercentage(prev => {
        if (prev < 100) {
          return prev + 1;
        } else {
          clearInterval(interval);
          if (onCompletion) onCompletion();
          return 100;
        }
      });
    }, 30); // 3000ms / 100 = 30ms per increment

    return () => clearInterval(interval);
  }, [onCompletion]);

  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
      <p>{percentage}%</p>
    </div>
  );
};

export default LoadingSpinner;