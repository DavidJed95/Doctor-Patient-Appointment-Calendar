import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../form/userAuthentication.module.css';
import InputField from '../../form/InputField';
import Button from '../../button/Button';
const UpdatePersonalProfile = ({ userInfo, getUserInfo }) => {
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [languages, setLanguages] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  /**
   * This method handles the change of the input values
   * @param {*} event - event target to change
   */
  const handleChange = event => {
    const { name, value } = event.target;
    switch (name) {
      case 'password':
        setPassword(value);
        break;
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'mobile':
        setMobile(value);
        break;
      case 'languages':
        setLanguages(value);
        break;
      default:
        break;
    }
  };

  /**
   * This method handles the Submission of the form
   * @param {*} event event target to change for submission
   */
  const handleSubmit = async event => {
    event.preventDefault();

    if (!(password || firstName || lastName || email || mobile || languages)) {
      setMessage('You can update any of the fields');
      return;
    }
    const requestBody = {
      Id: userInfo.ID,
      Password: password,
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      Mobile: mobile,
      Languages: languages,
    };
    try {
      const response = await fetch(
        'http://localhost:8000/auth/profile-update',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        },
      );

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        setTimeout(() => {
          navigate(data.redirectTo);
        }, 2000);
      }
    } catch (error) {
      console.error(
        'An error occurred during registration due to false data insertion:',
        error,
      );
      setMessage(
        error.message ||
          'An error occurred during registration due to false data insertion.',
      );
    }
  };

  return (
    <div>
      <form action='/auth/profile-update' method='POST' className={styles.form}>
        <h1 className={styles.userAuthHeading}>Profile Update</h1>

        <div>
          {/* Minimum eight and maximum 12 characters, at least one uppercase letter, one lowercase letter, one number and one special character */}
          <InputField
            label='Password:'
            placeholder='Password'
            pattern='(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}'
            value={password}
            name='Password'
            type='password'
            onChange={handleChange}
          />
        </div>
        <div>
          <InputField
            label='First Name:'
            placeholder={userInfo.FirstName || 'FirstName'}
            value={firstName}
            name='FirstName'
            onChange={handleChange}
          />
        </div>
        <div>
          <InputField
            label='Last Name:'
            placeholder={userInfo.LastName || 'LastName'}
            value={lastName}
            name='LastName'
            onChange={handleChange}
          />
        </div>

        <div>
          <InputField
            label='Email:'
            placeholder={userInfo.Email || 'name@gmail.com'}
            value={email}
            name='Email'
            onChange={handleChange}
          />
        </div>
        <div>
          <InputField
            label='Mobile:'
            placeholder={userInfo.Mobile || 'Mobile'}
            value={mobile}
            name='Mobile'
            onChange={handleChange}
          />
        </div>
        <div>
          <InputField
            label='Languages:'
            placeholder={userInfo.Languages || 'Languages'}
            value={languages}
            name='Languages'
            onChange={handleChange}
          />
        </div>

        <Button text='Update & Save' type='submit' fun={handleSubmit} />
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
export default UpdatePersonalProfile;
