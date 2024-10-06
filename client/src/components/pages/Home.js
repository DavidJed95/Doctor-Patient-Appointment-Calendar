import React, { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import usePageTitle from '../../hooks/usePageTitle'
export default function Home() {
  usePageTitle(Home.name)
  const user = useSelector(state => state.user.userInfo);
  const [greeting, setGreeting] = useState('Welcome');

  useEffect(() => {
    if (user && user.UserType) {
      const userTypePrefix =
        user.UserType === 'Medical Specialist' ? 'Doctor ' : '';
      setGreeting(
        `Welcome ${userTypePrefix}${user.FirstName || ''} ${
          user.LastName || ''
        }`,
      );
    } else {
      // If no user or UserType is missing, set a default greeting
      setGreeting('Welcome Guest');
    }
  }, [user]);

  return (
    <div>
      <h1>{greeting}</h1>
    </div>
  );
}
