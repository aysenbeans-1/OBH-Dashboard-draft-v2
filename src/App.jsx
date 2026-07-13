/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ManageServices } from './pages/ManageServices';
import { OTPDeliveries } from './pages/OTPDeliveries';
import { ManageTenant } from './pages/ManageTenant';
import { UserProfileConfig } from './pages/UserProfileConfig';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { CustomerStats } from './pages/CustomerStats';
import { OTPDevice } from './pages/OTPDevice';
import { Layout } from './components/Layout';
import { useState, useEffect } from 'react';

export default function App() {
  const [user, setUser] = useState(null);

  // Simple mock auth check for session persistence (if I were using localstorage)
  useEffect(() => {
    const savedUser = localStorage.getItem('otp_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (u) => {
    setUser(u);
    localStorage.setItem('otp_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('otp_user');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/:tenantId/login" element={<LoginPage onLogin={handleLogin} />} />
        
        <Route
          path="/"
          element={
            user ? (
              user.role === 'admin' ? (
                <Navigate to="/admin/numbers" replace />
              ) : (
                <Navigate to={`/${user.tenantId || 'default'}/dashboard/reports`} replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/admin/*"
          element={
            user?.role === 'admin' ? (
              <Layout user={user} onLogout={handleLogout}>
                <Routes>
                  <Route path="numbers" element={<AdminDashboard />} />
                  <Route path="service" element={<Navigate to="/admin/service/sms" replace />} />
                  <Route path="service/sms" element={<ManageServices typeOverride="SMS" />} />
                  <Route path="service/push" element={<ManageServices typeOverride="PUSH" />} />
                  <Route path="deliveries" element={<OTPDeliveries />} />
                  <Route path="tenant" element={<Navigate to="/admin/tenant/config" replace />} />
                  <Route path="tenant/config" element={<ManageTenant user={user} />} />
                  <Route path="tenant/profile" element={<UserProfileConfig user={user} />} />
                  <Route path="*" element={<Navigate to="/admin/numbers" replace />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/:tenantId/dashboard/*"
          element={
            user?.role === 'customer' ? (
              <Layout user={user} onLogout={handleLogout}>
                <Routes>
                  <Route path="reports" element={<CustomerDashboard />} />
                  <Route path="stats" element={<CustomerStats />} />
                  <Route path="device" element={<OTPDevice />} />
                  <Route path="*" element={<Navigate to="reports" replace />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
