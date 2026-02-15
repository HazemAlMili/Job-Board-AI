import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, isHR } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isWelcomePage = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`navbar ${isWelcomePage ? 'navbar-transparent' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src="/logo.svg" alt="Job Board AI" className="logo-image" style={{ marginRight: '0.5rem' }} />
          <span className="logo-text">Job Board AI</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-menu">
          {isAuthenticated ? (
            <>
              {isHR() ? (
                <>
                  <Link to="/hr/dashboard" className="nav-link">Dashboard</Link>
                  <Link to="/hr/jobs" className="nav-link">Manage Jobs</Link>
                  <Link to="/hr/applications" className="nav-link">Applications</Link>
                </>
              ) : (
                <>
                  <Link to="/jobs" className="nav-link">Browse Jobs</Link>
                  <Link to="/my-applications" className="nav-link">My Applications</Link>
                </>
              )}
              <div className="user-menu">
                <button className="user-button">
                  <span className="user-icon">👤</span>
                  <span className="user-name">{user?.full_name}</span>
                </button>
                <div className="user-dropdown">
                  <div className="dropdown-item user-info">
                    <p className="user-email">{user?.email}</p>
                    <span className={`role-badge ${user?.role}`}>{user?.role}</span>
                  </div>
                  <Link to="/profile" className="dropdown-item profile-link">
                    <span>👤</span> My Profile
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item logout-btn">
                    <span>🚪</span> Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="hamburger-icon">{mobileMenuOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          {isAuthenticated ? (
            <>
              {isHR() ? (
                <>
                  <Link to="/hr/dashboard" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                  <Link to="/hr/jobs" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Manage Jobs</Link>
                  <Link to="/hr/applications" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Applications</Link>
                </>
              ) : (
                <>
                  <Link to="/jobs" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Browse Jobs</Link>
                  <Link to="/my-applications" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>My Applications</Link>
                </>
              )}
              <div className="mobile-user-info">
                <p>{user?.full_name}</p>
                <p className="mobile-email">{user?.email}</p>
                <Link to="/profile" className="mobile-link" onClick={() => setMobileMenuOpen(false)} style={{marginTop: '0.5rem'}}>My Profile</Link>
              </div>
              <button onClick={handleLogout} className="mobile-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
