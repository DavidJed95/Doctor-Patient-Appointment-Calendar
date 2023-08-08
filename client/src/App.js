import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Appointments from './components/pages/Appointments';
import UpdateUserProfile from './components/pages/settings/UpdateUserProfile';
import About from './components/pages/About';
import LoginForm from './components/form/loginForm/LoginForm';
import RegistrationForm from './components/form/registrationForm/RegistrationForm';
import PasswordResetForm from './components/form/passwordResetForm/PasswordResetForm';
import Footer from './components/footer/Footer';

function App() {
  const isLoggedIn = window.localStorage.getItem('loggedIn');
  console.log('isLoggedIn:', isLoggedIn);
  // <Route
  //   path='/'
  //   element={isLoggedIn === 'true' ? <Home /> : <LoginForm />}
  // />
  // <Route path='/register' element={<RegistrationForm />} />
  // <Route path='/password-reset' element={<PasswordResetForm />} />
  // {/* Pages after logging in */}
  // {isLoggedIn === 'true' && (
  //   <>
  //     <Navbar />
  //     <Route path='/home' element={<Home />} />
  //     <Route path='/appointments' element={<Appointments />} />
  //     <Route path='/about' element={<About />} />
  //     <Route path='/profile/update' element={<UpdateUserProfile />} />
  //     <Footer />
  //   </>
  // )}
  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={isLoggedIn === 'true' ? <Home /> : <LoginForm />}
        />
        <Route path='/register' element={<RegistrationForm />} />
        <Route path='/password-reset' element={<PasswordResetForm />} />
      </Routes>
      <Navbar siteTitle='Doctor Patient Appointment Calendar' />
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/appointments' element={<Appointments />} />
        <Route path='/about' element={<About />} />
        <Route path='/profile/update' element={<UpdateUserProfile />} />
      </Routes>
      <Footer name='David Jedwabsky' />
    </Router>
  );
}

export default App;
