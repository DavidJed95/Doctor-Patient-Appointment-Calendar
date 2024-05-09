import React, { useEffect } from 'react';
import styles from './Modal.module.css';
import Button from '../button/Button';

const Modal = ({ show, onClose, onSubmit, children, showSubmit = true }) => {
  useEffect(() => {
    const handleOutsideClick = e => {
      if (!e.target.closest(`.${styles.modalContent}`)) {
        onClose();
      }
    };

    const handleEscPress = e => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('click', handleOutsideClick);
      document.addEventListener('keydown', handleEscPress);
    } else {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleEscPress);
    }

    return () => {
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('keydown', handleEscPress);
    };
  }, [show, onClose]);

  return (
    <section className={`${styles.modalBackdrop} ${show ? '' : styles.hidden}`}>
      <section className={styles.modalContent}>
        <button className={styles.modalCloseButton} onClick={onClose}>
          &times;
        </button>
        {children}

        {showSubmit && (
          <>
            <Button label='Save' type='submit' handleClick={onSubmit} />
            <Button
              className={styles.modalCloseButton}
              type='submit'
              label='Cancel'
              handleClick={onClose}
            />
          </>
        )}
      </section>
    </section>
  );
};
export default Modal;
