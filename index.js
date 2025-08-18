import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import HeaderSection from './components/HeaderSection';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import PatientManager from './components/PatientManager';
import UploaderSection from './components/UploaderSection';

// A wrapper for routes that require authentication
const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

// A wrapper for routes that require a specific role
const RoleRoute = ({ children, roles }) => {
    const { hasRole } = useAuth();
    return hasRole(roles) ? children : <p>Access Denied. You do not have the required permissions.</p>;
};

function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a proper spinner
  }

  return (
    <Router>
      <HeaderSection />
      <main className="p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <PrivateRoute>
              <UploaderSection />
            </PrivateRoute>
          } />
          <Route path="/patients" element={
            <PrivateRoute>
              <PatientManager />
            </PrivateRoute>
          } />
          <Route path="/admin" element={
            <PrivateRoute>
              <RoleRoute roles={['admin']}>
                <AdminDashboard />
              </RoleRoute>
            </PrivateRoute>
          } />
          <Route path="*" element={<p>404 Not Found</p>} />
        </Routes>
      </main>
    </Router>
  );
}

// Main App component
export default function Home() {
  // Replace with your actual Firebase app initialization
  const firebaseApp = {}; 

  return (
    <AuthProvider app={firebaseApp}>
      <NotificationProvider app={firebaseApp}>
        <AppLayout />
      </NotificationProvider>
    </AuthProvider>
  );
}