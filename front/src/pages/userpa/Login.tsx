import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiLock, FiAlertCircle } from 'react-icons/fi';
import './Login.css';
import logo from './assets/logo.png';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/apilogin/', {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { access, is_admin } = response.data;

      localStorage.setItem('token', access);
      localStorage.setItem('is_admin', is_admin ? 'true' : 'false');
      localStorage.setItem('isLoggedIn', 'true');

      if (is_admin) {
        navigate('/admin');
      } else {
        navigate('/home');
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.error || 'Login failed');
      } else {
        setError('Login failed due to network or server error');
      }
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form" noValidate>
        <div className="logo-wrapper">
          <img src={logo} alt="Tamanar Assistance Logo" className="login-logo" />
        </div>
        <h2 className="form-title">Bienvenue</h2>

        {error && (
          <div className="error-message" role="alert" aria-live="assertive">
            <FiAlertCircle aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <div className="input-group">
          <input
            type="text"
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Nom d'utilisateur"
            className="input-field"
            required
            autoComplete="username"
          />
          <FiUser className="input-icon" aria-hidden="true" />
        </div>

        <div className="input-group">
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="input-field"
            required
            autoComplete="current-password"
          />
          <FiLock className="input-icon" aria-hidden="true" />
        </div>

        <button type="submit" className="login-btn">
          Se connecter
        </button>

        <div className="additional-links">
          <p className="link-text">
            Mot de passe oublié ? <a href="#" className="link">Réinitialiser</a>
          </p>
        </div>
      </form>
    </div>
  );
}