import React from 'react';

const SpinnerLoader = () => {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
    </div>
  );
};

export default SpinnerLoader;
