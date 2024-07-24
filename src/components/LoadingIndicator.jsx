import React from 'react';

const LoadingIndicator = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="border-t-4 border-b-4 border-white border-solid rounded-full w-16 h-16 animate-spin"></div>
    </div>
);

export default LoadingIndicator;
