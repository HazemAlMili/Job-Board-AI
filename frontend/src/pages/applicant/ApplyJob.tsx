import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsService } from '../../services/jobs.service';
import { applicationsService } from '../../services/applications.service';
import type { Job } from '../../types';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

const ApplyJob: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a PDF, DOC, or DOCX file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setResume(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!resume) {
      setError('Please upload your resume');
      return;
    }

    if (!job) return;

    setSubmitting(true);

    try {
      await applicationsService.submitApplication({
        job_id: job.id,
        full_name: fullName,
        email: email,
        phone: phone,
        resume: resume,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/my-applications');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage message="Loading..." />;

  if (!job) {
    return (
      <div className="page-container">
        <div className="alert alert-error">Job not found</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="page-container">
        <div className="success-card">
          <span className="success-icon">✅</span>
          <h2>Application Submitted!</h2>
          <p>Your application for <strong>{job.title}</strong> has been submitted successfully.</p>
          <p>Our AI will evaluate your resume and you'll be notified of the results.</p>
          <p className="redirect-message">Redirecting to your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <button onClick={() => navigate(`/jobs/${job.id}`)} className="btn-back">
        ← Back to Job Details
      </button>

      <div className="apply-card">
        <div className="apply-header">
          <h1>Apply for {job.title}</h1>
          <p>{job.location} • {job.salary_range}</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="apply-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1234567890"
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="resume">Resume (PDF, DOC, DOCX - Max 5MB) *</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="resume"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                required
                disabled={submitting}
              />
              {resume && (
                <div className="file-info">
                  <span className="file-icon">📄</span>
                  <span className="file-name">{resume.name}</span>
                  <span className="file-size">
                    ({(resume.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="ai-notice">
            <span className="notice-icon">🤖</span>
            <p>
              Your resume will be evaluated by our AI system. 
              You'll receive feedback and a score based on how well your qualifications match the job requirements.
            </p>
          </div>

          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyJob;
