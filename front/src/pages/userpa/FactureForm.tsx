import React, { ChangeEvent } from 'react';
import { FiCalendar, FiMapPin, FiDollarSign } from 'react-icons/fi';
import { FactureFormData } from './types';

interface FactureFormProps {
    formData: FactureFormData;
    setFormData: React.Dispatch<React.SetStateAction<FactureFormData>>;
    lieuChoices: string[];
    darkMode: boolean;
}

const FactureForm: React.FC<FactureFormProps> = ({ formData, setFormData, lieuChoices, darkMode }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;
        if (name === 'montant_ht') {
            const htValue = parseFloat(value) || 0;
            const tvaValue = htValue * 0.20;
            const ttcValue = htValue + tvaValue;
            setFormData((prev) => ({
                ...prev,
                montant_ht: value,
                tva: tvaValue.toFixed(2),
                montant_ttc: ttcValue.toFixed(2),
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const inputBg = darkMode ? 'bg-gray-700' : 'bg-gray-50';
    const inputText = darkMode ? 'text-white' : 'text-gray-900';
    const inputBorder = darkMode ? 'border-gray-600' : 'border-gray-300';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="facture_num" className="block text-sm font-medium mb-2">Numéro de Facture</label>
                <input
                    type="text" id="facture_num" name="facture_num"
                    value={formData.facture_num} onChange={handleChange} required
                    className={`${inputBg} ${inputText} ${inputBorder} block w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Entrez le numéro de facture"
                />
            </div>

            <div>
                <label htmlFor="date" className="block text-sm font-medium mb-2">Date</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiCalendar className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <input
                        type="date" id="date" name="date"
                        value={formData.date} onChange={handleChange} required
                        className={`${inputBg} ${inputText} ${inputBorder} block w-full pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="societe_assistance" className="block text-sm font-medium mb-2">Société d'Assistance</label>
                <select
                    id="societe_assistance" name="societe_assistance"
                    value={formData.societe_assistance} onChange={handleChange} required
                    className={`${inputBg} ${inputText} ${inputBorder} block w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                >
                    <option value="MAI">MAI</option>
                    <option value="IMA">IMA</option>
                    <option value="RMA">RMA</option>
                </select>
            </div>

            <div>
                <label htmlFor="billing_company" className="block text-sm font-medium mb-2">Société de Facturation</label>
                <input
                    type="text" id="billing_company" name="billing_company"
                    value={formData.billing_company} onChange={handleChange} required
                    className={`${inputBg} ${inputText} ${inputBorder} block w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Entrez la société de facturation"
                />
            </div>

            <div>
                <label htmlFor="ice" className="block text-sm font-medium mb-2">ICE</label>
                <input
                    type="text" id="ice" name="ice"
                    value={formData.ice} onChange={handleChange} required
                    className={`${inputBg} ${inputText} ${inputBorder} block w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Entrez l'ICE"
                />
            </div>

            <div>
                <label htmlFor="adresse" className="block text-sm font-medium mb-2">Adresse</label>
                <input
                    type="text" id="adresse" name="adresse"
                    value={formData.adresse} onChange={handleChange} required
                    className={`${inputBg} ${inputText} ${inputBorder} block w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Entrez l'adresse"
                />
            </div>

            <div>
                <label htmlFor="reference" className="block text-sm font-medium mb-2">Référence</label>
                <input
                    type="text" id="reference" name="reference"
                    value={formData.reference} onChange={handleChange} required
                    className={`${inputBg} ${inputText} ${inputBorder} block w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Entrez la référence"
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
                <label htmlFor="perimetre" className="block text-sm font-medium mb-2">Périmètre</label>
                <input
                    type="text" id="perimetre" name="perimetre"
                    value={formData.perimetre} onChange={handleChange} required
                    className={`${inputBg} ${inputText} ${inputBorder} block w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Entrez le périmètre"
                />
            </div>

            <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
                <textarea
                    id="description" name="description"
                    value={formData.description} onChange={handleChange} required rows={3}
                    className={`${inputBg} ${inputText} ${inputBorder} block w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                    placeholder="Entrez la description"
                ></textarea>
            </div>

            <div>
                <label htmlFor="montant_ht" className="block text-sm font-medium mb-2">Montant HT</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <input
                        type="number" id="montant_ht" name="montant_ht"
                        value={formData.montant_ht} onChange={handleChange} required step="0.01"
                        className={`${inputBg} ${inputText} ${inputBorder} block w-full pl-10 pr-3 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="Entrez le montant HT"
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
                        value={formData.tva}
                        className={`${inputBg} ${inputText} ${inputBorder} block w-full pl-10 pr-3 py-2 rounded-lg cursor-not-allowed`}
                        placeholder="Calculé automatiquement"
                        readOnly
                    />
                </div>
            </div>

            <div>
                <label htmlFor="montant_ttc" className="block text-sm font-medium mb-2">Montant TTC</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiDollarSign className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </div>
                    <input
                        type="number" id="montant_ttc" name="montant_ttc"
                        value={formData.montant_ttc}
                        className={`${inputBg} ${inputText} ${inputBorder} block w-full pl-10 pr-3 py-2 rounded-lg cursor-not-allowed`}
                        placeholder="Calculé automatiquement"
                        readOnly
                    />
                </div>
            </div>
        </div>
    );
};

export default FactureForm;