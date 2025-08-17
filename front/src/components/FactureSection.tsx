import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FactureData } from '../pages/userpa/OperationForm'; // Adjust path if needed

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
    <div className="mt-8 w-full max-w-4xl">
      <h2 className="text-2xl font-bold mb-4">Registre des Factures</h2>
      <p className="text-lg mb-2">Total Factures: {facturesCount}</p>
      <p className="text-lg mb-4">Last Edit: {lastEditDate || 'N/A'}</p>
      <button
        onClick={() => setShowTotal(!showTotal)}
        className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 mb-4"
      >
        {showTotal ? 'Hide Total' : 'Show Total'}
      </button>
      {showTotal && (
        <div className="total-section bg-gray-100 p-4 rounded-lg mb-4">
          <h3 className="text-xl font-semibold">Total Factures</h3>
          <p>Total: {facturesCount}</p>
        </div>
      )}
      {facturesData.length > 0 ? (
        <table className="w-full bg-white rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Numéro Facture</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Société</th>
              <th className="py-2 px-4 border-b">Référence</th>
              <th className="py-2 px-4 border-b">Lieu</th>
              <th className="py-2 px-4 border-b">Destination</th>
              <th className="py-2 px-4 border-b">Montant TTC</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {facturesData.map((facture) => (
              <tr key={facture.id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{facture.id}</td>
                <td className="py-2 px-4 border-b">{facture.facture_num}</td>
                <td className="py-2 px-4 border-b">{facture.date}</td>
                <td className="py-2 px-4 border-b">{facture.billing_company}</td>
                <td className="py-2 px-4 border-b">{facture.reference}</td>
                <td className="py-2 px-4 border-b">{facture.lieu_intervention}</td>
                <td className="py-2 px-4 border-b">{facture.destination}</td>
                <td className="py-2 px-4 border-b">{facture.montant_ttc}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => onDeleteFacture(facture.id)}
                    className="bg-red-500 text-white font-semibold py-1 px-2 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-lg">No factures found.</p>
      )}
      <div className="mt-4 flex space-x-4">
        <button
          onClick={onExportToPDF}
          className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-300"
        >
          Export to PDF
        </button>
        {/* Zyd l-button hna */}
        <button
          onClick={() => navigate('/facture-records')}
          className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-all duration-300"
        >
          View All Facture Records
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