import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTable } from 'react-icons/fa';

interface SuiviCarburantSectionProps {
  suiviCount: number;
  lastEditDate: string | null;
}

const SuiviCarburantSection: React.FC<SuiviCarburantSectionProps> = ({ suiviCount, lastEditDate }) => {
  const navigate = useNavigate();

  return (
    <div className="mt-6 text-center">
      <button
        onClick={() => navigate('/suivi-data')}
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center mx-auto"
      >
        <FaTable className="mr-2 text-lg" />
        View Suivi Carburant Data
        <span className="ml-2 bg-blue-700 text-white rounded-full px-2 py-1 text-sm">
          {suiviCount}
        </span>
      </button>
      {lastEditDate ? (
        <p className="text-white text-sm mt-2">
          Last Edit: {new Date(lastEditDate).toLocaleDateString()}
        </p>
      ) : (
        <p className="text-white text-sm mt-2">No suivi carburant yet.</p>
      )}
    </div>
  );
};

export default SuiviCarburantSection;