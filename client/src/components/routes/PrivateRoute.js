import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element, isLoggedIn, ...rest }) => {
  return isLoggedIn ? <Element {...rest} /> : <Navigate to='/' replace />;
};

export default PrivateRoute;
