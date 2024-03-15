import React from 'react';
import styles from './button.module.css';

const Button = ({ label, type, handleClick }) => {
  return (
    <button type={type} className={styles.button} onClick={handleClick}>
      {label}
    </button>
  );
};
export default Button;
