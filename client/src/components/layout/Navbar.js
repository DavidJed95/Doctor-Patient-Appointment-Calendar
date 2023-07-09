import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './navbar.module.css';

import CustomLink from './CustomLink';

export default class Navbar extends Component {
  render() {
    const siteTitle = this.props.siteTitle;
    return (
      <nav className={styles.nav}>
        <Link to='/' className={styles.siteTitle}>
          {siteTitle}
        </Link>
        <ul>
          <CustomLink to='/appointments'>Appointments</CustomLink>

          <CustomLink to='/about'>About</CustomLink>
        </ul>
      </nav>
    );
  }
}
