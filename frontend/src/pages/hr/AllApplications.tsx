import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hrService } from '../../services/hr.service';
import type { ApplicationWithJobDetails } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const AllApplications: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationWithJobDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await hrService.getAllApplications();
      setApplications(data);
    } catch {
      setError('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (statusFilter === 'all') return true;
    return app.status === statusFilter;
  });

  const sortedApplications = filteredApplications.sort((a, b) => {
    if (a.ai_score !== null && b.ai_score !== null) {
      return b.ai_score - a.ai_score;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (loading) return <LoadingSpinner fullPage message="Loading applications..." />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>All Applications</h1>
        <p>Review and manage job applications</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="filter-tabs">
        <button 
          className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          All ({applications.length})
        </button>
        <button 
          className={`filter-tab ${statusFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setStatusFilter('pending')}
        >
          Pending ({applications.filter(a => a.status === 'pending').length})
        </button>
        <button 
          className={`filter-tab ${statusFilter === 'under_review' ? 'active' : ''}`}
          onClick={() => setStatusFilter('under_review')}
        >
          Under Review ({applications.filter(a => a.status === 'under_review').length})
        </button>
        <button 
          className={`filter-tab ${statusFilter === 'accepted' ? 'active' : ''}`}
          onClick={() => setStatusFilter('accepted')}
        >
          Accepted ({applications.filter(a => a.status === 'accepted').length})
        </button>
        <button 
          className={`filter-tab ${statusFilter === 'rejected' ? 'active' : ''}`}
          onClick={() => setStatusFilter('rejected')}
        >
          Rejected ({applications.filter(a => a.status === 'rejected').length})
        </button>
      </div>

      {sortedApplications.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>No applications found</h3>
          <p>No applications match the selected filter</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="applications-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Job</th>
                <th>Location</th>
                <th>AI Score</th>
                <th>Status</th>
                <th>Applied</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedApplications.map((app) => (
                <tr key={app.id} onClick={() => navigate(`/hr/applications/${app.id}`)}>
                  <td data-label="Applicant">
                    <div className="applicant-cell">
                      <strong>{app.full_name}</strong>
                      <small>{app.email}</small>
                    </div>
                  </td>
                  <td data-label="Job">{app.job_title}</td>
                  <td data-label="Location">{app.job_location}</td>
                  <td data-label="AI Score">
                    {app.ai_score !== null ? (
                      <span className={`score-badge ${app.ai_score >= 7 ? 'high' : app.ai_score >= 5 ? 'medium' : 'low'}`}>
                        {app.ai_score}/10
                      </span>
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>
                  <td data-label="Status">
                    <StatusBadge status={app.status} />
                  </td>
                  <td data-label="Applied">{new Date(app.created_at).toLocaleDateString()}</td>
                  <td data-label="Action">
                    <button className="btn-link">View →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllApplications;
