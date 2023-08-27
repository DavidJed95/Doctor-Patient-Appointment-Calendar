import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../userAuthentication.module.css';
import InputField from '../InputField';
import Button from '../../button/Button';
// isLoggedIn,
// updateLoginStatus,
// userInfo,
// getUserInformation,
// userGreeting,
// getUserGreeting,
const LoginForm = ({
  updateLoginStatus,
  getUserInformation,
  getUserGreeting,
}) => {
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

  /**
   * Function that handles the submission of the login information
   * @param {*} event - event of submission
   */
  const handleSubmit = async event => {
    event.preventDefault();

    const requestBody = {
      id,
      password,
    };

    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      setMessage(data.message);
      console.log('data: ', data);

      if (response.ok) {
        // Update isLoggedIn state in the parent component(APP.js)
        updateLoginStatus(true);
        getUserInformation(data.user);
        getUserGreeting(data.greeting);

        setTimeout(() => {
          navigate(data.redirectTo);
        }, 2000);
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error('Error during login:', error);
      setMessage(error || 'Login failed. Please try again.');
    }
  };

  return (
    <div>
      <form action='/auth/login' className={styles.form}>
        <h1 className={styles.userAuthHeading}>Login</h1>
        <div>
          <InputField
            label='ID:'
            placeholder='Enter Your ID'
            value={id}
            name='id'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <InputField
            label='Password:'
            placeholder='Enter Your Password'
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
    </div>
  );
};

export default LoginForm;
