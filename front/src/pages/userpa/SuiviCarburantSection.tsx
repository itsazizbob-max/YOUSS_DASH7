import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SuiviCarburantData } from './OperationForm'; // Adjust path if needed

interface SuiviCarburantSectionProps {
  suiviData: SuiviCarburantData[];
  suiviCount: number;
  lastEditDate: string | null;
  onDeleteSuiviCarburant: (id: number) => void;
}

const SuiviCarburantSection: React.FC<SuiviCarburantSectionProps> = ({
  suiviData,
  suiviCount,
  lastEditDate,
  onDeleteSuiviCarburant,
}) => {
  const [showTotal, setShowTotal] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const adminStatus = localStorage.getItem('is_admin') === 'true';
    setIsAdmin(adminStatus);
  }, []);

  return (
    <div>
      <h2>Registre Suivi Carburant</h2>
      <p>Total Suivi Carburant: {suiviCount}</p>
      <p>Last Edit: {lastEditDate || 'N/A'}</p>
      <button onClick={() => setShowTotal(!showTotal)}>
        {showTotal ? 'Hide Total' : 'Show Total'}
      </button>
      {showTotal && (
        <div className="total-section">
          <h3>Total Suivi Carburant</h3>
          <p>Total: {suiviCount}</p>
        </div>
      )}
      {suiviData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Véhicule</th>
              <th>Prix</th>
              <th>Service</th>
              <th>Pompiste</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suiviData.map((suivi) => (
              <tr key={suivi.id}>
                <td>{suivi.id}</td>
                <td>{suivi.date}</td>
                <td>{suivi.vehicule}</td>
                <td>{suivi.prix}</td>
                <td>{suivi.service}</td>
                <td>{suivi.pompiste || 'N/A'}</td>
                <td>
                  <button onClick={() => onDeleteSuiviCarburant(suivi.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No suivi carburant records found.</p>
      )}
      {isAdmin && (
        <div className="mt-4">
          <button
            onClick={() => navigate('/suivi-carburant-data')}
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            View Suivi Carburant Data
          </button>
        </div>
      )}
    </div>
  );
};

export default SuiviCarburantSection;