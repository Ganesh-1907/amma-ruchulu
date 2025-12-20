import React from 'react';

export const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-green-200 rounded-full"></div>
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  );
};

export default Loader; 