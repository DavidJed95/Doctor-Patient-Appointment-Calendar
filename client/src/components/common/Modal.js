import React, { useEffect } from 'react';
import styles from './Modal.module.css';
import Button from '../button/Button';

export default function Modal({
  show,
  onClose,
  onSubmit,
  children,
  showSubmit = true,
}) {
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
      setTimeout(() => {
        window.addEventListener('click', handleOutsideClick);
        window.addEventListener('keydown', handleEscPress);
      }, 10);
    }

    return () => {
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('keydown', handleEscPress);
    };
  }, [show, onClose]);

  return (
    <section className={styles.modalBackdrop}>
      <section
        className={styles.modalContent}
        onClick={e => e.stopPropagation()}
      >
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
}
