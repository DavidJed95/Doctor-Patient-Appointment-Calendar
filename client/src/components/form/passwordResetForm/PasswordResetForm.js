import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../userAuthentication.module.css';
import InputField from '../InputField';
import Button from '../../button/Button';
import Footer from '../../footer/Footer';
const PasswordResetForm = () => {
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = event => {
    const { name, value } = event.target;
    if (name === 'id') {
      setId(value);
    } else if (name === 'email') {
      setEmail(value);
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      // Send a password reset request to the server
      const response = await fetch('/password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, email }),
      });

      // Handle the response from the server
      const data = await response.json();

      if (response.ok) {
        // Password reset was successful
        setMessage(data.message);
        navigate('/');
      } else {
        // Password reset failed
        setMessage(data.message);
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error('Error during password reset:', error);
      setMessage(
        'The given ID or Email do not exist in the system. Please try again!',
      );
    }
  };

  return (
    <div>
      <form action='/password-reset' method='POST' className={styles.form}>
        <h1 className={styles.userAuthHeading}>Password Reset</h1>
        <InputField
          label='ID:'
          pattern='[0-9]{9}'
          placeholder='ID'
          value={id}
          name='id'
          onChange={handleChange}
          required
        />
        <InputField
          label='Email:'
          placeholder='name@gmail.com'
          value={email}
          name='email'
          onChange={handleChange}
          required
        />
        <Button type='submit' text='Reset Password' fun={handleSubmit} />
      </form>
      {message && <p>{message}</p>}
      <Footer name='David Jedwabsky' />
    </div>
  );
};

export default PasswordResetForm;
