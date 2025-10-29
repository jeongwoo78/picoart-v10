import React from 'react';
import './LoadingSkeleton.css';

const LoadingSkeleton = ({ count = 15 }) => {
  return (
    <div className="loading-skeleton-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-card">
          <div className="skeleton-image" />
          <div className="skeleton-footer">
            <div className="skeleton-badges">
              <div className="skeleton-badge" />
              <div className="skeleton-badge" />
              <div className="skeleton-badge" />
            </div>
            <div className="skeleton-text skeleton-text-title" />
            <div className="skeleton-text skeleton-text-subtitle" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
