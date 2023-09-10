// React imports
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Redux imports
import { useDispatch, useSelector } from 'react-redux';
import { updateLoginStatus, setUser } from './redux/reducers/userSlice';

// Components and pages imports
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Appointments from './components/pages/Appointments';
import UpdateUserProfile from './components/pages/settings/UpdateUserProfile';
import LoginForm from './components/form/loginForm/LoginForm';
import RegistrationForm from './components/form/registrationForm/RegistrationForm';
import PasswordResetForm from './components/form/passwordResetForm/PasswordResetForm';
import Footer from './components/footer/Footer';
import EmailVerification from './components/auth/EmailVerification';
import PasswordReset from './components/auth/PasswordReset';
import ManageShifts from './components/medicalSpecialist/ManageShifts';
import NotFound from './components/pages/NotFound';

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const user = useSelector(state => state.user.userInfo);

  // Simulate checking user's login status
  useEffect(() => {
    // TODO: do i need this function to be async will it ?
    async function fetchLoginStatus() {
      try {
        const response = await fetch('http://localhost:8000/auth/check-login');
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
    <Router>
      {isLoggedIn && (
        <Navbar
          siteTitle='Doctor Patient Appointment Calendar'
          userType={user.UserType}
        />
      )}
      <Routes>
        {/* Only show login and registration forms if not logged in */}
        {!isLoggedIn ? (
          <>
            <Route path='/' element={<LoginForm />} />
            <Route path='/register' element={<RegistrationForm />} />
            <Route path='/password-reset' element={<PasswordResetForm />} />
          </>
        ) : (
          <>
            <Route path='/home' element={<Home user={user} />} />
            <Route path='/appointments' element={<Appointments />} />
            <Route path='/profile-update' element={<UpdateUserProfile />} />
            {user.UserType === 'Medical Specialist' && (
              <Route path='/manage-shifts' element={<ManageShifts />} />
            )}
          </>
        )}
        <Route path='/verify-email/:token' element={<EmailVerification />} />
        <Route path='/reset-password/:token' element={<PasswordReset />} />
        <Route path='*' element={<NotFound />} />
        {/* Protected routes, only visible if logged in */}
      </Routes>

      <Footer name='David Jedwabsky' />
    </Router>
  );
}

export default App;
