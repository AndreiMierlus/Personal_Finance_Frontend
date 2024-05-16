// PublicRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PublicRoute = ({ component: Component, isAuthenticated, ...rest }) => {
   
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Route {...rest} element={<Component />} />
  );
};

export default PublicRoute;
