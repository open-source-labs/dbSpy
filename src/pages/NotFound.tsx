import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '5rem' }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <p>
        <Link className="text-blue-600 dark:text-[#f8f4eb]" to="/">
          Return to homepage
        </Link>
      </p>
    </div>
  );
};

export default NotFound;
