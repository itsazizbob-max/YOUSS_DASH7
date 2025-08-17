import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Make sure this is imported for autoTable to work
import { FiFileText } from 'react-icons/fi'; // Assuming react-icons is installed

// Define the structure of an 'Item' for type safety
interface Item {
    id: number;
    user?: {
        username: string;
    };
    ref_dossier?: string;
    assure?: string;
    date_intervention?: string;
    evenement?: string;
    vehicule?: string;
    date?: string; // Used in both suivi_carburant and facture
    prix?: number;
    facture_num?: string;
    billing_company?: string;
    montant_ttc?: number;
}

// Define the props for the OperationForm component
interface OperationFormProps {
    // 'type' is optional, but defaults to 'declaration' if not provided
    type?: 'declaration' | 'suivi_carburant' | 'facture';
    // 'data' is optional, but defaults to an empty array if not provided
    data?: Item[];
    darkMode: boolean; // Controls dark mode styling
    onClose: () => void; // Function to close the form/modal
}

const OperationForm: React.FC<OperationFormProps> = ({
    type = 'declaration', // Default 'type' to 'declaration' to prevent 'replace' error
    data = [],           // Default 'data' to an empty array to prevent 'filter' error
    darkMode,
    onClose
}) => {
    // facturesData is used for the PDF export, filtered based on the current type
    // Since 'data' now defaults to [], .filter() will always work
    const facturesData = data.filter(item => type === 'facture');

    return (
        // Main modal overlay, fixed to cover the screen
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* Modal content container */}
            <div className={`modal-content ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-6 rounded-lg shadow-xl w-3/4 max-w-4xl max-h-[80vh] flex flex-col`}>
                {/* Title of the form, dynamically displays the operation type */}
                <h2 className="text-2xl font-bold mb-4 capitalize">
                    Historique des {type.replace('_', ' ')} {/* '.replace()' now safely called on 'type' */}
                </h2>

                {/* Table display area, made scrollable */}
                <div className="overflow-auto flex-grow mb-4">
                    {/* Conditional rendering if no data is available */}
                    {data.length === 0 ? (
                        <p className="text-center py-4 text-gray-500">Aucune donnée disponible pour ce type.</p>
                    ) : (
                        <table className="min-w-full table-auto border-collapse">
                            <thead>
                                <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} text-left`}>
                                    {/* Conditional table headers based on 'type' */}
                                    {type === 'declaration' && (
                                        <>
                                            <th className="p-2 border-b">Réf. Dossier</th>
                                            <th className="p-2 border-b">Assuré</th>
                                            <th className="p-2 border-b">Date d'intervention</th>
                                            <th className="p-2 border-b">Événement</th>
                                        </>
                                    )}
                                    {type === 'suivi_carburant' && (
                                        <>
                                            <th className="p-2 border-b">Véhicule</th>
                                            <th className="p-2 border-b">Date</th>
                                            <th className="p-2 border-b">Prix</th>
                                        </>
                                    )}
                                    {type === 'facture' && (
                                        <>
                                            <th className="p-2 border-b">Numéro Facture</th>
                                            <th className="p-2 border-b">Date</th>
                                            <th className="p-2 border-b">Société de Facturation</th>
                                            <th className="p-2 border-b">Montant TTC</th>
                                        </>
                                    )}
                                    {/* User column is always displayed */}
                                    <th className="p-2 border-b">Utilisateur</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Iterate over the 'data' array to render each row */}
                                {data.map((item, index) => (
                                    // Each row needs a unique 'key' prop for React list rendering
                                    <tr key={item.id || index} className="border-b">
                                        {/* Conditional table cells based on 'type' */}
                                        {type === 'declaration' && (
                                            <>
                                                <td className="p-2 border-b">{item.ref_dossier}</td>
                                                <td className="p-2 border-b">{item.assure}</td>
                                                <td className="p-2 border-b">{item.date_intervention}</td>
                                                <td className="p-2 border-b">{item.evenement}</td>
                                            </>
                                        )}
                                        {type === 'suivi_carburant' && (
                                            <>
                                                <td className="p-2 border-b">{item.vehicule}</td>
                                                <td className="p-2 border-b">{item.date}</td>
                                                <td className="p-2 border-b">{item.prix}</td>
                                            </>
                                        )}
                                        {type === 'facture' && (
                                            <>
                                                <td className="p-2 border-b">{item.facture_num}</td>
                                                <td className="p-2 border-b">{item.date}</td>
                                                <td className="p-2 border-b">{item.billing_company}</td>
                                                <td className="p-2 border-b">{item.montant_ttc}</td>
                                            </>
                                        )}
                                        {/* User cell is always displayed for all types */}
                                        <td className="p-2 border-b">{item.user?.username || 'N/A'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Action buttons at the bottom of the modal */}
                <div className="mt-4 flex justify-end space-x-3">
                    {/* PDF export button, only visible for 'facture' type */}
                    {type === 'facture' && (
                        <button
                            onClick={() => {
                                const doc = new jsPDF();
                                doc.setFontSize(16);
                                doc.text('Registre des Factures', 14, 20);
                                const columns = ['ID', 'Numéro Facture', 'Date', 'Société', 'Montant TTC', 'Utilisateur'];
                                const rows = facturesData.map((facture) => [
                                    facture.id.toString(),
                                    facture.facture_num || 'N/A',
                                    facture.date || 'N/A',
                                    facture.billing_company || 'N/A',
                                    facture.montant_ttc?.toString() || '0',
                                    facture.user?.username || 'N/A',
                                ]);
                                (doc as any).autoTable({ // Type assertion needed for autoTable
                                    head: [columns],
                                    body: rows,
                                    startY: 30,
                                    styles: { fontSize: 8, cellPadding: 2 },
                                    headStyles: { fillColor: [220, 38, 38], textColor: [255, 255, 255] },
                                });
                                doc.save('factures_history.pdf');
                            }}
                            className={`flex items-center py-2 px-4 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-colors`}
                        >
                            <FiFileText className="mr-2" />
                            Exporter en PDF
                        </button>
                    )}
                    {/* Close button for the modal */}
                    <button
                        onClick={onClose}
                        className={`py-2 px-4 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OperationForm;