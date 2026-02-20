import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireHR?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireHR = false }) => {
  const { isAuthenticated, isLoading, isHR } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        zIndex: 9999,
      }}>
        <div className="spinner" />
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireHR && !isHR()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
