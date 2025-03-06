import { BASE_URL } from './config';

// React imports
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Redux imports
import { useDispatch, useSelector } from 'react-redux';
import { updateLoginStatus, setUser } from './redux/reducers/userSlice';

// Components and pages imports
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
// import Appointments from './components/pages/Appointments';
import AppointmentManagement from './components/patient/AppointmentManagement';
import UpdateUserProfile from './components/pages/settings/UpdateUserProfile';
import LoginPage from './components/pages/LoginPage';
import RegistrationPage from './components/pages/RegistrationPage';
import PasswordResetPage from './components/pages/PasswordResetPage';
import Footer from './components/footer/Footer';
import EmailVerification from './components/auth/EmailVerification';
import PasswordReset from './components/auth/PasswordReset';
import DoctorShiftManagement from './components/pages/DoctorShiftManagement';
import NotFound from './components/pages/NotFound';

import './App.css';

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const user = useSelector(state => state.user.userInfo);

  // Simulate checking user's login status
  useEffect(() => {
    async function fetchLoginStatus() {
      try {
        const response = await fetch(`${BASE_URL}/auth/check-login`, {credentials: 'include'});
        const data = await response.json();

        dispatch(updateLoginStatus(data.isLoggedIn));
        dispatch(setUser(data.user));
      } catch (error) {
        console.error('Error fetching login status:', error);
      }
    }
    fetchLoginStatus();
  }, [dispatch]);

  return (
    <div className='App'>
      <Router>
        {isLoggedIn && (
          <Navbar siteTitle='Doctor Patient Appointment Calendar' />
        )}
        <Routes>
          {/* Only show login and registration forms if not logged in */}
          {!isLoggedIn ? (
            <>
              <Route path='/' element={<LoginPage />} />
              <Route path='/register' element={<RegistrationPage />} />
              <Route path='/password-reset' element={<PasswordResetPage />} />
            </>
          ) : (
            <>
              <Route path='/home' element={<Home />} />
              <Route path='/appointments' element={<AppointmentManagement />} />
              <Route path='/profile-update' element={<UpdateUserProfile />} />

              <Route
                path='/manage-shifts'
                element={<DoctorShiftManagement />}
              />
            </>
          )}
          <Route path='/verify-email/:token' element={<EmailVerification />} />
          <Route path='/reset-password/:token' element={<PasswordReset />} />
          <Route path='*' element={<NotFound />} />
          {/* Protected routes, only visible if logged in */}
        </Routes>

        <Footer name='David Jedwabsky' />
      </Router>
    </div>
  );
}

export default App;
