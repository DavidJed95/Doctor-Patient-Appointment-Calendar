import React, { useState, useEffect } from 'react';

export default function Home({ user }) {
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
