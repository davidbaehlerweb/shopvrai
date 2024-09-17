import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarClient from '../components/Navbar/NavbarClient';

const MonCompte = () => {
  const [user, setUser] = useState(null); // État pour stocker les données utilisateur
  const [loading, setLoading] = useState(true); // État pour gérer le chargement
  const [error, setError] = useState(null); // État pour gérer les erreurs
  const [showModal, setShowModal] = useState(false); // État pour contrôler la visibilité du modal
  const nav = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Utilisez le token de l'utilisateur connecté
          },
        });
        setUser(response.data.user); // Stocke les données de l'utilisateur
      } catch (err) {
        setError("Erreur lors de la récupération des données de l'utilisateur");
      } finally {
        setLoading(false); // Arrête le chargement une fois la requête terminée
      }
    };

    fetchUser(); // Appel de la fonction pour récupérer les données utilisateur
  }, []);

  const mp = () => {
    nav('/mp');
  };

  const m_info = () => {
    nav('/modifInfo');
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete('http://localhost:8000/api/delete-account', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // Supprimez le token local et redirigez l'utilisateur après la suppression
      localStorage.removeItem('token');
      nav('/register');
    } catch (err) {
      
      setError('Erreur lors de la suppression du compte.');
    }
  };

  if (error) {
    return <div>{error}</div>; // Affiche le message d'erreur s'il y en a une
  }

  return (
    <div>
      <div>
        <NavbarClient />
      </div>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white overflow-hidden shadow rounded-lg border max-w-lg w-full">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Profile de l'utilisateur</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Informations sur l'utilisateur</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Nom</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user ? user.name : 'Nom non disponible'}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user ? user.email : 'Email non disponible'}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Mot de passe</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">••••••••••••</dd>
              </div>
            </dl>
          </div>
          {/* Conteneur Flex pour les boutons */}
          <div className="px-4 py-4">
            <div className="flex justify-between space-x-2">
              <button
                onClick={mp}
                className="group relative flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Modifier Mot de passe
              </button>
              <button
                onClick={m_info}
                className="group relative flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Modifier Informations
              </button>
            </div>
            {/* Bouton de suppression du compte */}
            <div className="mt-4 flex justify-center"> {/* Centrer le bouton de suppression */}
              <button
                onClick={() => setShowModal(true)}
                className="group relative flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Supprimer le compte
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showModal && (
        <div
          id="popup-modal"
          tabIndex="-1"
          className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow">
              <button
                onClick={() => setShowModal(false)}
                type="button"
                className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <div className="p-4 md:p-5 text-center">
                <svg
                  className="mx-auto mb-4 text-gray-400 w-12 h-12"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <h3 className="mb-5 text-lg font-normal text-black">
                  Êtes-vous sûr de vouloir supprimer votre compte ?
                </h3>
                <button
                  onClick={handleDeleteAccount}
                  type="button"
                  className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                >
                  Oui, je suis sûr
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  type="button"
                  className="py-2.5 px-5 ms-3 text-sm font-medium text-black focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
                >
                  Non, annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonCompte;
