import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axios';
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import axios from 'axios';

const clientId = import.meta.env.GOOGLE_CLIENT_ID;

const Login = () => {
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [stayConnected, setStayConnected] = useState(false); // État pour gérer la case à cocher "Rester connecté"
  const [error, setError] = useState(null);
  const [googleError, setGoogleError] = useState(null); // État pour les erreurs de Google
  const [showModal, setShowModal] = useState(false); // État pour le modal
  const [showErrorModal, setShowErrorModal] = useState(false); 

  useEffect(() => {
    // Vérifier s'il y a un token dans localStorage ou sessionStorage lors du chargement
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      // Si un token est trouvé, redirigez vers la page d'accueil ou la page appropriée
      nav('/produits');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    setStayConnected(e.target.checked); // Mettre à jour l'état de la case à cocher
  };

  const handleGoogleLoginSuccess = async (response) => {
    const token = response.tokenId;
    try {
        // Envoyer la requête au backend Laravel
        const res = await axios.post('https://laravel-react-shop-me.com/api/google', { token });
        // Enregistrez le token de l'utilisateur
        localStorage.setItem('token', res.data.token);
        nav('/'); // Redirigez après la connexion réussie
    } catch (err) {
        console.error('Erreur lors de la connexion avec Google', err);
        setGoogleError('Échec de la connexion avec Google. Veuillez réessayer.');
    }
};


  const handleGoogleLoginFailure = (error) => {
    console.error('Erreur de connexion Google', error);
    setGoogleError('Échec de la connexion avec Google. Veuillez réessayer.'); // Définit un message d'erreur pour les échecs de connexion Google
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
        // Obtenez le cookie CSRF avant d'envoyer la requête
        await axios.get('https://laravel-react-shop-me.com/sanctum/csrf-cookie', { withCredentials: true });

        // Ensuite, envoyez la requête de connexion
        const response = await axios.post('https://laravel-react-shop-me.com/api/login', formData, { withCredentials: true });

        

        if (response.data.token) {
            // Stockez toujours le token dans localStorage
            localStorage.setItem('token', response.data.token);
            

            setShowModal(true);
            setTimeout(() => {
              nav(response.data.user.name === "admin1" ? "/produitsAdmin" : "/");
            }, 2000);
        } else {
            setError('Erreur de connexion : token manquant.');
        }
    } catch (err) {
        
        setError(err.response?.data?.error || 'Une erreur s\'est produite. Veuillez réessayer.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <h3 className="text-2xl font-extrabold text-center text-dark-grey-900">Connexion</h3>
          <p className="text-center text-grey-700">Entrez votre email et mot de passe</p>

          

          

          <label htmlFor="email" className="block text-sm font-medium text-grey-900">Email*</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="mail@loopple.com"
            className="w-full px-5 py-4 text-sm bg-grey-200 border rounded-2xl outline-none placeholder-grey-700 focus:bg-grey-400"
          />

          <label htmlFor="password" className="block text-sm font-medium text-grey-900">Mot de passe*</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Entrez votre mot de passe"
            className="w-full px-5 py-4 text-sm bg-grey-200 border rounded-2xl outline-none placeholder-grey-700 focus:bg-grey-400"
          />

          <div className="flex flex-row justify-between mb-8">
            <label className="relative inline-flex items-center mr-3 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={stayConnected} 
                onChange={handleCheckboxChange} // Mettre à jour l'état lors de la modification
                className="sr-only peer" 
              />
              <div className="w-5 h-5 bg-white border-2 rounded-sm border-grey-500 peer peer-checked:border-0 peer-checked:bg-purple-blue-500">
                {stayConnected && (
                  <img className="" src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/icons/check.png" alt="tick" />
                )}
              </div>
              <span className="ml-3 text-sm font-normal text-grey-900">Rester connecté</span>
            </label>
            <a href="/forgot-password" className="mr-4 text-sm font-medium text-purple-blue-500">Mot de passe oublié ?</a>
          </div>

          <button
            type="submit"
            className="w-full py-4 text-white bg-blue-600 rounded-2xl hover:bg-teal-700"
          >
            Connexion
          </button>

          <p className="text-sm text-center text-grey-900">Pas encore inscrit? <Link to="/register" className="font-bold text-grey-700">Créer un compte</Link></p>
        </form>
      </div>

      {/* Modal de succès */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 shadow-lg max-w-sm">
            <h3 className="text-xl font-bold">Connexion réussie !</h3>
            <p className="mt-2">Vous êtes connecté avec succès.</p>
          </div>
        </div>
      )}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 shadow-lg max-w-sm">
            <h3 className="text-xl font-bold">Erreur de connexion</h3>
            <p className="mt-2">Email ou mot de passe incorrect.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
