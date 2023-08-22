import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Appointments from './components/pages/Appointments';
import UpdateUserProfile from './components/pages/settings/UpdateUserProfile';
import LoginForm from './components/form/loginForm/LoginForm';
import RegistrationForm from './components/form/registrationForm/RegistrationForm';
import PasswordResetForm from './components/form/passwordResetForm/PasswordResetForm';
import Footer from './components/footer/Footer';
import EmailVerification from './components/auth/EmailVerification';
import NotFound from './components/pages/NotFound';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [userGreeting, setUserGreeting] = useState('');

  const updateLoginStatus = status => {
    setIsLoggedIn(status);
  };

  const getUserInformation = user => {
    setUser(user);
  };

  const getUserGreeting = greeting => {
    setUserGreeting(greeting);
  };

  // Simulate checking user's login status
  useEffect(() => {
    async function fetchLoginStatus() {
      try {
        const response = await fetch('http://localhost:8000/auth/check-login');
        const data = await response.json();

        setIsLoggedIn(data.isLoggedIn);
      } catch (error) {
        console.error('Error fetching login status:', error);
      }
    }
    fetchLoginStatus();
  }, []);

  return (
    <Router>
      {isLoggedIn && (
        <Navbar
          siteTitle='Doctor Patient Appointment Calendar'
          isLoggedIn={isLoggedIn}
          updateLoginStatus={updateLoginStatus}
        />
      )}
      <Routes>
        {/* Only show login and registration forms if not logged in */}
        {!isLoggedIn ? (
          <>
            <Route
              path='/'
              element={
                <LoginForm
                  isLoggedIn={isLoggedIn}
                  updateLoginStatus={updateLoginStatus}
                  userInfo={user}
                  getUserInformation={getUserInformation}
                  userGreeting={userGreeting}
                  getUserGreeting={getUserGreeting}
                />
              }
            />
            <Route path='/register' element={<RegistrationForm />} />
            <Route path='/password-reset' element={<PasswordResetForm />} />
            <Route path='*' element={<NotFound />} />
          </>
        ) : (
          <>
            <Route
              path='/home'
              element={<Home userGreeting={userGreeting} />}
            />
            <Route path='/appointments' element={<Appointments />} />
            <Route
              path='/profile-update'
              element={
                <UpdateUserProfile
                  user={user}
                  getUserInformation={getUserInformation}
                />
              }
            />
          </>
        )}
        <Route path='/verify-email/:token' element={<EmailVerification />} />
        <Route path='*' element={<NotFound />} />
        {/* Protected routes, only visible if logged in */}
      </Routes>

      <Footer name='David Jedwabsky' />
    </Router>
  );
}

export default App;
