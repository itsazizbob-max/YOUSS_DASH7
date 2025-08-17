import React from 'react';
import { FiX } from 'react-icons/fi';
import { InterventionData, FactureData, SuiviCarburantData } from './types';

interface HistoryModalProps {
    historyType: 'intervention' | 'facture' | 'suivi_carburant' | null;
    interventionsData: InterventionData[];
    facturesData: FactureData[];
    suiviCarburantData: SuiviCarburantData[];
    isLoading: boolean;
    darkMode: boolean;
    onClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ historyType, interventionsData, facturesData, suiviCarburantData, isLoading, darkMode, onClose }) => {
    const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${cardBg} rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">
                        Historique - {historyType === 'intervention' ? 'Interventions' : historyType === 'facture' ? 'Factures' : 'Suivi Carburant'}
                    </h2>
                    <button onClick={onClose} className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                        <FiX size={24} />
                    </button>
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : (
                    <div>
                        {(historyType === 'intervention' && interventionsData.length === 0) ||
                        (historyType === 'facture' && facturesData.length === 0) ||
                        (historyType === 'suivi_carburant' && suiviCarburantData.length === 0) ? (
                            <p className="text-center">Aucune donnée disponible</p>
                        ) : (
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'} text-left`}>
                                        {historyType === 'intervention' && (
                                            <>
                                                <th className="p-2 border-b">Réf. Dossier</th>
                                                <th className="p-2 border-b">Assuré</th>
                                                <th className="p-2 border-b">Date</th>
                                                <th className="p-2 border-b">Événement</th>
                                            </>
                                        )}
                                        {historyType === 'suivi_carburant' && (
                                            <>
                                                <th className="p-2 border-b">Véhicule</th>
                                                <th className="p-2 border-b">Date</th>
                                                <th className="p-2 border-b">Prix</th>
                                            </>
                                        )}
                                        {historyType === 'facture' && (
                                            <>
                                                <th className="p-2 border-b">Numéro</th>
                                                <th className="p-2 border-b">Date</th>
                                                <th className="p-2 border-b">Société</th>
                                                <th className="p-2 border-b">Montant TTC</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {historyType === 'intervention' && interventionsData.map((item) => (
                                        <tr key={item.id} className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                                            <td className="p-2">{item.ref_dossier}</td>
                                            <td className="p-2">{item.assure}</td>
                                            <td className="p-2">{item.date_intervention}</td>
                                            <td className="p-2">{item.evenement}</td>
                                        </tr>
                                    ))}
                                    {historyType === 'suivi_carburant' && suiviCarburantData.map((item) => (
                                        <tr key={item.id} className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                                            <td className="p-2">{item.vehicule}</td>
                                            <td className="p-2">{item.date}</td>
                                            <td className="p-2">{item.prix}</td>
                                        </tr>
                                    ))}
                                    {historyType === 'facture' && facturesData.map((item) => (
                                        <tr key={item.id} className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                                            <td className="p-2">{item.facture_num}</td>
                                            <td className="p-2">{item.date}</td>
                                            <td className="p-2">{item.societe_assistance}</td>
                                            <td className="p-2">{item.montant_ttc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryModal;