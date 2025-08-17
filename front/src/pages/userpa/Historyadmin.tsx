// ./pages/adminpa/AdminHistory.tsx
import React, { useState, useEffect } from "react";
import { FaHistory } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminHistory: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      navigate('/login');
      return;
    }

    // Simulate fetching history data (replace with your API call)
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [navigate]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const mainClasses = darkMode 
    ? "bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white" 
    : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800";

  const cardClasses = darkMode
    ? "bg-white/10 backdrop-blur-md shadow-xl"
    : "bg-white/80 backdrop-blur-md shadow-lg";

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Chargement de l'historique...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="bg-red-500/20 backdrop-blur-md p-8 rounded-xl max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Erreur</h2>
          <p className="text-white">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen w-screen ${mainClasses} flex flex-col p-6`}>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <FaHistory className="mr-3" /> Admin History
        </h1>
        <button
          onClick={toggleDarkMode}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
        >
          {darkMode ? "Mode Clair" : "Mode Sombre"}
        </button>
      </header>

      <div className={`${cardClasses} rounded-xl p-6`}>
        <h2 className="text-xl font-semibold mb-4">Historique des Actions</h2>
        <p>Here you can display the history of admin actions (e.g., interventions, factures, etc.).</p>
        {/* Add your table or content here */}
      </div>
    </div>
  );
};
