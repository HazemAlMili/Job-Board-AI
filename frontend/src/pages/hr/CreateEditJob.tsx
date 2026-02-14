import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobsService } from '../../services/jobs.service';
import type { CreateJobDTO, UpdateJobDTO } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';

const CreateEditJob: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [location, setLocation] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [status, setStatus] = useState<'active' | 'closed'>('active');
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      loadJob(parseInt(id));
    }
  }, [id, isEdit]);

  const loadJob = async (jobId: number) => {
    try {
      const job = await jobsService.getJob(jobId);
      setTitle(job.title);
      setDescription(job.description);
      setRequirements(job.requirements);
      setLocation(job.location);
      setSalaryRange(job.salary_range);
      setStatus(job.status);
    } catch (err: any) {
      setError('Failed to load job details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isEdit && id) {
        const updateData: UpdateJobDTO = {
          title,
          description,
          requirements,
          location,
          salary_range: salaryRange,
          status,
        };
        await jobsService.updateJob(parseInt(id), updateData);
      } else {
        const createData: CreateJobDTO = {
          title,
          description,
          requirements,
          location,
          salary_range: salaryRange,
        };
        await jobsService.createJob(createData);
      }
      navigate('/hr/jobs');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save job.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="page-container">
      <button onClick={() => navigate('/hr/jobs')} className="btn-back">
        ← Back to Jobs
      </button>

      <div className="form-card">
        <h1>{isEdit ? 'Edit Job' : 'Create New Job'}</h1>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="job-form">
          <div className="form-group">
            <label htmlFor="title">Job Title *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Remote, New York, USA"
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="salaryRange">Salary Range *</label>
            <input
              type="text"
              id="salaryRange"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              placeholder="e.g. $80,000 - $120,000"
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Job Description *</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the role, responsibilities, and what the candidate will do..."
              rows={6}
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="requirements">Requirements *</label>
            <textarea
              id="requirements"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="List the required skills, experience, and qualifications (one per line)"
              rows={6}
              required
              disabled={submitting}
            />
            <small className="form-hint">Enter one requirement per line</small>
          </div>

          {isEdit && (
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'closed')}
                disabled={submitting}
              >
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/hr/jobs')} 
              className="btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : isEdit ? 'Update Job' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditJob;
