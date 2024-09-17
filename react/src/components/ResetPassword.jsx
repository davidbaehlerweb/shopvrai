import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams(); // Récupère le token depuis l'URL
  const nav = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:8000/api/reset-password', {
        token,
        email,
        password,
        password_confirmation: passwordConfirm
      });
  
      setMessage(response.data.message);
      setError('');
      setTimeout(() => {
        nav('/login');
      }, 3000); // Redirige après 3 secondes
    } catch (err) {
      console.error('Erreur de serveur:', err.response);
      setError(err.response.data.error || 'Une erreur est survenue');
    }
  };
  
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white overflow-hidden shadow rounded-lg border max-w-lg w-full p-6">
        <h3 className="mb-3 text-4xl font-extrabold text-dark-grey-900 text-center">
          Réinitialiser le mot de passe
        </h3>
        <form className="flex flex-col" onSubmit={handleResetPassword}>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
          
          <label htmlFor="email" className="mb-2 text-sm text-start text-grey-900">Email*</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse email"
            className="w-full px-5 py-4 mb-5 text-sm font-medium outline-none bg-grey-200 text-dark-grey-900 rounded-2xl"
          />

          <label htmlFor="password" className="mb-2 text-sm text-start text-grey-900">Nouveau mot de passe*</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nouveau mot de passe"
            className="w-full px-5 py-4 mb-5 text-sm font-medium outline-none bg-grey-200 text-dark-grey-900 rounded-2xl"
          />

          <label htmlFor="passwordConfirm" className="mb-2 text-sm text-start text-grey-900">Confirmer le nouveau mot de passe*</label>
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="Confirmer le nouveau mot de passe"
            className="w-full px-5 py-4 mb-5 text-sm font-medium outline-none bg-grey-200 text-dark-grey-900 rounded-2xl"
          />

          <button
            type="submit"
            className="w-full flex justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Réinitialiser le mot de passe
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
