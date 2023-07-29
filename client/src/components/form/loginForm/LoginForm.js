import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Footer from '../../footer/Footer';
import styles from '../userAuthentication.module.css';
import InputField from '../InputField';
import Button from '../../button/Button';

const LoginForm = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = event => {
    const { name, value } = event.target;
    if (name === 'id') {
      setId(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const requestBody = {
      id,
      password,
    };

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful login
        setMessage(data.message);
        navigate('/home');
      } else {
        // Handle login failure
        setMessage(data.message);
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error('Error during login:', error);
      setMessage('The ID or password are incorrect. Please try again.');
    }
  };

  return (
    <div>
      <form action='/login' className={styles.form}>
        <h1 className={styles.userAuthHeading}>Login</h1>
        <div>
          <InputField
            label='ID:'
            placeholder='ID:'
            value={id}
            name='id'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <InputField
            label='Password:'
            placeholder='Password:'
            value={password}
            name='password'
            type='password'
            onChange={handleChange}
            required
          />
        </div>
        <Button text='Login' type='submit' fun={handleSubmit} />
        <div>
          <Link to='/register'>Sign Up</Link>
        </div>
        <div>
          <Link to='/password-reset'>Forgot your Password?</Link>
        </div>
        {message && (
          <p
            className={
              message.includes('success') ? styles.success : styles.failure
            }
          >
            {message}
          </p>
        )}
      </form>

      <Footer name='David Jedwabsky' />
    </div>
  );
};

export default LoginForm;
