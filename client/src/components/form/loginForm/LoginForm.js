import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { updateLoginStatus, setUser } from '../../../redux/reducers/userSlice';

import styles from '../userAuthentication.module.css';
import InputField from '../InputField';
import Button from '../../button/Button';

const LoginForm = () => {
  const [userDetails, setUserDetails] = useState({ id: '', password: '' });
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = event => {
    const { name, value } = event.target;
    setUserDetails(prevDetails => ({ ...prevDetails, [name]: value }));
  };

  /**
   * Function that handles the submission of the login information
   * @param {*} event - event of submission
   */
  const handleSubmit = async event => {
    event.preventDefault();

    const requestBody = userDetails;

    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        credentials: 'include',
      });

      const data = await response.json();
      setMessage(data.message);
      console.log('data: ', data);

      if (response.ok) {
        // Update isLoggedIn state in the parent component(APP.js)
        dispatch(updateLoginStatus(true));
        dispatch(setUser(data.user));

        setTimeout(() => {
          navigate(data.redirectTo);
        }, 2000);
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error('Error during login:', error);
      setMessage(error.message || 'Login failed. Server or Database are disabled.');
    }
  };

  return (
    <form action='/auth/login' className={styles.form}>
      <div className={`${styles.div}`}>
        <div className={styles.overlap}>
          <div className={styles.ellipse} />
          <h1 className={styles.userAuthHeading}>Login</h1>
          <div>
            <InputField
              label='ID:'
              placeholder='Enter Your ID'
              value={userDetails.id}
              name='id'
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <InputField
              label='Password:'
              placeholder='Enter Your Password'
              value={userDetails.password}
              name='password'
              type='password'
              onChange={handleChange}
              required
            />
          </div>
          <Button
            className={styles.frame}
            label='Login'
            type='submit'
            handleClick={handleSubmit}
          />
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
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
