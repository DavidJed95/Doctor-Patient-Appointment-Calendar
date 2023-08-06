import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Appointments from './components/pages/Appointments';
import About from './components/pages/About';
import LoginForm from './components/form/loginForm/LoginForm';
import RegistrationForm from './components/form/registrationForm/RegistrationForm';
import PasswordResetForm from './components/form/passwordResetForm/PasswordResetForm';

function App() {
  const isLoggedIn = window.localStorage.getItem('loggedIn');
  return (
    <Router>
      <Routes>
        <Route path='/' element={isLoggedIn ? <Home /> : <LoginForm />} />
        <Route path='/register' element={<RegistrationForm />} />
        <Route path='/password-reset' element={<PasswordResetForm />} />

        {/* Pages after logging in */}
        {isLoggedIn && <Navbar/> }
        <Route path='/home' element={<Home />} />
        <Route path='/appointments' element={<Appointments />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
