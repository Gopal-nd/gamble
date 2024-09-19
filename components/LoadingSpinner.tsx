// LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center">
    <div className="border-t-4 border-blue-500 border-solid w-12 h-12 rounded-full animate-spin"></div>
  </div>
);

export default LoadingSpinner;
