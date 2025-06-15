import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <i className="fas fa-exclamation-triangle text-4xl text-gray-400 dark:text-gray-600" />
        </div>

        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Page Not Found
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved to another
          location.
        </p>

        <div className="space-x-4">
          <Link to="/">
            <Button variant="primary" icon="home">
              Go Home
            </Button>
          </Link>
          <Button
            variant="ghost"
            icon="arrow-left"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};
