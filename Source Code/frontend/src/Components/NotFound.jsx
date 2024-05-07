import React from 'react';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-green-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-green-800">404</h1>
        <p className="text-xl text-green-700">Page Not Found</p>
        <p className="text-md text-green-600">The page you are looking for does not exist.</p>
        <a href="/" className="mt-4 inline-block text-green-500 hover:text-green-600 font-semibold">Go Home</a>
      </div>
    </div>
  );
}

export default NotFound;
