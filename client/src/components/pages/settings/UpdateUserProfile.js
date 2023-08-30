import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../form/userAuthentication.module.css';
import InputField from '../../form/InputField';
import Button from '../../button/Button';

const UpdatePersonalProfile = ({ user, getUserInformation }) => {
  const [updatedUser, setUpdatedUser] = useState({ ...user });
  const [changedFields, setChangedFields] = useState({})
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  /**
   * This method handles the change of the input values
   * @param {*} event - event target to change
   */
  const handleChange = event => {
    const { name, value } = event.target;
    setChangedFields(prevUser => ({ ...prevUser, [name]: value }));
  };

  /**
   * This method handles the Submission of the form
   * @param {*} event event target to change for submission
   */
  const handleSubmit = async event => {
    event.preventDefault();

    try {
      const updatedUserData = { ...changedFields, ID: user.ID };
      const response = await fetch(
        'http://localhost:8000/auth/profile-update',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUserData),
        },
      );

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        setUpdatedUser(data.user);
        getUserInformation(data.user);
        setTimeout(() => {
          navigate(data.redirectTo);
        }, 2000);
      } else {
        setMessage(data.message);
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
            name='Password'
            type='password'
            onChange={handleChange}
          />
        </div>
        <div>
          <InputField
            label='First Name:'
            placeholder={updatedUser.FirstName || user.FirstName}
            name='FirstName'
            onChange={handleChange}
          />
        </div>
        <div>
          <InputField
            label='Last Name:'
            placeholder={updatedUser.LastName || user.LastName}
            name='LastName'
            onChange={handleChange}
          />
        </div>

        <div>
          <InputField
            label='Email:'
            placeholder={updatedUser.Email || user.Email}
            name='Email'
            onChange={handleChange}
          />
        </div>
        <div>
          <InputField
            label='Mobile:'
            placeholder={updatedUser.Mobile || user.Mobile}
            name='Mobile'
            onChange={handleChange}
          />
        </div>
        <div>
          <InputField
            label='Languages:'
            placeholder={updatedUser.Languages || user.Languages}
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
