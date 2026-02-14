import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsService } from '../../services/jobs.service';
import type { Job } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isHR } = useAuth();

  useEffect(() => {
    if (id) {
      loadJob(parseInt(id));
    }
  }, [id]);

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
      <button onClick={() => navigate('/jobs')} className="btn-back">
        ← Back to Jobs
      </button>

      <div className="job-details-card">
        <div className="job-details-header">
          <h1>{job.title}</h1>
          <button 
            onClick={() => navigate(`/apply/${job.id}`)}
            className="btn-primary btn-large"
          >
            Apply Now →
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
            onClick={() => !isHR() && navigate(`/apply/${job.id}`)}
            className={`btn-primary btn-large ${isHR() ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isHR()}
            title={isHR() ? "HR users cannot apply for jobs" : "Apply for this job"}
          >
            {isHR() ? 'HR View Only' : 'Apply for this position →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
