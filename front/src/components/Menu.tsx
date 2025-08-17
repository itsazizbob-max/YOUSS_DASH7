import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';

interface MenuProps {
  onLogout: () => void;
}

const Menu: React.FC<MenuProps> = ({ onLogout }) => {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex justify-end w-full max-w-3xl mb-4">
        <button
          onClick={onLogout}
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center"
        >
          <FaSignOutAlt className="mr-2 text-lg" />
          Logout
        </button>
      </div>
      <footer className="text-white text-sm mt-8">
        Powered by Lahderaziz
      </footer>
    </div>
  );
};

export default Menu;