import React, { useState } from 'react';
import Footer from '../../footer/Footer';
import styles from '../loginForm/loginForm.module.css';
import InputField from '../InputField';
import Button from '../../button/Button';
import UserSelector, { UserType } from '../../user/UserSelector';

const RegistrationForm = () => {
  const [userType, setUserType] = useState(UserType.Patient);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [languages, setLanguages] = useState('');
  const [medicalStatus, setMedicalStatus] = useState('');
  const [medicalLicense, setMedicalLicense] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [error, setError] = useState(null);

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

  const handleSubmit = async event => {
    event.preventDefault();

    const requestBody = {
      userType,
      id,
      password,
      firstName,
      lastName,
      email,
      mobile,
      languages,
      medicalStatus,
      medicalLicense,
      specialization,
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
      console.log('Registration response:', data);
    } catch (error) {
      console.error('Error during registration:', error);
      const errorMessage = error.response.data.message;
      setError(errorMessage);
    }
  };

  const renderPatientFields = () => {
    return (
      <InputField
        label='Medical Status:'
        placeholder='Medical Status'
        value={medicalStatus}
        name='medicalStatus'
        onChange={handleChange}
        required
      />
    );
  };

  const renderDoctorFields = () => {
    return (
      <>
        <InputField
          label='Medical License:'
          placeholder='Medical License'
          value={medicalLicense}
          name='medicalLicense'
          onChange={handleChange}
          required
        />
        <InputField
          label='Specialization:'
          placeholder='Specialization'
          value={specialization}
          name='specialization'
          onChange={handleChange}
          required
        />
      </>
    );
  };

  return (
    <div>
      <form action='auth/register' method='POST' className={styles.form}>
        <h1 className={styles.registerHeading}>Register</h1>

        <UserSelector userType={userType} onChange={handleChange} />
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
            pattern='[\w-\.]+@([\w-]+\.)+[\w-]{2,4}'
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

        <Button text='Register' type='submit' fun={() => handleSubmit()} />
      </form>
      <Footer name='David Jedwabsky' />
    </div>
  );
};
export default RegistrationForm;
