import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/userpa/Login';
import OperationForm from './pages/userpa/OperationForm';
import AdminDashboard from './pages/adminpa/AdminDashboard';
import HomePage from './pages/userpa/Home';
import './index.css';
import UserManagement from './pages/adminpa/UserManagement';
import AdminRoute from './pages/adminpa/AdminRoute';
import CompanySelection from './pages/userpa/CompanySelection';
import InvenData from './pages/userpa/InterventionRecords';
import Logout from './pages/userpa/Logout';
import SuiviCarburantRecords from './pages/userpa/SuiviCarburantRecords';
import FactureRecords from './pages/userpa/FactureRecords';
import AddUserForm from './pages/adminpa/AddUserForm';
import UserRoute from './pages/userpa/UserRoute';
import GenerateFacturePage from './pages/userpa/GenerateFacturePage';
import UserHistoryPage from './pages/userpa/UserHistoryPage';
import Statistics from './pages/userpa/Statistics';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Protected Routes */}
        

        {/* User Protected Routes */}
        <Route path="/home" element={<UserRoute><HomePage /></UserRoute>} />
        <Route path="/operation" element={<UserRoute><OperationForm /></UserRoute>} />
        <Route path="/company-selection" element={<UserRoute><CompanySelection /></UserRoute>} />
        <Route path="/intervention-records-data" element={<UserRoute><InvenData /></UserRoute>} />
        <Route path="/suivi-carburant-records" element={<UserRoute><SuiviCarburantRecords /></UserRoute>} />
        <Route path="/facture-records" element={<UserRoute><FactureRecords /></UserRoute>} />
        <Route path="/generate-facture/:id" element={<UserRoute><GenerateFacturePage /></UserRoute>} />
        <Route path="/userhistory" element={<UserRoute><UserHistoryPage /></UserRoute>} /> {/* Already added */}
        <Route path="/statistics" element={<Statistics />} />

        {/* Logout Route */}
        <Route path="/logout" element={<Logout />} />

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;