import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface FuelData { /* ...as before... */ }
interface InterventionData { /* ...as before... */ }
interface FactureData { /* ...as before... */ }

const DataTable: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type');

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ...your fetch logic as before...
  }, [type, navigate]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, type || 'Data');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${type}_data_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (loading) {
    return <div className="text-center text-gray-700 py-24 text-lg">Loading...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500 py-24 text-lg">{error}</div>;
  }

  // Define columns for each type for easier mapping
  const columns = {
    suivi_carburant: [
      { key: "id", label: "ID" },
      { key: "user", label: "User" },
      { key: "date", label: "Date" },
      { key: "vehicule", label: "Véhicule" },
      { key: "service", label: "Service" },
      { key: "pompiste", label: "Pompiste" },
      { key: "prix", label: "Prix (MAD)" }
    ],
    intervention: [
      { key: "id", label: "ID" },
      { key: "user", label: "User" },
      { key: "ref_dossier", label: "Réf. Dossier" },
      { key: "assure", label: "Assuré" },
      { key: "date_intervention", label: "Date" },
      { key: "evenement", label: "Événement" },
      { key: "immatriculation", label: "Immatriculation" },
      { key: "marque", label: "Marque" },
      { key: "lieu_intervention", label: "Lieu" },
      { key: "destination", label: "Destination" },
      { key: "cout_prestation_ttc", label: "Coût TTC (MAD)" },
      { key: "tva", label: "TVA (MAD)" }
    ],
    facture: [
      { key: "id", label: "ID" },
      { key: "user", label: "User" },
      { key: "facture_num", label: "Numéro Facture" },
      { key: "date", label: "Date" },
      { key: "billing_company", label: "Société" },
      { key: "ice", label: "ICE" },
      { key: "adresse", label: "Adresse" },
      { key: "reference", label: "Référence" },
      { key: "lieu_intervention", label: "Lieu" },
      { key: "destination", label: "Destination" },
      { key: "perimetre", label: "Périmètre" },
      { key: "description", label: "Description" },
      { key: "montant_ht", label: "Montant HT (MAD)" },
      { key: "tva", label: "TVA (MAD)" },
      { key: "montant_ttc", label: "Montant TTC (MAD)" }
    ]
  };

  const currentColumns = columns[type as keyof typeof columns] || [];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-50 flex flex-col items-center py-10 px-2">
      <div className="w-full max-w-7xl mx-auto">
        {/* Title & Export Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900 text-center sm:text-left">
            {type === 'suivi_carburant'
              ? 'Suivi Carburant'
              : type === 'intervention'
              ? 'Intervention'
              : type === 'facture'
              ? 'Facture'
              : 'Données'}
          </h1>
          <button
            onClick={exportToExcel}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg shadow transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M16 17l-4 4m0 0l-4-4m4 4V3" />
            </svg>
            Export Excel
          </button>
        </div>
        {/* Responsive Table */}
        <div className="bg-white shadow-2xl rounded-xl overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {currentColumns.map(col => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {data.length === 0 ? (
                <tr>
                  <td colSpan={currentColumns.length} className="text-center py-8 text-gray-400">
                    Aucune donnée trouvée.
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <tr
                    key={item.id || idx}
                    className="hover:bg-green-50 transition-colors duration-150"
                  >
                    {currentColumns.map(col => (
                      <td
                        key={col.key}
                        className="px-4 py-3 whitespace-nowrap text-sm text-gray-800"
                      >
                        {item[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
