import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../form/userAuthentication.module.css';
import InputField from '../../form/InputField';
import Button from '../../button/Button';

const UpdatePersonalProfile = ({ user, getUserInfo }) => {
  const [Password, setPassword] = useState('');
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [Email, setEmail] = useState('');
  const [Mobile, setMobile] = useState('');
  const [Languages, setLanguages] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  /**
   * This method handles the change of the input values
   * @param {*} event - event target to change
   */
  const handleChange = event => {
    const { name, value } = event.target;
    switch (name) {
      case 'Password':
        setPassword(value);
        break;
      case 'FirstName':
        setFirstName(value);
        break;
      case 'LastName':
        setLastName(value);
        break;
      case 'Email':
        setEmail(value);
        break;
      case 'Mobile':
        setMobile(value);
        break;
      case 'Languages':
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

    if (!(Password || FirstName || LastName || Email || Mobile || Languages)) {
      setMessage('You can update any of the fields');
      return;
    }
    const ID = user.ID;
    const requestBody = {
      ID,
      Password,
      FirstName,
      LastName,
      Email,
      Mobile,
      Languages,
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
            value={Password}
            name='Password'
            type='password'
            onChange={handleChange}
          />
        </div>
        <div>
          <InputField
            label='First Name:'
            placeholder={user.FirstName || 'FirstName'}
            value={FirstName}
            name='FirstName'
            onChange={handleChange}
          />
        </div>
        <div>
          <InputField
            label='Last Name:'
            placeholder={user.LastName || 'LastName'}
            value={LastName}
            name='LastName'
            onChange={handleChange}
          />
        </div>

        <div>
          <InputField
            label='Email:'
            placeholder={user.Email || 'name@gmail.com'}
            value={Email}
            name='Email'
            onChange={handleChange}
          />
        </div>
        <div>
          <InputField
            label='Mobile:'
            placeholder={user.Mobile || 'Mobile'}
            value={Mobile}
            name='Mobile'
            onChange={handleChange}
          />
        </div>
        <div>
          <InputField
            label='Languages:'
            placeholder={user.Languages || 'Languages'}
            value={Languages}
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
