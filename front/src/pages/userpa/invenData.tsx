import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InterventionData } from '../pages/userpa/OperationForm'; // Adjust path if needed

interface InventionProps {
  interventionsData: InterventionData[];
  interventionsCount: number;
  lastEditDate: string | null;
  onDeleteIntervention: (id: number) => void;
}

const Invention: React.FC<InventionProps> = ({
  interventionsData,
  interventionsCount,
  lastEditDate,
  onDeleteIntervention,
}) => {
  const [showTotal, setShowTotal] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const adminStatus = localStorage.getItem('is_admin') === 'true';
    setIsAdmin(adminStatus);
  }, []);

  return (
    <div className="mt-8 w-full max-w-4xl">
      <h2 className="text-2xl font-bold mb-4">Registre des Interventions</h2>
      <p className="text-lg mb-2">Total Interventions: {interventionsCount}</p>
      <p className="text-lg mb-4">Last Edit: {lastEditDate || 'N/A'}</p>
      <button
        onClick={() => setShowTotal(!showTotal)}
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 mb-4"
      >
        {showTotal ? 'Hide Total' : 'Show Total'}
      </button>
      {showTotal && (
        <div className="total-section bg-gray-100 p-4 rounded-lg mb-4">
          <h3 className="text-xl font-semibold">Total Interventions</h3>
          <p>Total: {interventionsCount}</p>
        </div>
      )}
      {/* S7ab l-table w khli ghi l-button w l-badge */}
      <div className="mt-4 flex items-center space-x-2">
        <button
          onClick={() => navigate('/intervention-records')}
          className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-all duration-300"
        >
          View All Intervention Records
        </button>
        <span className="bg-blue-600 text-white font-semibold py-1 px-3 rounded-full">
          {interventionsCount}
        </span>
      </div>
      {isAdmin && (
        <div className="mt-4">
          <button
            onClick={() => navigate('/invent-data')}
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            View Intervention Data
          </button>
        </div>
      )}
    </div>
  );
};

export default Invention;