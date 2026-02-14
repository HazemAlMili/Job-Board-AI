import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsService } from '../../services/jobs.service';
import type { Job } from '../../types';
import JobCard from '../../components/JobCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';

const ManageJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('all');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<number | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await jobsService.getAllJobs();
      setJobs(data);
    } catch (err: any) {
      setError('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setJobToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!jobToDelete) return;

    try {
      await jobsService.deleteJob(jobToDelete);
      setJobs(jobs.filter(job => job.id !== jobToDelete));
      setDeleteModalOpen(false);
      setJobToDelete(null);
    } catch (err: any) {
      setError('Failed to delete job. It may have active dependencies.');
      setDeleteModalOpen(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.status === filter;
  });

  if (loading) return <LoadingSpinner fullPage message="Loading jobs..." />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Manage Jobs</h1>
        <button onClick={() => navigate('/hr/jobs/create')} className="btn-primary">
          + Create New Job
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <button className="close-alert" onClick={() => setError('')}>&times;</button>
        </div>
      )}

      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Jobs ({jobs.length})
        </button>
        <button 
          className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active ({jobs.filter(j => j.status === 'active').length})
        </button>
        <button 
          className={`filter-tab ${filter === 'closed' ? 'active' : ''}`}
          onClick={() => setFilter('closed')}
        >
          Closed ({jobs.filter(j => j.status === 'closed').length})
        </button>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>No jobs found</h3>
          <p>Create your first job posting</p>
          <button onClick={() => navigate('/hr/jobs/create')} className="btn-primary">
            Create Job
          </button>
        </div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <div key={job.id} className="job-card-wrapper">
              <JobCard job={job} showStatus={true} />
              <div className="job-card-actions">
                <button 
                  onClick={() => navigate(`/hr/jobs/edit/${job.id}`)}
                  className="btn-edit"
                >
                  ✏️ Edit
                </button>
                <button 
                  onClick={() => handleDeleteClick(job.id)}
                  className="btn-delete"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={deleteModalOpen}
        title="Delete Job"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      >
        <p>Are you sure you want to delete this job posting?</p>
        <p className="text-muted text-sm mt-2">This action cannot be undone. Associated applications will also be deleted.</p>
      </Modal>
    </div>
  );
};

export default ManageJobs;

