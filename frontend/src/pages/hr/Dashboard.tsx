import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hrService } from '../../services/hr.service';
import type { HRStats, ApplicationWithJobDetails } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<HRStats | null>(null);
  const [recentApplications, setRecentApplications] = useState<ApplicationWithJobDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsData, applicationsData] = await Promise.all([
        hrService.getStats(),
        hrService.getAllApplications()
      ]);
      setStats(statsData);
      setRecentApplications(applicationsData.slice(0, 5)); // Show only 5 most recent
    } catch (err: any) {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage message="Loading dashboard..." />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>HR Dashboard</h1>
        <p>Manage jobs and applications</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{stats.total_applications}</h3>
              <p>Total Applications</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{stats.pending + stats.evaluating + stats.under_review}</h3>
              <p>Pending Review</p>
            </div>
          </div>

          <div className="stat-card success">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats.accepted}</h3>
              <p>Accepted</p>
            </div>
          </div>

          <div className="stat-card danger">
            <div className="stat-icon">❌</div>
            <div className="stat-content">
              <h3>{stats.rejected}</h3>
              <p>Rejected</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💼</div>
            <div className="stat-content">
              <h3>{stats.active_jobs}</h3>
              <p>Active Jobs</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <h3>{stats.total_jobs}</h3>
              <p>Total Jobs</p>
            </div>
          </div>
        </div>
      )}

      <div className="quick-actions">
        <button onClick={() => navigate('/hr/jobs/create')} className="btn-primary">
          + Create New Job
        </button>
        <button onClick={() => navigate('/hr/applications')} className="btn-secondary">
          View All Applications
        </button>
      </div>

      <div className="recent-section">
        <h2>Recent Applications</h2>
        {recentApplications.length === 0 ? (
          <p className="no-data">No recent applications</p>
        ) : (
          <div className="applications-table">
            <table>
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Job</th>
                  <th>AI Score</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.full_name}</td>
                    <td>{app.job_title}</td>
                    <td>
                      {app.ai_score !== null ? (
                        <span className={`score-badge ${app.ai_score >= 7 ? 'high' : app.ai_score >= 5 ? 'medium' : 'low'}`}>
                          {app.ai_score}/10
                        </span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                    <td>{new Date(app.created_at).toLocaleDateString()}</td>
                    <td>
                      <button 
                        onClick={() => navigate(`/hr/applications/${app.id}`)}
                        className="btn-link"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
