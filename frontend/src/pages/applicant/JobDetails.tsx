import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsService } from '../../services/jobs.service';
import { applicationsService } from '../../services/applications.service';
import type { Job, Application } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [userApplication, setUserApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, isHR } = useAuth();

  useEffect(() => {
    if (id) {
      loadJob(parseInt(id));
      if (user && !isHR()) {
        checkApplicationStatus(parseInt(id));
      }
    }
  }, [id, user]);

  const loadJob = async (jobId: number) => {
    try {
      const data = await jobsService.getJob(jobId);
      setJob(data);
    } catch (err: any) {
      setError('Failed to load job details.');
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async (jobId: number) => {
    try {
      const apps = await applicationsService.getMyApplications();
      // Get the latest application for this job
      const jobApps = apps
        .filter(app => app.job_id === jobId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      if (jobApps.length > 0) {
        setUserApplication(jobApps[0]);
      }
    } catch (err) {
      console.error('Failed to check application status:', err);
    }
  };

  const getButtonState = () => {
    if (isHR()) {
      return {
        text: 'HR View Only',
        disabled: true,
        className: 'btn-primary btn-large opacity-50 cursor-not-allowed'
      };
    }

    if (!userApplication) {
      return {
        text: 'Apply for this position →',
        disabled: false,
        className: 'btn-primary btn-large'
      };
    }

    switch (userApplication.status) {
      case 'rejected':
        return {
          text: 'Re-apply',
          disabled: false,
          className: 'btn-primary btn-large'
        };
      case 'accepted':
        return {
          text: 'Application Accepted',
          disabled: true,
          className: 'btn-primary btn-large opacity-50 cursor-not-allowed'
        };
      case 'evaluating':
        return {
          text: 'Evaluating...',
          disabled: true,
          className: 'btn-secondary btn-large cursor-wait'
        };
      default:
        // pending, under_review
        return {
          text: 'Application Pending',
          disabled: true,
          className: 'btn-secondary btn-large cursor-not-allowed'
        };
    }
  };

  const btnState = getButtonState();

  if (loading) return <LoadingSpinner fullPage message="Loading job details..." />;

  if (error || !job) {
    return (
      <div className="page-container">
        <div className="alert alert-error">{error || 'Job not found'}</div>
        <button onClick={() => navigate('/jobs')} className="btn-secondary">
          ← Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button 
        onClick={() => navigate('/jobs')} 
        className="btn-back" 
        style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <span>←</span> Back to Jobs
      </button>

      <div className="job-details-card">
        <div className="job-details-header">
          <h1>{job.title}</h1>
          <button 
            onClick={() => !btnState.disabled && navigate(`/apply/${job.id}`)}
            className={btnState.className}
            disabled={btnState.disabled}
          >
            {btnState.text}
          </button>
        </div>

        <div className="job-meta">
          <div className="meta-item">
            <span className="meta-icon">📍</span>
            <span>{job.location}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">💰</span>
            <span>{job.salary_range}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">📅</span>
            <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="job-section">
          <h2>Job Description</h2>
          <p className="job-description-full">{job.description}</p>
        </div>

        <div className="job-section">
          <h2>Requirements</h2>
          <div className="requirements-list">
            {job.requirements.split('\n').map((req, index) => (
              req.trim() && (
                <div key={index} className="requirement-item">
                  <span className="requirement-bullet">✓</span>
                  <span>{req.trim()}</span>
                </div>
              )
            ))}
          </div>
        </div>

        <div className="job-details-footer">
          <button 
            onClick={() => !btnState.disabled && navigate(`/apply/${job.id}`)}
            className={btnState.className}
            disabled={btnState.disabled}
          >
            {btnState.text}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
