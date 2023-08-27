import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import InputField from '../form/InputField';
import Button from '../button/Button';
import styles from '../form/userAuthentication.module.css';

const PasswordReset = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = event => {
    const { value } = event.target;
    setNewPassword(value);
  };

  const handlePasswordReset = async event => {
    event.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8000/auth/reset-password/${token}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newPassword }),
        },
      );

      const data = await response.json();
      setStatusMessage(data.message);
      if (response.ok) {
        setTimeout(() => {
          navigate(data.redirectTo);
        }, 3000);
      }
    } catch (error) {
      console.error('error resetting password: ', error);
      setStatusMessage(error.message);
    }
  };
  return (
    <div className={styles.form}>
      <h1>PasswordReset</h1>
      <InputField
        placeholder='Enter new password'
        value={newPassword}
        name='password'
        type='password'
        onChange={handleChange}
        required
      />
      <Button text='Reset Password' type='submit' fun={handlePasswordReset} />
      <p
        className={
          statusMessage.includes('success') ? styles.success : styles.failure
        }
      >
        {statusMessage}
      </p>
    </div>
  );
};
export default PasswordReset;
