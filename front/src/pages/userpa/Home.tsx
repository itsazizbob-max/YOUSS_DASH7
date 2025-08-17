import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/logo.png'; // Make sure the path to your logo is correct

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');

    if (token) {
      setIsAuthenticated(true);
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        setUsername('Utilisateur');
      }
    } else {
      setIsAuthenticated(false);
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [navigate]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole'); // Clear user role
    localStorage.removeItem('is_admin'); // Clear admin status
    setIsAuthenticated(false);
    navigate('/login'); // Redirect to login after logout
  }, [navigate]);

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center py-8 px-4 overflow-auto">
      {isAuthenticated ? (
        <div className="flex flex-col items-center w-full max-w-4xl px-4">
          <img
            src={logo}
            alt="Tamanar Assistance Remorquage Expert Auto Logo"
            className="w-40 h-auto mb-8 object-contain"
          />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3 text-center leading-tight">
            Bonjour, Bienvenue, <span className="text-blue-700">{username || 'Utilisateur'}</span> 👋
          </h1>
          <p className="text-xl text-gray-600 mb-10 text-center">
            Choisissez une opération pour continuer
          </p>

          {/* Buttons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
            {/* Registre Intervention Button */}
            <button
              onClick={() => navigate('/operation?type=intervention')}
              className="bg-white text-gray-800 font-semibold p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center gap-3 w-full text-center border border-blue-200"
            >
              <span className="text-4xl">🚛</span>
              <span className="text-xl">Registre Intervention</span>
            </button>

            {/* Suivi Carburant Button */}
            <button
              onClick={() => navigate('/operation?type=suivi_carburant')}
              className="bg-white text-gray-800 font-semibold p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center gap-3 w-full text-center border border-green-200"
            >
              <span className="text-4xl">⛽</span>
              <span className="text-xl">Suivi Carburant</span>
            </button>

            {/* Voir Historique Button */}
            <button
              onClick={() => navigate('/userhistory')}
              className="bg-white text-gray-800 font-semibold p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center gap-3 w-full text-center border border-purple-200"
            >
              <span className="text-4xl">📚</span>
              <span className="text-xl">Voir Historique</span>
            </button>

            {/* Statistique Button (New) */}
            <button
              onClick={() => navigate('/statistics')}
              className="bg-white text-gray-800 font-semibold p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center gap-3 w-full text-center border border-yellow-200"
            >
              <span className="text-4xl">📊</span>
              <span className="text-xl">Statistiques</span>
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="mt-12 bg-red-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-red-700 transition-all duration-300 shadow-md text-lg"
          >
            Se Déconnecter
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full text-center max-w-xl px-4">
          <img
            src={logo}
            alt="Tamanar Assistance Remorquage Expert Auto Logo"
            className="w-40 h-auto mb-8 object-contain"
          />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
            Bienvenue sur Tamanar Assistance
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md">
            Vous devez vous connecter pour accéder aux fonctionnalités du site. Cliquez sur le bouton ci-dessous pour vous connecter.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg"
          >
            Se Connecter
          </button>
          <p className="text-md text-gray-500 mt-6 max-w-md">
            Comment utiliser le site : <br />
            1. Connectez-vous avec vos identifiants. <br />
            2. Choisissez une opération dans la page d'accueil. <br />
            3. Suivez les instructions pour chaque section.
          </p>
        </div>
      )}

      <footer className="text-gray-600 text-sm mt-12 text-center">
        Powered by Lahderaziz
      </footer>
    </div>
  );
};

export default Home;