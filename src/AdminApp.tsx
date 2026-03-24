import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';

const AdminApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('admin_auth') === 'true';
  });

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  return (
    <Router>
      <div className="min-h-screen bg-black text-white font-['Inter']">
        <Routes>
          <Route 
            path="/admin-login" 
            element={isAuthenticated ? <Navigate to="/admin-dashboard" /> : <Login onLogin={handleLogin} />} 
          />
          <Route 
            path="/admin-dashboard" 
            element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/admin-login" />} 
          />
          <Route path="*" element={<Navigate to="/admin-login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default AdminApp;
