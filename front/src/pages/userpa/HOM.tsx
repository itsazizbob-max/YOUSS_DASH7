```tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTruck, FaGasPump, FaFileInvoice } from 'react-icons/fa';

const Home: React.FC = () => {
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('is_admin') === 'true';
    if (!token) {
      navigate('/login');
    } else if (isAdmin) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleOperationSelect = (type: string) => {
    navigate(`/operation?type=${type}`);
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-blue-800 mb-8">Welcome 👋</h1>
      <p className="text-lg text-blue-600 mb-12">Select an operation to proceed:</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <button
          onClick={() => handleOperationSelect('intervention')}
          className="flex flex-col items-center justify-center p-6 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          <FaTruck className="text-4xl mb-4" />
          <span className="text-xl font-semibold">Registre Intervention</span>
        </button>
        <button
          onClick={() => handleOperationSelect('suivi_carburant')}
          className="flex flex-col items-center justify-center p-6 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          <FaGasPump className="text-4xl mb-4" />
          <span className="text-xl font-semibold">Suivi Carburant</span>
        </button>
        <button
          onClick={() => handleOperationSelect('facture')}
          className="flex flex-col items-center justify-center p-6 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
        >
          <FaFileInvoice className="text-4xl mb-4" />
          <span className="text-xl font-semibold">Facture</span>
        </button>
      </div>
    </div>
  );
};

export default Home;
