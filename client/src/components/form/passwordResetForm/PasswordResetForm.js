import React, {useState} from 'react';
import InputField from '../InputField';
import Button from '../../button/Button';


const PasswordResetForm = () => {
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
        setSuccessMessage(data);
        setErrorMessage('');
      } else {
        // Password reset failed
        setErrorMessage(data);
        setSuccessMessage('');
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error('Error during password reset:', error);
      setErrorMessage('An error occurred. Please try again later.');
      setSuccessMessage('You have succeeded resetting your password.\nCheck your email for confirmation');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <InputField
          label='ID:'
          placeholder='ID'
          value={id}
          name='id'
          onChange={handleChange}
          required
        />
        <InputField
          label='Email:'
          placeholder='Email'
          value={email}
          name='email'
          onChange={handleChange}
          required
        />
        <Button type='submit' text='Reset Password' />
      </form>
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default PasswordResetForm;