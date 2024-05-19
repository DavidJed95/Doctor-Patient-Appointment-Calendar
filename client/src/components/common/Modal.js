import React, { useEffect, useRef } from 'react';
import styles from './Modal.module.css';
import Button from '../button/Button';

const Modal = ({ open, onClose, children }) => {
  const modalRef = useRef();

  /**
   * Close th e modal if clicked outside the content area
   */
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

  return open ? (
    <section className={`${styles.modalBackdrop}`}>
      <section className={styles.modalContent} ref={modalRef}>
        <button className={styles.modalCloseButton} onClick={onClose()}>
          &#x2715;
        </button>
        {children}
        <Button
          className={styles.modalCloseButton}
          label={'Close'}
          handleClick={onClose()}
        />
      </section>
    </section>
  ) : null;
};
export default Modal;
