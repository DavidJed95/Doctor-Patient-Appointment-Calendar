import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
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

  return ReactDOM.createPortal(
    open ? (
      <section
        className={`${styles.modalBackdrop} ${open ? '' : styles.hidden}`}
      >
        <section className={styles.modalContent} ref={modalRef}>
          <Button
            className={styles.modalCloseButton}
            label={'&times;'}
            handleClick={onClose}
          />
          <Button
            className={styles.modalCloseButton}
            label={'Close'}
            handleClick={onClose}
          />
          {children}
        </section>
      </section>
    ) : null,
    document.getElementById('modal-root'),
  );
};
export default Modal;
