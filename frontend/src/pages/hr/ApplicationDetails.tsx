import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hrService } from '../../services/hr.service';
import type { ApplicationWithJobDetails, Application } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';

const ApplicationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<ApplicationWithJobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadApplication(parseInt(id));
    }
  }, [id]);

  const loadApplication = async (appId: number) => {
    try {
      const data = await hrService.getApplicationDetails(appId);
      setApplication(data);
    } catch (err: any) {
      setError('Failed to load application details.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: Application['status']) => {
    if (!application) return;

    setUpdating(true);
    try {
      await hrService.updateApplicationStatus(application.id, newStatus);
      setApplication({ ...application, status: newStatus });
    } catch (err: any) {
      alert('Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage message="Loading application..." />;

  if (error || !application) {
    return (
      <div className="page-container">
        <div className="alert alert-error">{error || 'Application not found'}</div>
        <button onClick={() => navigate('/hr/applications')} className="btn-secondary">
          ← Back to Applications
        </button>
      </div>
    );
  }

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  return (
    <div className="page-container">
      <button onClick={() => navigate('/hr/applications')} className="btn-back">
        ← Back to Applications
      </button>

      <div className="application-details-card">
        <div className="details-header">
          <div>
            <h1>{application.full_name}</h1>
            <p className="details-subtitle">Applied for {application.job_title}</p>
          </div>
          <StatusBadge status={application.status} />
        </div>

        <div className="details-grid">
          <div className="detail-section">
            <h3>Contact Information</h3>
            <div className="detail-item">
              <span className="detail-icon">📧</span>
              <div>
                <p className="detail-label">Email</p>
                <p className="detail-value">{application.email}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📱</span>
              <div>
                <p className="detail-label">Phone</p>
                <p className="detail-value">{application.phone}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">💼</span>
              <div>
                <p className="detail-label">Job</p>
                <p className="detail-value">{application.job_title}</p>
              </div>
            </div>
            <div className="detail-item">
              <span className="detail-icon">📍</span>
              <div>
                <p className="detail-label">Location</p>
                <p className="detail-value">{application.job_location}</p>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Application Timeline</h3>
            <div className="timeline">
              <div className="timeline-item">
                <span className="timeline-icon">📅</span>
                <div>
                  <p className="timeline-label">Applied</p>
                  <p className="timeline-value">
                    {new Date(application.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              {application.evaluated_at && (
                <div className="timeline-item">
                  <span className="timeline-icon">🤖</span>
                  <div>
                    <p className="timeline-label">AI Evaluated</p>
                    <p className="timeline-value">
                      {new Date(application.evaluated_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {application.ai_score !== null && (
          <div className="ai-evaluation-section">
            <h3>AI Evaluation</h3>
            <div className="ai-score-display">
              <div className="score-circle">
                <span className={`score-number ${application.ai_score >= 7 ? 'high' : application.ai_score >= 5 ? 'medium' : 'low'}`}>
                  {application.ai_score}
                </span>
                <span className="score-total">/10</span>
              </div>
              <div className="score-details">
                <p className="score-label">AI Match Score</p>
                <p className="score-description">
                  {application.ai_score >= 7 ? 'Excellent match' : 
                   application.ai_score >= 5 ? 'Good match' : 'Needs review'}
                </p>
              </div>
            </div>
            {application.ai_feedback && (
              <div className="ai-feedback-box">
                <h4>AI Feedback</h4>
                <p>{application.ai_feedback}</p>
              </div>
            )}
          </div>
        )}

        <div className="resume-section">
          <h3>Resume</h3>
          <div className="resume-download">
            <span className="file-icon">📄</span>
            <div className="file-details">
              <p className="file-name">Resume.pdf</p>
              <p className="file-info">Uploaded on {new Date(application.created_at).toLocaleDateString()}</p>
            </div>
            <a 
              href={`${API_URL}/${application.resume_path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-download"
            >
              Download
            </a>
          </div>
        </div>

        <div className="status-actions">
          <h3>Update Status</h3>
          <div className="action-buttons">
            <button
              onClick={() => handleStatusUpdate('under_review')}
              disabled={updating || application.status === 'under_review'}
              className="btn-status btn-review"
            >
              👁️ Move to Review
            </button>
            <button
              onClick={() => handleStatusUpdate('accepted')}
              disabled={updating || application.status === 'accepted'}
              className="btn-status btn-accept"
            >
              ✅ Accept
            </button>
            <button
              onClick={() => handleStatusUpdate('rejected')}
              disabled={updating || application.status === 'rejected'}
              className="btn-status btn-reject"
            >
              ❌ Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
