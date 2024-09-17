import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarClient from '../components/Navbar/NavbarClient';

const ModifInfo = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isModified, setIsModified] = useState(false);
  const [showModal, setShowModal] = useState(false); // État pour gérer l'affichage du modal
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUser(response.data.user);
        setName(response.data.user.name);
        setEmail(response.data.user.email);
      } catch (err) {
        setError("Erreur lors de la récupération des données de l'utilisateur");
        
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = () => {
    setIsModified(name !== user.name || email !== user.email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/update-user', {
        name,
        email,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      setShowModal(true); // Afficher le modal de succès
      setTimeout(() => {
        setShowModal(false); // Masquer le modal après 3 secondes
        navigate('/moncompte'); // Rediriger vers MonCompte après la mise à jour
      }, 3000);
    } catch (err) {
      setError('Erreur lors de la mise à jour des informations');
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div>
        <NavbarClient />
      </div>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white overflow-hidden shadow rounded-lg border max-w-lg w-full p-6">
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <h3 className="mb-3 text-4xl font-extrabold text-dark-grey-900 text-center">
              Modifier Informations
            </h3>
            <p className="mb-4 text-grey-700 text-center">Veuillez entrer les informations ci-dessous</p>

            <label htmlFor="nom" className="mb-2 text-sm text-start text-grey-900">
              Nom
            </label>
            <input
              id="nom"
              name="nom"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); handleChange(); }}
              className="w-full px-5 py-4 mb-5 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
            />

            <label htmlFor="email" className="mb-2 text-sm text-start text-grey-900">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); handleChange(); }}
              className="w-full px-5 py-4 mb-5 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
            />

            <button
              type="submit"
              className={`w-full flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white ${isModified ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2' : 'bg-gray-400 cursor-not-allowed'}`}
              disabled={!isModified}
            >
              Modifier Informations
            </button>
          </form>
        </div>
      </div>

      {/* Modal de succès */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5 shadow-lg max-w-sm">
            <h3 className="text-xl font-bold">Informations mises à jour avec succès !</h3>
            <p className="mt-2">Les informations ont été mises à jour avec succès.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModifInfo;
