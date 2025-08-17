import React, { useCallback, useState, useEffect, useRef, useMemo, useReducer } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Save, Edit3, AlertCircle, CheckCircle, Calendar, Building, FileText, User, Car, MapPin, Target, Activity, DollarSign, Percent, Calculator, Moon, Sun, History, File, Clipboard, Truck, Users } from 'lucide-react';
import axios from 'axios';
import debounce from 'lodash/debounce';

const API_BASE_URL = 'http://127.0.0.1:8000';

// Interface definitions (unchanged)
interface SocieteAssistance {
  id: number;
  nom: string;
  ice?: string;
  adresse?: string;
}

interface FormState {
  general: {
    date_intervention: string;
    societe_assistance: number | '';
    ref_dossier: string;
  };
  client: {
    assure: string;
    immatriculation: string;
    marque: string;
  };
  location: {
    point_attach: string;
    lieu_intervention: string;
    destination: string;
    status: string;
    evenement: string | undefined;
    group_id?: string | null;
  };
  financial: {
    montant_ht: string;
    tva: string;
    cout_prestation_ttc: string;
  };
  suiviCarburant: {
    date: string;
    vehicule: string;
    service: string;
    pompiste: string;
    prix: string;
    smitoStation: string;
  };
}

interface FactureData { id: number; facture_num: string; date: string; billing_company?: string; user?: { username: string } | null; montant_ttc: number; billing_company_name_display?: string }
interface InterventionData { id: number; ref_dossier: string; assure: string; date_intervention: string; evenement: string; status: string; cout_prestation_ttc: number; }
interface SuiviCarData { id: number; vehicule: string; date: string; prix: number; service: string; pompiste?: string; smitoStation?: string; }

type FormAction =
  | { type: 'UPDATE_GENERAL'; payload: Partial<FormState['general']> }
  | { type: 'UPDATE_CLIENT'; payload: Partial<FormState['client']> }
  | { type: 'UPDATE_LOCATION'; payload: Partial<FormState['location']> }
  | { type: 'UPDATE_FINANCIAL'; payload: Partial<FormState['financial']> }
  | { type: 'UPDATE_SUIVI_CARBURANT'; payload: Partial<FormState['suiviCarburant']> }
  | { type: 'RESET_FORM' };

const initialState: FormState = {
  general: {
    date_intervention: new Date().toISOString().split('T')[0],
    societe_assistance: '',
    ref_dossier: '',
  },
  client: {
    assure: '',
    immatriculation: '',
    marque: '',
  },
  location: {
    point_attach: 'TAMANAR',
    lieu_intervention: '',
    destination: '',
    status: 'En cours',
    evenement: 'Remorquage Interurbain',
    group_id: null,
  },
  financial: {
    montant_ht: '',
    tva: '20',
    cout_prestation_ttc: '0.00',
  },
  suiviCarburant: {
    date: new Date().toISOString().split('T')[0],
    vehicule: '',
    service: 'Carburant',
    pompiste: '',
    prix: '',
    smitoStation: '',
  },
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'UPDATE_GENERAL':
      return { ...state, general: { ...state.general, ...action.payload } };
    case 'UPDATE_CLIENT':
      return { ...state, client: { ...state.client, ...action.payload } };
    case 'UPDATE_LOCATION':
      return { ...state, location: { ...state.location, ...action.payload } };
    case 'UPDATE_FINANCIAL':
      return { ...state, financial: { ...state.financial, ...action.payload } };
    case 'UPDATE_SUIVI_CARBURANT':
      return { ...state, suiviCarburant: { ...state.suiviCarburant, ...action.payload } };
    case 'RESET_FORM':
      return initialState;
    default:
      const _exhaustiveCheck: never = action;
      return state;
  }
};

// NEW: Define useApi hook
const useApi = () => {
  const [data, setData] = useState<{
    factures: FactureData[];
    interventions: InterventionData[];
    suiviCarburant: SuiviCarData[];
  }>({
    factures: [],
    interventions: [],
    suiviCarburant: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const [facturesRes, interventionsRes, suiviCarRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/get_factures/`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/get_interventions/`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
        axios.get(`${API_BASE_URL}/api/get_suivi_carburant/`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] })),
      ]);

      setData({
        factures: facturesRes.data,
        interventions: interventionsRes.data,
        suiviCarburant: suiviCarRes.data,
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Erreur lors du chargement des données';
      setError(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
};

const DataTable: React.FC<{ columns: string[]; data: any[]; isDarkMode: boolean }> = React.memo(
  ({ columns, data, isDarkMode }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[600px]">
        <thead>
          <tr className={`border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            {columns.map((col) => (
              <th
                key={col}
                className={`py-3 px-4 font-medium text-xs uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length ? (
            data.map((row, index) => (
              <tr
                key={String(row.id) || index}
                className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-50 hover:bg-gray-50'}`}
              >
                {columns.map((col) => (
                  <td
                    key={`${col}-${String(row.id) || index}`}
                    className={`py-3 px-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}
                  >
                    {row[col] || 'N/A'}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className={`text-center py-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
              >
                Aucune donnée disponible
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
);

const FormField: React.FC<{
  label: string;
  name: string;
  type?: string;
  icon?: React.ReactNode;
  options?: { value: string | number; label: string }[];
  readOnly?: boolean;
  step?: string;
  value: string | number;
  hasError?: boolean;
  errorMessage?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  isDarkMode: boolean;
  className?: string;
}> = React.memo(
  ({ label, name, type = 'text', icon, options, readOnly = false, step, value, hasError, errorMessage, onChange, isDarkMode, className }) => (
    <div className="space-y-2">
      <label className={`flex items-center gap-2 text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
        {icon} {label}
      </label>
      {options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-3 rounded-lg text-sm ${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500 ${hasError ? 'border-red-500' : ''} ${className || ''}`}
        >
          <option value="">Sélectionnez...</option>
          {options.map((option) => (
            <option
              key={String(option.value)}
              value={option.value}
              className={isDarkMode ? 'bg-gray-800' : 'bg-white'}
            >
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="relative">
          {type === 'textarea' ? (
            <textarea
              name={name}
              value={value}
              onChange={onChange}
              readOnly={readOnly}
              className={`w-full px-4 py-3 rounded-lg text-sm ${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500 ${readOnly ? 'cursor-not-allowed' : ''} ${hasError ? 'border-red-500' : ''} pr-10 min-h-[80px] ${className || ''}`}
              placeholder={`Entrez ${label.toLowerCase()}`}
            />
          ) : (
            <input
              type={type}
              name={name}
              value={value}
              onChange={onChange}
              readOnly={readOnly}
              step={step}
              className={`w-full px-4 py-3 rounded-lg text-sm ${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-blue-500 ${readOnly ? 'cursor-not-allowed' : ''} ${hasError ? 'border-red-500' : ''} pr-10 ${className || ''}`}
              placeholder={`Entrez ${label.toLowerCase()}`}
            />
          )}
          {icon && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</span>
          )}
        </div>
      )}
      {hasError && errorMessage && (
        <p className="text-red-500 text-xs flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {errorMessage}
        </p>
      )}
    </div>
  )
);

const OperationForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isUserHistory = useMemo(() => location.pathname === '/userhistory', [location.pathname]);
  const formType = useMemo(() => searchParams.get('type') || 'intervention', [searchParams]);
  const recordId = null;

  const [isDarkMode, setDarkMode] = useState(false);
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [activeTab, setActiveTab] = useState<'factures' | 'interventions' | 'suiviCarburant'>('interventions');

  const formStateRef = useRef(formState);
  const { data: historyData, loading: historyLoading, error: historyError, fetchData } = useApi();
  const [societesAssistance, setSocietesAssistance] = useState<SocieteAssistance[]>([]);

  useEffect(() => {
    formStateRef.current = formState;
  }, [formState]);

  useEffect(() => {
    const fetchSocietes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No token for fetching societies. User might not be logged in.");
          setError("Aucun token d'authentification trouvé. Veuillez vous connecter.");
          return;
        }
        const response = await axios.get<SocieteAssistance[]>(`${API_BASE_URL}/api/societes_assistance/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSocietesAssistance(response.data);

        if (response.data.length > 0 && (!formState.general.societe_assistance || formState.general.societe_assistance === '')) {
          const defaultSociety = response.data.find((s) => s.nom === 'RMA') || response.data[0];
          if (defaultSociety) {
            dispatch({ type: 'UPDATE_GENERAL', payload: { societe_assistance: defaultSociety.id } });
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.detail || err.message || 'Failed to load societies');
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    if (formType === 'intervention' && societesAssistance.length === 0) {
      fetchSocietes();
    }
  }, [societesAssistance.length, navigate, formState.general.societe_assistance, formType]);

  useEffect(() => {
    if (isUserHistory) fetchData();
  }, [isUserHistory, fetchData]);

  const statusOptions = useMemo(() => [
    { value: 'En cours', label: 'En cours' }, { value: 'Annulé', label: 'Annulé' }, { value: 'Complété', label: 'Complété' },
  ], []);

  const evenementOptions = useMemo(() => [
    { value: 'Remorquage Interurbain', label: 'Remorquage Interurbain' }, { value: 'Panne Mécanique', label: 'Panne Mécanique' }, { value: 'Accident', label: 'Accident' }, { value: 'Assistance', label: 'Assistance' },
  ], []);

  const societeOptions = useMemo(() => 
    societesAssistance.map(s => ({ value: s.id, label: s.nom })), 
    [societesAssistance]
  );

  const serviceOptions = useMemo(() => [
    { value: 'Carburant', label: 'Carburant' },
    { value: 'Vidange', label: 'Vidange' },
    { value: 'Réparation', label: 'Réparation' },
    { value: 'Autres', label: 'Autres' },
  ], []);

  const calculateMontantTTC = useCallback((ht: string, tvaRate: string): string => {
    const htValue = parseFloat(ht) || 0;
    const tvaValue = parseFloat(tvaRate) || 0;
    return htValue > 0 ? (htValue * (1 + tvaValue / 100)).toFixed(2) : '0.00';
  }, []);

  const validateForm = useCallback((state: FormState): { [key: string]: string } => {
    const errors: { [key: string]: string } = {};
    const { general, client, location, financial, suiviCarburant } = state;

    if (formType === 'intervention') {
      if (!general.date_intervention) errors.date_intervention = 'Date requise';
      if (!general.societe_assistance) errors.societe_assistance = 'Société requise';
      if (!general.ref_dossier) errors.ref_dossier = 'Référence requise';
      if (!client.assure) errors.assure = 'Assuré requis';
      if (!client.immatriculation) errors.immatriculation = 'Immatriculation requise';
      if (!client.marque) errors.marque = 'Marque requise';
      if (!location.point_attach) errors.point_attach = 'Point requis';
      if (!location.lieu_intervention) errors.lieu_intervention = 'Lieu requis';
      if (!location.destination) errors.destination = 'Destination requise';
      if (!location.status) errors.status = 'Statut requis';
      if (!location.evenement) errors.evenement = 'Événement requis';

      const selectedSociety = societesAssistance.find(s => s.id === general.societe_assistance);
      if (selectedSociety && selectedSociety.nom === 'IMA' && !location.group_id) {
        errors.group_id = 'Groupe est requis pour la société IMA';
      }

      const ht = parseFloat(financial.montant_ht);
      if (isNaN(ht)) {
        errors.montant_ht = 'Valeur numérique requise';
      } else if (ht <= 0) {
        errors.montant_ht = 'Coût HT positif requis';
      }

      const tva = parseFloat(financial.tva);
      if (isNaN(tva)) {
        errors.tva = 'Valeur numérique requise';
      } else if (tva < 0) {
        errors.tva = 'TVA non négative requise';
      }
    } else if (formType === 'suivi_carburant') {
      if (!suiviCarburant.date) errors.date = 'Date requise';
      if (!suiviCarburant.vehicule) errors.vehicule = 'Véhicule requis';
      if (!suiviCarburant.service) errors.service = 'Service requis';
      if (!suiviCarburant.smitoStation) errors.smitoStation = 'Station Smito requise';
      const prix = parseFloat(suiviCarburant.prix);
      if (isNaN(prix)) {
        errors.prix = 'Prix numérique requis';
      } else if (prix <= 0) {
        errors.prix = 'Prix positif requis';
      }
    }

    return errors;
  }, [formType, societesAssistance]);

  const debouncedSideEffects = useMemo(() =>
    debounce((currentValues: FormState) => {
      if (formType === 'intervention') {
        const newMontantTTC = calculateMontantTTC(
          currentValues.financial.montant_ht,
          currentValues.financial.tva
        );
        if (newMontantTTC !== currentValues.financial.cout_prestation_ttc) {
          dispatch({ type: 'UPDATE_FINANCIAL', payload: { cout_prestation_ttc: newMontantTTC } });
        }
      }
      setFormErrors(validateForm(currentValues));
    }, 500),
    [calculateMontantTTC, validateForm, formType]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      let actionType: FormAction['type'];
      let payload: Partial<any> = { [name]: value };

      if (['date_intervention', 'societe_assistance', 'ref_dossier'].includes(name)) {
        actionType = 'UPDATE_GENERAL';
        if (name === 'societe_assistance') {
          payload[name] = value === '' ? '' : parseInt(value, 10);
        }
      } else if (['assure', 'immatriculation', 'marque'].includes(name)) {
        actionType = 'UPDATE_CLIENT';
      } else if (['point_attach', 'lieu_intervention', 'destination', 'status', 'evenement', 'group_id'].includes(name)) {
        actionType = 'UPDATE_LOCATION';
        if (name === 'societe_assistance' && formType === 'intervention') {
          const selectedSociety = societesAssistance.find(s => s.id === (value === '' ? '' : parseInt(value, 10)));
          if (selectedSociety && selectedSociety.nom !== 'IMA') {
            dispatch({ type: 'UPDATE_LOCATION', payload: { group_id: null } });
          }
        }
      } else if (['montant_ht', 'tva', 'cout_prestation_ttc'].includes(name)) {
        actionType = 'UPDATE_FINANCIAL';
        if ((name === 'montant_ht' || name === 'tva') && value !== '' && !/^\d*\.?\d*$/.test(value)) return;
      } else if (['date', 'vehicule', 'service', 'pompiste', 'prix', 'smitoStation'].includes(name) && formType === 'suivi_carburant') {
        actionType = 'UPDATE_SUIVI_CARBURANT';
        if (name === 'prix' && value !== '' && !/^\d*\.?\d*$/.test(value)) return;
      } else {
        console.warn(`Unknown field: ${name}`);
        return;
      }

      dispatch({ type: actionType, payload });
      const currentFormStateSnapshot = formStateRef.current;
      const updatedSectionName = actionType.toLowerCase().split('_')[1] as keyof FormState;
      const updatedSection = { ...currentFormStateSnapshot[updatedSectionName], ...payload };
      const nextDebouncedState = { ...currentFormStateSnapshot, [updatedSectionName]: updatedSection };
      debouncedSideEffects(nextDebouncedState);
    },
    [debouncedSideEffects, societesAssistance, formType]
  );

  useEffect(() => {
    return () => debouncedSideEffects.cancel();
  }, [debouncedSideEffects]);

  const isValidForm = useMemo(() => {
    const currentValidationErrors = validateForm(formState);
    return Object.keys(currentValidationErrors).length === 0;
  }, [formState, validateForm]);

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    debouncedSideEffects.flush();

    const currentValues = formStateRef.current;
    const errors = validateForm(currentValues);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsLoading(false);
      console.log('Form validation errors:', errors);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Aucun token d\'authentification trouvé');
      }

      let payload: any;
      let apiUrl: string;
      let navigateTo: string | null = null;

      if (formType === 'intervention') {
        payload = {
          date_intervention: currentValues.general.date_intervention,
          societe_assistance_id: currentValues.general.societe_assistance === '' ? null : currentValues.general.societe_assistance,
          ref_dossier: currentValues.general.ref_dossier,
          assure: currentValues.client.assure,
          immatriculation: currentValues.client.immatriculation,
          marque: currentValues.client.marque,
          point_attach: currentValues.location.point_attach,
          lieu_intervention: currentValues.location.lieu_intervention,
          destination: currentValues.location.destination,
          status: currentValues.location.status,
          evenement: currentValues.location.evenement,
          group_id: societesAssistance.find(s => s.id === currentValues.general.societe_assistance)?.nom === 'IMA' ? (currentValues.location.group_id || null) : null,
          montant_ht: parseFloat(currentValues.financial.montant_ht || '0'),
          tva: parseFloat(currentValues.financial.tva || '0'),
          cout_prestation_ttc: parseFloat(currentValues.financial.cout_prestation_ttc || '0'),
        };
        apiUrl = `${API_BASE_URL}/api/intervention/`; // FIXED: Corrected from /add_intervention/ to /intervention/
        navigateTo = '/userhistory';
      } else if (formType === 'suivi_carburant') {
        payload = {
          date: currentValues.suiviCarburant.date,
          vehicule: currentValues.suiviCarburant.vehicule,
          service: currentValues.suiviCarburant.service,
          pompiste: currentValues.suiviCarburant.pompiste,
          prix: parseFloat(currentValues.suiviCarburant.prix || '0'),
          smitoStation: currentValues.suiviCarburant.smitoStation, // Corrected field name to match backend
        };
        apiUrl = `${API_BASE_URL}/api/suivi_carburant/`; // FIXED: Corrected from /add_suivi_carburant/ to /suivi_carburant/
        navigateTo = '/userhistory';
      } else {
        throw new Error('Type de formulaire inconnu.');
      }

      console.log('Submitting payload:', payload);

      const response = await axios.post(apiUrl, payload, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });

      console.log('API response:', response.data);

      setSuccessMessage(`${formType === 'intervention' ? 'Intervention' : 'Suivi Carburant'} enregistré(e) avec succès!`);
      dispatch({ type: 'RESET_FORM' });

      if (formType === 'intervention') {
        const interventionId = response.data.id;
        if (!interventionId) throw new Error('ID d’intervention non retourné par l’API');
        navigate(`/generate-facture/${interventionId}`);
      } else if (navigateTo) {
        navigate(navigateTo);
      }
    } catch (apiError: any) {
      console.error('Submission error:', apiError);
      let errorMessage = `Erreur lors de l’enregistrement de ${formType === 'intervention' ? 'l’intervention' : 'le suivi carburant'}`;
      if (axios.isAxiosError(apiError) && apiError.response && apiError.response.data) {
        const backendErrors = apiError.response.data;
        console.error("Backend validation errors (Axios 400):", backendErrors);
        if (typeof backendErrors === 'object' && !Array.isArray(backendErrors)) {
          errorMessage = Object.keys(backendErrors)
            .map(key => {
              const errorMsgs = Array.isArray(backendErrors[key]) ? backendErrors[key].join(', ') : backendErrors[key];
              return `${key}: ${errorMsgs}`;
            })
            .join('; ');
        } else if (typeof backendErrors === 'string') {
          errorMessage = backendErrors;
        } else if (Array.isArray(backendErrors)) {
          errorMessage = backendErrors.join('; ');
        }
      } else {
        errorMessage = apiError.message || errorMessage;
      }
      setError(`Erreur: ${errorMessage}`);
      if (apiError.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate, debouncedSideEffects, validateForm, societesAssistance, formType]);

  const toggleDarkMode = useCallback(() => setDarkMode((prev) => !prev), []);

  const handleHistoryClick = useCallback(() => {
    const userRole = localStorage.getItem('userRole');
    navigate(userRole === 'admin' ? '/adminhistory' : '/userhistory');
  }, [navigate]);

  const GeneralInfoSection = useMemo(
    () => (
      <div className="space-y-6">
        <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
          <FileText className="h-6 w-6 text-blue-500" /> Informations générales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            label="Date d'intervention"
            name="date_intervention"
            type="date"
            icon={<Calendar className="h-5 w-5 text-blue-500" />}
            value={formState.general.date_intervention}
            hasError={!!formErrors.date_intervention}
            errorMessage={formErrors.date_intervention}
            onChange={handleInputChange}
            isDarkMode={isDarkMode}
          />
          <FormField
            label="Société d'assistance"
            name="societe_assistance"
            icon={<Building className="h-5 w-5 text-blue-500" />}
            options={societeOptions}
            value={formState.general.societe_assistance}
            hasError={!!formErrors.societe_assistance}
            errorMessage={formErrors.societe_assistance}
            onChange={handleInputChange}
            isDarkMode={isDarkMode}
          />
          <FormField
            label="Référence"
            name="ref_dossier"
            icon={<FileText className="h-5 w-5 text-blue-500" />}
            value={formState.general.ref_dossier}
            hasError={!!formErrors.ref_dossier}
            errorMessage={formErrors.ref_dossier}
            onChange={handleInputChange}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    ),
    [
      formState.general.date_intervention,
      formState.general.societe_assistance,
      formState.general.ref_dossier,
      formErrors.date_intervention,
      formErrors.societe_assistance,
      formErrors.ref_dossier,
      handleInputChange,
      isDarkMode,
      societeOptions,
    ]
  );

  const ClientSection = useMemo(
    () => (
      <div className="space-y-6">
        <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
          <User className="h-6 w-6 text-green-500" /> Client et véhicule
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            label="Assuré"
            name="assure"
            icon={<User className="h-5 w-5 text-green-500" />}
            value={formState.client.assure}
            hasError={!!formErrors.assure}
            errorMessage={formErrors.assure}
            onChange={handleInputChange}
            isDarkMode={isDarkMode}
          />
          <FormField
            label="Immatriculation"
            name="immatriculation"
            icon={<Car className="h-5 w-5 text-green-500" />}
            value={formState.client.immatriculation}
            hasError={!!formErrors.immatriculation}
            errorMessage={formErrors.immatriculation}
            onChange={handleInputChange}
            isDarkMode={isDarkMode}
          />
          <FormField
            label="Marque"
            name="marque"
            icon={<Car className="h-5 w-5 text-green-500" />}
            value={formState.client.marque}
            hasError={!!formErrors.marque}
            errorMessage={formErrors.marque}
            onChange={handleInputChange}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    ),
    [
      formState.client.assure,
      formState.client.immatriculation,
      formState.client.marque,
      formErrors.assure,
      formErrors.immatriculation,
      formErrors.marque,
      handleInputChange,
      isDarkMode,
    ]
  );

  const LocationSection = useMemo(
    () => {
      const selectedSociety = societesAssistance.find(s => s.id === formState.general.societe_assistance);
      const isIMASociety = selectedSociety && selectedSociety.nom === 'IMA';
      return (
        <div className="space-y-6">
          <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
            <MapPin className="h-6 w-6 text-purple-500" /> Localisation et intervention
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              label="Point d'attache"
              name="point_attach"
              icon={<MapPin className="h-5 w-5 text-purple-500" />}
              value={formState.location.point_attach}
              hasError={!!formErrors.point_attach}
              errorMessage={formErrors.point_attach}
              onChange={handleInputChange}
              isDarkMode={isDarkMode}
            />
            <FormField
              label="Lieu d'intervention"
              name="lieu_intervention"
              icon={<MapPin className="h-5 w-5 text-purple-500" />}
              value={formState.location.lieu_intervention}
              hasError={!!formErrors.lieu_intervention}
              errorMessage={formErrors.lieu_intervention}
              onChange={handleInputChange}
              isDarkMode={isDarkMode}
            />
            <FormField
              label="Destination"
              name="destination"
              icon={<Target className="h-5 w-5 text-purple-500" />}
              value={formState.location.destination}
              hasError={!!formErrors.destination}
              errorMessage={formErrors.destination}
              onChange={handleInputChange}
              isDarkMode={isDarkMode}
            />
            <FormField
              label="Statut"
              name="status"
              icon={<Activity className="h-5 w-5 text-purple-500" />}
              options={statusOptions}
              value={formState.location.status}
              hasError={!!formErrors.status}
              errorMessage={formErrors.status}
              onChange={handleInputChange}
              isDarkMode={isDarkMode}
            />
            <FormField
              label="Événement"
              name="evenement"
              icon={<Activity className="h-5 w-5 text-purple-500" />}
              options={evenementOptions}
              value={formState.location.evenement || ''}
              hasError={!!formErrors.evenement}
              errorMessage={formErrors.evenement}
              onChange={handleInputChange}
              isDarkMode={isDarkMode}
            />
            {isIMASociety && (
              <FormField
                label="Groupe"
                name="group_id"
                type="text"
                icon={<Users className="h-5 w-5 text-purple-500" />}
                value={formState.location.group_id || ''}
                hasError={!!formErrors.group_id}
                errorMessage={formErrors.group_id}
                onChange={handleInputChange}
                isDarkMode={isDarkMode}
              />
            )}
          </div>
        </div>
      );
    },
    [
      formState.general.societe_assistance,
      formState.location.point_attach, formState.location.lieu_intervention, formState.location.destination,
      formState.location.status, formState.location.evenement, formState.location.group_id,
      formErrors.point_attach, formErrors.lieu_intervention, formErrors.destination,
      formErrors.status, formErrors.evenement, formErrors.group_id,
      handleInputChange, isDarkMode, statusOptions, evenementOptions, societesAssistance,
    ]
  );

  const FinancialSection = useMemo(() => {
    const handleHtUpdate = (htValue: string) => {
      const tvaValue = formState.financial.tva;
      const calculatedTtc = calculateMontantTTC(htValue, tvaValue);
      dispatch({ type: 'UPDATE_FINANCIAL', payload: { montant_ht: htValue, cout_prestation_ttc: calculatedTtc } });
    };

    const handleTvaUpdate = (tvaValue: string) => {
      const htValue = formState.financial.montant_ht;
      const calculatedTtc = calculateMontantTTC(htValue, tvaValue);
      dispatch({ type: 'UPDATE_FINANCIAL', payload: { tva: tvaValue, cout_prestation_ttc: calculatedTtc } });
    };

    return (
      <div className="space-y-6">
        <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
          <DollarSign className="h-6 w-6 text-orange-500" /> Informations financières
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            label="Montant HT (DH)"
            name="montant_ht"
            type="text"
            icon={<Calculator className="h-5 w-5 text-orange-500" />}
            value={formState.financial.montant_ht}
            hasError={!!formErrors.montant_ht}
            errorMessage={formErrors.montant_ht}
            onChange={(e) => handleHtUpdate(e.target.value)}
            isDarkMode={isDarkMode}
          />
          <FormField
            label="TVA (%)"
            name="tva"
            type="text"
            icon={<Percent className="h-5 w-5 text-orange-500" />}
            value={formState.financial.tva}
            hasError={!!formErrors.tva}
            errorMessage={formErrors.tva}
            onChange={(e) => handleTvaUpdate(e.target.value)}
            isDarkMode={isDarkMode}
          />
          <FormField
            label="Coût TTC (DH)"
            name="cout_prestation_ttc"
            type="text"
            icon={<DollarSign className="h-5 w-5 text-orange-500" />}
            readOnly
            value={formState.financial.cout_prestation_ttc}
            hasError={!!formErrors.cout_prestation_ttc}
            errorMessage={formErrors.cout_prestation_ttc}
            onChange={() => {}}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    );
  }, [formState.financial.montant_ht, formState.financial.tva, formState.financial.cout_prestation_ttc, formErrors.montant_ht, formErrors.tva, formErrors.cout_prestation_ttc, isDarkMode, calculateMontantTTC]);

  const SuiviCarburantSection = useMemo(() => (
    <div className="space-y-8 w-full h-full flex flex-col">
      <h2 className={`text-2xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
        <Truck className="h-7 w-7 text-blue-500" /> Informations Suivi Carburant
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full flex-grow">
        <FormField
          label="Date"
          name="date"
          type="date"
          icon={<Calendar className="h-6 w-6 text-blue-500" />}
          value={formState.suiviCarburant.date}
          hasError={!!formErrors.date}
          errorMessage={formErrors.date}
          onChange={handleInputChange}
          isDarkMode={isDarkMode}
          className="text-base"
        />
        <FormField
          label="Véhicule"
          name="vehicule"
          type="text"
          icon={<Car className="h-6 w-6 text-blue-500" />}
          value={formState.suiviCarburant.vehicule}
          hasError={!!formErrors.vehicule}
          errorMessage={formErrors.vehicule}
          onChange={handleInputChange}
          isDarkMode={isDarkMode}
          className="text-base"
        />
        <FormField
          label="Service"
          name="service"
          icon={<Clipboard className="h-6 w-6 text-blue-500" />}
          options={serviceOptions}
          value={formState.suiviCarburant.service}
          hasError={!!formErrors.service}
          errorMessage={formErrors.service}
          onChange={handleInputChange}
          isDarkMode={isDarkMode}
          className="text-base"
        />
        <FormField
          label="Pompiste"
          name="pompiste"
          type="text"
          icon={<User className="h-6 w-6 text-blue-500" />}
          value={formState.suiviCarburant.pompiste}
          hasError={!!formErrors.pompiste}
          errorMessage={formErrors.pompiste}
          onChange={handleInputChange}
          isDarkMode={isDarkMode}
          className="text-base"
        />
        <FormField
          label="Prix (DH)"
          name="prix"
          type="text"
          icon={<DollarSign className="h-6 w-6 text-blue-500" />}
          value={formState.suiviCarburant.prix}
          hasError={!!formErrors.prix}
          errorMessage={formErrors.prix}
          onChange={handleInputChange}
          isDarkMode={isDarkMode}
          className="text-base"
        />
        <div className="col-span-full">
          <FormField
            label="Station Smito"
            name="smitoStation"
            type="text"
            icon={<Building className="h-6 w-6 text-blue-500" />}
            value={formState.suiviCarburant.smitoStation}
            hasError={!!formErrors.smitoStation}
            errorMessage={formErrors.smitoStation}
            onChange={handleInputChange}
            isDarkMode={isDarkMode}
            className="text-lg p-4"
          />
        </div>
      </div>
    </div>
  ), [formState.suiviCarburant.date, formState.suiviCarburant.vehicule, formState.suiviCarburant.service, formState.suiviCarburant.pompiste, formState.suiviCarburant.prix, formState.suiviCarburant.smitoStation, formErrors.date, formErrors.vehicule, formErrors.service, formErrors.pompiste, formErrors.prix, formErrors.smitoStation, handleInputChange, isDarkMode, serviceOptions]);

  if (hasError) {
    return (
      <div className={`h-screen w-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-100 to-white'} flex items-center justify-center`}>
        <div className="p-6 bg-red-100 text-red-700 rounded-lg mx-6">
          <h2 className="text-lg font-semibold">Une erreur s’est produite</h2>
          <p>Veuillez vérifier la console pour plus de détails ou recharger la page.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Recharger
          </button>
        </div>
      </div>
    );
  }

  if (isUserHistory) {
    if (historyLoading) return (
      <div className={`h-screen w-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-100 to-white'} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
      </div>
    );
    if (historyError) return (
      <div className={`h-screen w-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-100 to-white'} flex items-center justify-center`}>
        <div className="p-6 bg-red-100 text-red-800 rounded-lg mx-6">{historyError}</div>
      </div>
    );

    return (
      <div className={`h-screen w-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-100 to-white'} flex flex-col overflow-auto`}>
        <div className={`w-full px-6 py-4 sticky top-0 z-10 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
          <div className="w-full flex justify-between items-center">
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Historique des Données</h1>
            <div className="flex gap-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
              >
                {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </button>
              <button
                onClick={() => navigate(-1)}
                className={`flex items-center gap-2 p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
              >
                <ChevronLeft className="h-6 w-6" /> Retour
              </button>
            </div>
          </div>
        </div>
        <div className="flex-grow p-6 overflow-auto">
          <div className="w-full">
            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-lg`}>
              <div className="flex flex-wrap gap-4 mb-6">
                {['interventions', 'factures', 'suiviCarburant'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                      activeTab === tab ? 'bg-blue-600 text-white' : isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {tab === 'factures' && <File className="h-5 w-5" />}
                    {tab === 'interventions' && <Clipboard className="h-5 w-5" />}
                    {tab === 'suiviCarburant' && <Truck className="h-5 w-5" />}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              {activeTab === 'factures' && (
                <DataTable
                  columns={['ID', 'Numéro', 'Date', 'Société', 'Montant TTC', 'Utilisateur']}
                  data={historyData.factures.map((f: any) => ({
                    id: f.id,
                    ID: f.id,
                    Numéro: f.facture_num,
                    Date: new Date(f.date).toLocaleDateString('fr-FR'),
                    Société: f.billing_company_name_display || f.billing_company || 'N/A',
                    'Montant TTC': `${parseFloat(f.montant_ttc).toFixed(2)} DH`,
                    Utilisateur: f.user?.username || 'N/A',
                  }))}
                  isDarkMode={isDarkMode}
                />
              )}
              {activeTab === 'interventions' && (
                <DataTable
                  columns={['ID', 'Réf. Dossier', 'Assuré', 'Date', 'Événement', 'Statut', 'Coût TTC']}
                  data={historyData.interventions.map((i: any) => ({
                    id: i.id,
                    ID: i.id,
                    'Réf. Dossier': i.ref_dossier,
                    Assuré: i.assure,
                    Date: new Date(i.date_intervention).toLocaleDateString('fr-FR'),
                    Événement: i.evenement,
                    Statut: i.status,
                    'Coût TTC': `${parseFloat(i.cout_prestation_ttc).toFixed(2)} DH`,
                  }))}
                  isDarkMode={isDarkMode}
                />
              )}
              {activeTab === 'suiviCarburant' && (
                <DataTable
                  columns={['ID', 'Véhicule', 'Date', 'Prix', 'Service', 'Pompiste', 'Station Smito']}
                  data={historyData.suiviCarburant.map((s) => ({
                    id: s.id,
                    ID: s.id,
                    Véhicule: s.vehicule,
                    Date: new Date(s.date).toLocaleDateString('fr-FR'),
                    Prix: `${parseFloat(s.prix).toFixed(2)} DH`,
                    Service: s.service,
                    Pompiste: s.pompiste || 'N/A',
                    'Station Smito': s.smitoStation || 'N/A',
                  }))}
                  isDarkMode={isDarkMode}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen w-screen ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-100 to-white'} flex flex-col overflow-auto`}>
      {isLoading ? (
        <div className="h-screen w-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : (
        <div className={`h-screen w-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
          <div className={`w-full px-6 py-4 sticky top-0 z-10 shadow-lg ${formType === 'suivi_carburant' ? 'bg-transparent' : isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="w-full flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Edit3 className="h-6 w-6 text-blue-500" />
                <div>
                  <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>
                    {recordId ? 'Modifier Intervention' : `Nouvelle Opération (${formType === 'intervention' ? 'Intervention' : 'Suivi Carburant'})`}
                  </h1>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Remplissez les informations pour {recordId ? 'modifier' : 'créer'} une {formType === 'intervention' ? 'intervention' : 'un suivi carburant'}
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
                >
                  {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
                </button>
                <button
                  onClick={handleHistoryClick}
                  className={`flex items-center gap-2 p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                >
                  <History className="h-6 w-6" /> Voir Historique
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className={`flex items-center gap-2 p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                >
                  <ChevronLeft className="h-6 w-6" /> Retour
                </button>
              </div>
            </div>
          </div>
          <div className="flex-grow w-full p-6 overflow-auto">
            <div className="w-full h-full">
              {successMessage && (
                <div className={`p-4 mb-6 rounded-lg bg-green-100 text-green-800 flex items-center gap-2 shadow-md mx-6`}>
                  <CheckCircle className="h-5 w-5" /> {successMessage}
                </div>
              )}
              {error && (
                <div className={`p-4 mb-6 rounded-lg bg-red-100 text-red-800 flex items-center gap-2 shadow-md mx-6`}>
                  <AlertCircle className="h-5 w-5" /> {error}
                </div>
              )}
              <form
                onSubmit={handleSubmit}
                className={`w-full h-full flex flex-col p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-none shadow-lg space-y-8`}
              >
                {formType === 'intervention' && (
                  <>
                    {GeneralInfoSection}
                    {ClientSection}
                    {LocationSection}
                    {FinancialSection}
                  </>
                )}
                {formType === 'suivi_carburant' && (
                  <div className="flex-grow w-full">
                    {SuiviCarburantSection}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isLoading || !isValidForm}
                  className={`w-full py-4 rounded-lg text-base font-semibold flex items-center justify-center gap-2 ${
                    isLoading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : isValidForm
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } shadow-md mx-6 mt-8`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      Traitement...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      {recordId ? 'Modifier' : 'Enregistrer'}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(OperationForm);