import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FactureData } from './OperationForm'; // Adjust path if needed

interface FactureSectionProps {
  facturesData: FactureData[];
  facturesCount: number;
  lastEditDate: string | null;
  onExportToPDF: () => void;
  onDeleteFacture: (id: number) => void;
}

const FactureSection: React.FC<FactureSectionProps> = ({
  facturesData,
  facturesCount,
  lastEditDate,
  onExportToPDF,
  onDeleteFacture,
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
      <h2>Registre des Factures</h2>
      <p>Total Factures: {facturesCount}</p>
      <p>Last Edit: {lastEditDate || 'N/A'}</p>
      <button onClick={() => setShowTotal(!showTotal)}>
        {showTotal ? 'Hide Total' : 'Show Total'}
      </button>
      {showTotal && (
        <div className="total-section">
          <h3>Total Factures</h3>
          <p>Total: {facturesCount}</p>
        </div>
      )}
      {facturesData.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Numéro Facture</th>
              <th>Date</th>
              <th>Société</th>
              <th>Référence</th>
              <th>Lieu</th>
              <th>Destination</th>
              <th>Montant TTC</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {facturesData.map((facture) => (
              <tr key={facture.id}>
                <td>{facture.id}</td>
                <td>{facture.facture_num}</td>
                <td>{facture.date}</td>
                <td>{facture.billing_company}</td>
                <td>{facture.reference}</td>
                <td>{facture.lieu_intervention}</td>
                <td>{facture.destination}</td>
                <td>{facture.montant_ttc}</td>
                <td>
                  <button onClick={() => onDeleteFacture(facture.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No factures found.</p>
      )}
      <div className="mt-4">
        <button
          onClick={onExportToPDF}
          className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-300"
        >
          Export to PDF
        </button>
      </div>
      {isAdmin && (
        <div className="mt-4">
          <button
            onClick={() => navigate('/facture-data')}
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            View Facture Data
          </button>
        </div>
      )}
    </div>
  );
};

export default FactureSection;