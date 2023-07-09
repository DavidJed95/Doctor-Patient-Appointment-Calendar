
import { Component } from 'react';
import styles from './header.module.css';

export default class Header extends Component {
  render() {
    const mainH1 = this.props.h1Heading;
    return (
      <header className={styles.header}>
        <h1>{mainH1}</h1>
      </header>
    );
  }
}
