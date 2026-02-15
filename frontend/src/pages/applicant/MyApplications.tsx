import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationsService } from '../../services/applications.service';
import type { Application } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const MyApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApps = async (silent = false) => {
      try {
        if (!silent) setLoading(true);
        const data = await applicationsService.getMyApplications();
        setApplications(data);
        setError('');
      } catch (err: any) {
        if (!silent) setError('Failed to load applications.');
      } finally {
        if (!silent) setLoading(false);
      }
    };

    fetchApps();
    // Poll every 5 seconds for status updates (AI evaluation)
    const interval = setInterval(() => fetchApps(true), 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingSpinner fullPage message="Loading applications..." />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Applications</h1>
        <p>Track the status of your job applications</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {applications.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📝</span>
          <h3>No applications yet</h3>
          <p>Start applying for jobs to see them here</p>
          <button onClick={() => navigate('/jobs')} className="btn-primary">
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((application) => (
            <div key={application.id} className="application-card">
              <div className="application-header">
                <div className="application-info">
                  {application.job ? (
                    <>
                      <h3>{application.job.title}</h3>
                      <p className="application-subtitle" style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                        {application.job.company ? `${application.job.company} • ` : ''}{application.job.location}
                      </p>
                    </>
                  ) : (
                    <h3>{application.full_name}</h3>
                  )}
                  <p className="application-date">
                    Applied on {new Date(application.created_at).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={application.status} />
              </div>

              <div className="application-details">
                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span>{application.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phone:</span>
                  <span>{application.phone}</span>
                </div>
              </div>

              {application.ai_score !== null && (
                <div className="ai-evaluation">
                  <div className="ai-score">
                    <span className="score-label">AI Score:</span>
                    <span className={`score-value ${application.ai_score >= 7 ? 'high' : application.ai_score >= 5 ? 'medium' : 'low'}`}>
                      {application.ai_score}/10
                    </span>
                  </div>
                  {application.ai_feedback && (
                    <div className="ai-feedback">
                      <span className="feedback-label">AI Feedback:</span>
                      <p>{application.ai_feedback}</p>
                    </div>
                  )}
                </div>
              )}

              {application.status === 'pending' && (
                <div className="status-notice pending">
                  <span className="notice-icon">⏳</span>
                  <div className="notice-content">
                    <h4>Application Received</h4>
                    <p>Your application is queued for AI evaluation. This usually takes less than a minute.</p>
                  </div>
                </div>
              )}

              {application.status === 'evaluating' && (
                <div className="status-notice evaluating">
                  <span className="notice-icon">🤖</span>
                  <div className="notice-content">
                    <h4>AI Analysis in Progress</h4>
                    <p>Our AI is currently analyzing your resume against the job requirements...</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
