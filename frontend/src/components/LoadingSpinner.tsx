import React from 'react';

interface LoadingSpinnerProps {
  fullPage?: boolean;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  fullPage = false, 
  message = 'Loading...' 
}) => {
  if (fullPage) {
    return (
      <div className="loading-container fullpage">
        <div className="spinner"></div>
        <p className="loading-message">{message}</p>
      </div>
    );
  }

  return (
    <div className="loading-container inline">
      <div className="spinner small"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
