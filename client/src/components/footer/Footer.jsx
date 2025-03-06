import { Component } from 'react';
import styles from './footer.module.css';

export default class Footer extends Component {
  render() {
    const copyRight = ' Copyright by';
    const author = this.props.name;
    const date = new Date().getFullYear();
    return (
      <footer className={styles.footer}>
        <p className={styles.pText}>
          &copy; {`${date}.`} {copyRight} {author}
        </p>
      </footer>
    );
  }
}
