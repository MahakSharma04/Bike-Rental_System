import React from 'react';

const StatusBadge = ({ status }) => {
  // Determine color based on status
  const getStatusColors = () => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
      case 'REPAIRED':
        return 'bg-green-100 text-green-800';
      case 'SCHEDULED':
      case 'PENDING':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
      case 'UNDER_REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColors()}`}>
      {status ? status.replace(/_/g, ' ') : 'Unknown'}
    </span>
  );
};

export default StatusBadge; 