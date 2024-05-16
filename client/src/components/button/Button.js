import React from 'react';
import styles from './button.module.css';

const Button = ({ label, type, handleClick }) => {
  return (
    <button className={styles.button} type={type} onClick={handleClick}>
      {label}
    </button>
  );
};
export default Button;
