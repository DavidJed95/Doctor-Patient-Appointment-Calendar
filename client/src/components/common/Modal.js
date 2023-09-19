import React, { useEffect } from 'react';
import styles from './Modal.module.css';

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
      window.addEventListener('click', handleOutsideClick);
      window.addEventListener('keydown', handleEscPress);
    }

    return () => {
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('keydown', handleEscPress);
    };
  }, [show, onClose, styles.modalContent]);

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.modalCloseButton} onClick={onClose}>
          &times;
        </button>
        {children}

        {showSubmit && (
          <>
            <button onClick={onClose}>Cancel</button>
            <button onClick={onSubmit}>Save</button>
          </>
        )}
      </div>
    </div>
  );
}
