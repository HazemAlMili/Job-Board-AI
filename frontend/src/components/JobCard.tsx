import React from 'react';
import type { Job } from '../types';

interface JobCardProps {
  job: Job;
  onClick?: () => void;
  showStatus?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, onClick, showStatus = false }) => {
  return (
    <div className="job-card" onClick={onClick}>
      <div className="job-card-header">
        <h3 className="job-title">{job.title}</h3>
        {showStatus && (
          <span className={`status-badge ${job.status}`}>
            {job.status}
          </span>
        )}
      </div>
      
      <div className="job-details">
        <div className="job-detail-item">
          <span className="icon">📍</span>
          <span>{job.location}</span>
        </div>
        <div className="job-detail-item">
          <span className="icon">💰</span>
          <span>{job.salary_range}</span>
        </div>
        <div className="job-detail-item">
          <span className="icon">📅</span>
          <span>{new Date(job.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      <p className="job-description">
        {job.description.length > 150 
          ? `${job.description.substring(0, 150)}...` 
          : job.description}
      </p>

      <div className="job-card-footer">
        <button className="btn-view-details">
          View Details →
        </button>
      </div>
    </div>
  );
};

export default JobCard;
