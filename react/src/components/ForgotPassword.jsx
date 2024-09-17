import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  

  const handleForgotPassword = async (e) => {
    e.preventDefault();
  
    // Vérifiez que l'email est valide avant d'envoyer la requête
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Veuillez entrer une adresse e-mail valide.');
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:8000/api/forgot-password', { email });

      setMessage(response.data.message);
      setError('');
    } catch (err) {
      console.error('Erreur de serveur:', err.response); // Log détaillé de l'erreur
      setError(err.response.data.error || 'Une erreur est survenue');
    }
    
  };

  
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white overflow-hidden shadow rounded-lg border max-w-lg w-full p-6">
        <h3 className="mb-3 text-4xl font-extrabold text-dark-grey-900 text-center">
          Mot de passe oublié
        </h3>
        <form className="flex flex-col" onSubmit={handleForgotPassword}>
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
          <button
            type="submit"
            className="w-full flex justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Envoyer le lien de réinitialisation
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
