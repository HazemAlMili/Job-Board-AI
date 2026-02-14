import React from 'react';
import type { Application } from '../types';

interface StatusBadgeProps {
  status: Application['status'] | 'active' | 'closed';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'pending':
        return { icon: '⏳', text: 'Pending', className: 'status-pending' };
      case 'evaluating':
        return { icon: '🤖', text: 'AI Evaluating', className: 'status-evaluating' };
      case 'rejected':
        return { icon: '❌', text: 'Rejected', className: 'status-rejected' };
      case 'under_review':
        return { icon: '👁️', text: 'Under Review', className: 'status-review' };
      case 'accepted':
        return { icon: '✅', text: 'Accepted', className: 'status-accepted' };
      case 'active':
        return { icon: '🟢', text: 'Active', className: 'status-active' };
      case 'closed':
        return { icon: '🔴', text: 'Closed', className: 'status-closed' };
      default:
        return { icon: '❓', text: status, className: 'status-unknown' };
    }
  };

  const { icon, text, className } = getStatusInfo();

  return (
    <span className={`status-badge ${className}`}>
      <span className="status-icon">{icon}</span>
      <span className="status-text">{text}</span>
    </span>
  );
};

export default StatusBadge;
