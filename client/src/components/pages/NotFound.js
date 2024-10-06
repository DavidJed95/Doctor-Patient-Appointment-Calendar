import React from 'react'
import { Link } from 'react-router-dom';
import usePageTitle from '../../hooks/usePageTitle';

 const NotFound = () => {
  usePageTitle('Not Found - 404');
  return (
    <div>
      <h1>404 - Page Not Found!</h1>
      <p>The path you are looking for does not exist.</p>
      <Link to='/'>Go to login</Link>
    </div>
  );
}
export default NotFound;