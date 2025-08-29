import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ApplyForCertificate from './pages/citizen/ApplyForCertificate';
import VerifyDocument from './pages/VerifyDocument';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={`/${user.role}`} replace /> : <LoginPage />} />
      
      {/* Citizen Routes */}
      <Route path="/citizen" element={
        <ProtectedRoute allowedRoles={['citizen']}>
          <Layout><CitizenDashboard /></Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/citizen/apply" element={
        <ProtectedRoute allowedRoles={['citizen']}>
          <Layout><ApplyForCertificate /></Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/citizen/applications" element={
        <ProtectedRoute allowedRoles={['citizen']}>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">My Applications</h2>
              <p className="text-gray-600">This page would show all citizen applications with detailed tracking.</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />

      {/* Officer Routes */}
      <Route path="/officer" element={
        <ProtectedRoute allowedRoles={['officer']}>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Officer Dashboard</h2>
              <p className="text-gray-600">Officer dashboard with pending reviews and verification tools.</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/officer/pending" element={
        <ProtectedRoute allowedRoles={['officer']}>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Reviews</h2>
              <p className="text-gray-600">Applications waiting for officer review and verification.</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/officer/verified" element={
        <ProtectedRoute allowedRoles={['officer']}>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Verified Documents</h2>
              <p className="text-gray-600">Previously verified documents by this officer.</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Dashboard</h2>
              <p className="text-gray-600">System administration with analytics and officer management.</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/admin/applications" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">All Applications</h2>
              <p className="text-gray-600">System-wide application monitoring and management.</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/admin/officers" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Officers Management</h2>
              <p className="text-gray-600">Manage government officers and their permissions.</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/admin/settings" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Layout>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">System Settings</h2>
              <p className="text-gray-600">Configure system-wide settings and security parameters.</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />

      {/* Shared Routes */}
      <Route path="/verify" element={
        <ProtectedRoute>
          <Layout><VerifyDocument /></Layout>
        </ProtectedRoute>
      } />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <AppRoutes />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  style: {
                    background: '#10B981',
                  },
                },
                error: {
                  style: {
                    background: '#EF4444',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}