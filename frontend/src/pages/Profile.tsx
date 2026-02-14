import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="page-container">
        <div className="profile-card">
          <p>Please log in to view your profile.</p>
          <button onClick={() => navigate('/login')} className="btn-primary">
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="profile-container">
        <h1 className="page-title">My Profile</h1>
        
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="profile-identity">
              <h2>{user.full_name}</h2>
              <span className={`role-badge ${user.role} badge-large`}>
                {user.role}
              </span>
            </div>
          </div>

          <div className="profile-details-grid">
            <div className="detail-card">
              <label>Email Address</label>
              <div className="detail-value">{user.email}</div>
            </div>
            
            <div className="detail-card">
              <label>Role</label>
              <div className="detail-value capitalize">{user.role} Account</div>
            </div>

            <div className="detail-card">
              <label>Member Since</label>
              <div className="detail-value">
                {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : 'Just joined'}
              </div>
            </div>
            
            <div className="detail-card">
              <label>Account Status</label>
              <div className="detail-value">
                <span className="status-badge active">
                  <span className="status-dot"></span>
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="profile-footer">
            <button 
              onClick={handleLogout}
              className="btn-danger btn-large icon-btn"
            >
              <span>🚪</span> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
