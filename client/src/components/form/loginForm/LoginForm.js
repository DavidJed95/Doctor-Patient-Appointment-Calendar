// React Imports
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Footer from '../../footer/Footer';
import styles from './loginForm.module.css';
import InputField from '../InputField';
import Button from '../../button/Button';

const LoginForm = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

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
      error: null,
    };

    try {
      // Send the form data to the server using the fetch API
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      // Handle the response from the server
      const data = await response.json();
      console.log('Registration response:', data);
      // Handle successful login
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error('Error during login:', error);
      // Handle error message
    }
  };

  return (
    <div>
      <form action='auth/login' method='POST' className={styles.form}>
        <h1 className={styles.loginHeading}>Login</h1>
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
        <Button text='Login' type='submit' fun={() => handleSubmit()} />
        <div>
          <Link to='/register'>Sign Up</Link>
        </div>
        <div>
          <Link to='/password-reset'>Forgot your Password?</Link>
        </div>
      </form>

      <Footer name='David Jedwabsky' />
    </div>
  );
};

export default LoginForm;
