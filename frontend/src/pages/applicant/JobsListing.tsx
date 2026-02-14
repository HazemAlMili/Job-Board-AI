import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsService } from '../../services/jobs.service';
import type { Job } from '../../types';
import JobCard from '../../components/JobCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const JobsListing: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await jobsService.getActiveJobs();
      setJobs(data);
    } catch (err: any) {
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner fullPage message="Loading jobs..." />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Browse Jobs</h1>
        <p>Find your dream job with AI-powered matching</p>
      </div>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search jobs by title, location, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {filteredJobs.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>No jobs found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onClick={() => navigate(`/jobs/${job.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsListing;
