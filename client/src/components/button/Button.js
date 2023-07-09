import React from 'react';
import styles from './button.module.css';

const Button = ({ text, type, fun }) => {
  return (
    <button type={type} className={styles.button} onClick={fun}>
      {text}
    </button>
  );
};
export default Button;
