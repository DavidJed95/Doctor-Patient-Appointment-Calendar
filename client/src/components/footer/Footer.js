import { Component } from 'react';
import styles from './footer.module.css';

export default class Footer extends Component {
  render() {
    const author = this.props.name;
    const date = new Date().getFullYear();
    return (
      <footer className={styles.footer}>
        <p className={styles.pText}>
          &copy; {date} {author}
        </p>
      </footer>
    );
  }
}
