import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear tokens from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('is_admin');

    // Show logout confirmation
    alert('You have been logged out successfully.');

    // Redirect to login page
    navigate('/login');
  }, [navigate]);

  return (
    <div className="min-h-screen w-screen bg-blue-300 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-white">Logging out...</h1>
    </div>
  );
};

export default Logout;