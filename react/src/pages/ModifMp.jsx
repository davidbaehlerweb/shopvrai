import React, { useState } from 'react';
import axios from 'axios';
import NavbarClient from '../components/Navbar/NavbarClient';
import { useNavigate } from 'react-router-dom';

const ModifMp = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false); // État pour gérer l'affichage du modal
  const navigate = useNavigate(); // Utilisation de navigate pour la redirection

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== newPasswordConfirm) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    try {
      const response = await axios.post('https://laravel-react-shop-me.com/api/update-password', {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirm
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      

      setSuccess(response.data.message);
      setError('');
      setShowModal(true); // Affiche le modal de succès

      // Attendre 3 secondes avant de rediriger
      setTimeout(() => {
        setShowModal(false); // Cache le modal
        navigate('/monCompte'); // Redirige vers la page MonCompte
      }, 3000); // 3000ms = 3 secondes

    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
    }
  };

  return (
    <div>
      <div>
        <NavbarClient />
      </div>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        {/* Conteneur principal centré */}
        <div className="bg-white overflow-hidden shadow rounded-lg border max-w-lg w-full p-6">
          {/* Formulaire */}
          <form className="flex flex-col" onSubmit={handlePasswordChange}>
            <h3 className="mb-3 text-4xl font-extrabold text-dark-grey-900 text-center">
              Modifier le mot de passe
            </h3>
            <p className="mb-4 text-grey-700 text-center">Veuillez entrer les informations ci-dessous</p>

            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

            <label htmlFor="current_password" className="mb-2 text-sm text-start text-grey-900">
              Mot de passe actuel
            </label>
            <input
              id="current_password"
              name="current_password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Mot de passe actuel"
              className="w-full px-5 py-4 mb-5 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
            />

            <label htmlFor="new_password" className="mb-2 text-sm text-start text-grey-900">
              Nouveau mot de passe
            </label>
            <input
              id="new_password"
              name="new_password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nouveau mot de passe"
              className="w-full px-5 py-4 mb-5 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
            />

            <label htmlFor="new_password_confirm" className="mb-2 text-sm text-start text-grey-900">
              Confirmer le nouveau mot de passe
            </label>
            <input
              id="new_password_confirm"
              name="new_password_confirm"
              type="password"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              placeholder="Confirmer le nouveau mot de passe"
              className="w-full px-5 py-4 mb-5 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
            />

            <button
              type="submit"
              className="w-full flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Modifier mot de passe
            </button>
          </form>
        </div>
      </div>

      {/* Modal de succès */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 shadow-lg max-w-sm">
            <h3 className="text-xl font-bold">Informations mises à jour avec succès !</h3>
            <p className="mt-2">Le mot de passe a été modifié avec succès.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModifMp;
