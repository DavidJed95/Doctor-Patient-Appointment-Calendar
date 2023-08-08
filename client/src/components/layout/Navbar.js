import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './navbar.module.css';

import CustomLink from './CustomLink';

export default class Navbar extends Component {
  render() {
    const siteTitle = this.props.siteTitle;
    return (
      <nav className={styles.nav}>
        <Link to='home' className={styles.siteTitle}>
          {siteTitle}
        </Link>
        <ul>
          <CustomLink to='/about'>About</CustomLink>
          <CustomLink to='/appointments'>Appointments</CustomLink>
          <CustomLink to='/profile-update'>Profile Update</CustomLink>
          <CustomLink to='/'>Logout</CustomLink>
        </ul>
      </nav>
    );
  }
}
