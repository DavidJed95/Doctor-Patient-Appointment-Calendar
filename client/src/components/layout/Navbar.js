import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/reducers/userSlice';

import CustomLink from './CustomLink';
import Button from '../button/Button';
import styles from './navbar.module.css';

const Navbar = ({ siteTitle }) => {
  const userType = useSelector(state => state.user.userInfo.UserType);
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setMessage(data.message);
      if (response.ok) {
        setTimeout(() => {
          dispatch(logoutUser());
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };
  return (
    <nav className={styles.nav}>
      <Link to='home' className={styles.siteTitle}>
        {siteTitle}
      </Link>
      <ul>
        <CustomLink to='/home'>Home</CustomLink>
        {userType === 'Medical Specialist' && (
          <CustomLink to='manage-shifts'>Manage Shifts</CustomLink>
        )}
        {userType === 'Patient' && (
          <CustomLink to='/appointments'>Appointments</CustomLink>
        )}
        <CustomLink to='/profile-update'>Profile Update</CustomLink>
        <Button
          className={styles.navLogoutButton}
          label='Logout'
          handleClick={handleLogout}
        />
      </ul>
      {message && (
        <p
          className={
            message.includes('success') ? styles.success : styles.failure
          }
        >
          {message}
        </p>
      )}
    </nav>
  );
};

export default Navbar;