// AppRoutes.js
import React from 'react';
import { useSelector } from 'react-redux';

import {
  Login,
  Register,
  Dashboard,
  VerifyEmailPage,
  VerificationMessage,
  ResetPassword,
  Income,
  Expenses,
  Goals,
} from '../pages/';
import ProtectedRoute from './ProtectedRoutes'; // Import the ProtectedRoute component
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ForgetPassword from '../pages/ForgetPassword';
import EditIncome from '../pages/EditIncome';
import EditExpenses from '../pages/EditExpense';
import EditGoal from '../pages/EditGoal';

const AppRoutes = () => {
  const { auth } = useSelector((state) => state.auth);

  return (
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/income"
          element={
            <ProtectedRoute>
              <Income />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <Goals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/income/:id"
          element={
            <ProtectedRoute>
              <EditIncome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/goal/:id"
          element={
            <ProtectedRoute>
              <EditGoal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses/:id"
          element={
            <ProtectedRoute>
              <EditExpenses />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/resetpassword/:token" element={<ResetPassword />} />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
        <Route path="/emailverification" element={<VerificationMessage />} />
      </Routes>

  );
};

export default AppRoutes;
