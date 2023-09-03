import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import CustomLink from './CustomLink';
import Button from '../button/Button';
import styles from './navbar.module.css';

const Navbar = ({ siteTitle, isLoggedIn, updateLoginStatus, userType }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        updateLoginStatus(false);
        navigate('/');
      }
    } catch (error) {}
  };
  return (
    <nav className={styles.nav}>
      <Link to='home' className={styles.siteTitle}>
        {siteTitle}
      </Link>
      <ul>
        <CustomLink to='/home'>Home</CustomLink>
        <CustomLink to='/appointments'>Appointments</CustomLink>
        <CustomLink to='/profile-update'>Profile Update</CustomLink>
        {userType === 'Medical Specialist' && (
          <CustomLink to='manage-shifts'>Manage Shifts</CustomLink>
        )}
        <Button
          className={styles.navLogoutButton}
          text='Logout'
          fun={handleLogout}
        />
      </ul>
    </nav>
  );
};

export default Navbar;
