import React, { ChangeEvent } from 'react';
import { FiCalendar, FiMapPin, FiDollarSign } from 'react-icons/fi';
import { InterventionFormData } from './types';

const INTERVENTION_EVENT_CHOICES = [
    'Remorquage Interurbain', 'Panne Mécanique', 'Accident', 'Assistance', 'AUTRE'
];

interface InterventionFormProps {
    formData: InterventionFormData;
    setFormData: React.Dispatch<React.SetStateAction<InterventionFormData>>;
    lieuChoices: string[];
    darkMode: boolean;
}

const InterventionForm: React.FC<InterventionFormProps> = ({ formData, setFormData, lieuChoices, darkMode }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const inputBg = darkMode ? 'bg-gray-700' : 'bg-gray-50';
    const inputText = darkMode ? 'text-white' : 'text-gray-900';
    const inputBorder = darkMode ? 'border-gray-600' : 'border-gray-300';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="societe_assistance" className="block text-sm font-medium mb-2">Société d'Assistance</label>
                <select
                    id="societe_assistance" name="societe_assistance"
                    value={formData.societe_assistance} onChange={handleChange} required
                    className={`${inputBg} ${inputText} ${inputBorder} block w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                >
                    <option value="WAFA IMA ASSISTANCE">WAFA IMA ASSISTANCE</option>
                    <option value="RMA ASSISTANCE">RMA ASSISTANCE</option>
                    <option value="SAHAM ASSISTANCE">SAHAM ASSISTANCE</option>
                    <option value="AUTRE">AUTRE</option>
                </select>
            </div>

            <div>
                <label htmlFor="ref_dossier" className="block text-sm font-medium mb-2">Référence Dossier</label>
                <input
                    type="text" id="ref_dossier" name="ref_dossier"
                    value={formData.ref_dossier} onChange={handleChange} required
                    className={`${inputBg} ${inputText} ${inputBorder} block w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Entrez la référence du dossier"
                />
            </div>

            <div>
                <label htmlFor="assure" className="block text-sm font-medium mb-2">Assuré</label>
                <input
                    type="text" id="assure" name="assure"
                    value={formData.assure} onChange={handleChange} required
                    className={`${inputBg} ${inputText} ${inputBorder} block w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Entrez le nom de l'assuré"
                />
            </div>

            <div>
                <label htmlFor="date_intervention" className="block text-sm font-medium mb-2">Date d'Intervention</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <input
                        type="date" id="date_intervention" name="date_intervention"
                        value={formData.date_intervention} onChange={handleChange} required
                        className={`${inputBg} ${inputText} ${inputBorder} block w-full pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="evenement" className="block text-sm font-medium mb-2">Événement</label>
                <select
                    id="evenement" name="evenement"
                    value={formData.evenement} onChange={handleChange} required
                    className={`${inputBg} ${inputText} ${inputBorder} block w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                >
                    {INTERVENTION_EVENT_CHOICES.map(choice => (
                        <option key={choice} value={choice}>{choice}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="immatriculation" className="block text-sm font-medium mb-2">Immatriculation</label>
                <input
                    type="text" id="immatriculation" name="immatriculation"
                    value={formData.immatriculation} onChange={handleChange} required
                    className={`${inputBg} ${inputText} ${inputBorder} block w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Entrez l'immatriculation"
                />
            </div>

            <div>
                <label htmlFor="marque" className="block text-sm font-medium mb-2">Marque</label>
                <input
                    type="text" id="marque" name="marque"
                    value={formData.marque} onChange={handleChange} required
                    className={`${inputBg} ${inputText} ${inputBorder} block w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Entrez la marque"
                />
            </div>

            <div>
                <label htmlFor="point_attach" className="block text-sm font-medium mb-2">Point d'Attache</label>
                <input
                    type="text" id="point_attach" name="point_attach"
                    value={formData.point_attach} onChange={handleChange} required
                    className={`${inputBg} ${inputText} ${inputBorder} block w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Entrez le point d'attache"
                />
            </div>

            <div>
                <label htmlFor="lieu_intervention" className="block text-sm font-medium mb-2">Lieu d'Intervention</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMapPin className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <select
                        id="lieu_intervention" name="lieu_intervention"
                        value={formData.lieu_intervention} onChange={handleChange} required
                        className={`${inputBg} ${inputText} ${inputBorder} block w-full pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    >
                        {lieuChoices.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                        <option value="Autre Ville">Autre Ville</option>
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="destination" className="block text-sm font-medium mb-2">Destination</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiMapPin className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <input
                        type="text" id="destination" name="destination"
                        value={formData.destination} onChange={handleChange} required
                        className={`${inputBg} ${inputText} ${inputBorder} block w-full pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="Entrez la destination"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="cout_prestation_ttc" className="block text-sm font-medium mb-2">Coût Prestation TTC</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <input
                        type="number" id="cout_prestation_ttc" name="cout_prestation_ttc"
                        value={formData.cout_prestation_ttc} onChange={handleChange} required step="0.01"
                        className={`${inputBg} ${inputText} ${inputBorder} block w-full pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="Entrez le coût TTC"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="tva" className="block text-sm font-medium mb-2">TVA</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <input
                        type="number" id="tva" name="tva"
                        value={formData.tva} onChange={handleChange} required step="0.01"
                        className={`${inputBg} ${inputText} ${inputBorder} block w-full pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="Entrez la TVA"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="status" className="block text-sm font-medium mb-2">Statut</label>
                <select
                    id="status" name="status"
                    value={formData.status} onChange={handleChange} required
                    className={`${inputBg} ${inputText} ${inputBorder} block w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                >
                    <option value="impayé">Impayé</option>
                    <option value="payé">Payé</option>
                    <option value="en attente">En Attente</option>
                </select>
            </div>
        </div>
    );
};

export default InterventionForm;