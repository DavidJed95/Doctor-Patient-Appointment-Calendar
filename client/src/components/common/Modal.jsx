import React, { useEffect, useRef } from 'react';
import styles from './Modal.module.css';

const Modal = ({ open, onClose, children }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = event => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscPress = event => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscPress);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscPress);
    };
  }, [onClose]);

  if (!open) return null;

  return (
    <section className={styles.modalBackdrop}>
      <section className={styles.modalContent} ref={modalRef}>
        <button className={styles.modalCloseButton} onClick={onClose}>
          &times;
        </button>
        {children}
      </section>
    </section>
  );
};

export default Modal;
