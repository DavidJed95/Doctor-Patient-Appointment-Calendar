import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../footer/Footer';
import styles from '../userAuthentication.module.css';
import InputField from '../InputField';
import Button from '../../button/Button';
import UserSelector, { UserType } from '../../user/UserSelector';

/**
 * Registration form page component
 * @returns The registration
 */
const RegistrationForm = () => {
  const [userType, setUserType] = useState(UserType.Patient);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [languages, setLanguages] = useState('');
  const [medicalStatus, setMedicalStatus] = useState('');
  const [medicalLicense, setMedicalLicense] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  /**
   * This method handles the change of the input values
   * @param {*} event - event target to change
   */
  const handleChange = event => {
    const { name, value } = event.target;
    switch (name) {
      case 'userType':
        setUserType(value);
        break;
      case 'id':
        setId(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'passwordConfirm':
        setPasswordConfirm(value);
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
      case 'medicalStatus':
        setMedicalStatus(value);
        break;
      case 'medicalLicense':
        setMedicalLicense(value);
        break;
      case 'specialization':
        setSpecialization(value);
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

    if (
      !id ||
      !password ||
      !passwordConfirm ||
      !firstName ||
      !lastName ||
      !email ||
      !mobile ||
      !languages
    ) {
      setMessage('Please enter all required fields.');
      return;
    }

    const creationDate = new Date();
    const formattedCreationDate = creationDate
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    const requestBody = {
      userType,
      id,
      password,
      passwordConfirm,
      firstName,
      lastName,
      email,
      mobile,
      languages,
      creationDate: formattedCreationDate,
      medicalStatus: userType === UserType.Patient ? medicalStatus : undefined,
      medicalLicense:
        userType === UserType.MedicalSpecialist ? medicalLicense : undefined,
      specialization:
        userType === UserType.MedicalSpecialist ? specialization : undefined,
    };

    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        setTimeout(() => {
          navigate(data.redirectTo);
        }, 5000);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('An error occurred during registration.');
    }
  };

  const renderPatientFields = () => {
    return (
      <div>
        <InputField
          label='Medical Status:'
          placeholder='Medical Status'
          value={medicalStatus}
          name='medicalStatus'
          onChange={handleChange}
          required
        />
      </div>
    );
  };

  const renderDoctorFields = () => {
    return (
      <>
        <div>
          <InputField
            label='Medical License:'
            placeholder='Medical License'
            value={medicalLicense}
            name='medicalLicense'
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <InputField
            label='Specialization:'
            placeholder='Specialization'
            value={specialization}
            name='specialization'
            onChange={handleChange}
            required
          />
        </div>
      </>
    );
  };

  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return (
    <div>
      <form action='/auth/register' method='POST' className={styles.form}>
        <h1 className={styles.userAuthHeading}>Register</h1>

        <UserSelector onChange={handleChange} />
        <div>
          <InputField
            label='ID:'
            placeholder='ID'
            pattern='[0-9]{9}'
            value={id}
            name='id'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          {/* Minimum eight and maximum 12 characters, at least one uppercase letter, one lowercase letter, one number and one special character */}
          <InputField
            label='Password:'
            placeholder='Password'
            pattern='(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}'
            value={password}
            name='password'
            type='password'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          {/* Minimum eight and maximum 12 characters, at least one uppercase letter, one lowercase letter, one number and one special character */}
          <InputField
            label='Password Confirmation:'
            placeholder='Confirm your password:'
            pattern='(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}'
            value={passwordConfirm}
            name='passwordConfirm'
            type='password'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <InputField
            label='First Name:'
            placeholder='First Name'
            value={firstName}
            name='firstName'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <InputField
            label='Last Name:'
            placeholder='Last Name'
            value={lastName}
            name='lastName'
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <InputField
            label='Email:'
            placeholder='name@gmail.com'
            pattern={emailPattern}
            value={email}
            name='email'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <InputField
            label='Mobile:'
            placeholder='Mobile'
            value={mobile}
            name='mobile'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <InputField
            label='Languages:'
            placeholder='Languages'
            value={languages}
            name='languages'
            onChange={handleChange}
            required
          />
        </div>

        {userType === UserType.Patient && renderPatientFields()}

        {userType === UserType.MedicalSpecialist && renderDoctorFields()}

        <Button text='Register' type='submit' fun={handleSubmit} />
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
export default RegistrationForm;
