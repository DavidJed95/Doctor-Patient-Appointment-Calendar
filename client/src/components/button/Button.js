import React from 'react';
import styles from './button.module.css';

const Button = ({ text, type, handleClick }) => {
  return (
    <button type={type} className={styles.button} onClick={handleClick}>
      {text}
    </button>
  );
};
export default Button;
