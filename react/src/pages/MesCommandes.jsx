import React, { useEffect, useState } from 'react';
import NavbarClient from '../components/Navbar/NavbarClient';
import axios from 'axios';
import { AiOutlineClose } from 'react-icons/ai'; // Assurez-vous d'importer l'icône

const MesCommandes = () => {
  const [cartItems, setCartItems] = useState([]); // État pour stocker les produits du panier
  const [loading, setLoading] = useState(true); // État pour le chargement
  const [showModal, setShowModal] = useState(false); // État pour contrôler la visibilité du modal

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('https://laravel-react-shop-me.com/api/get-commande', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCartItems(response.data.cartItems);
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  const totalPrix = cartItems.reduce((total, item) => total + parseFloat(item.produit.prix), 0).toFixed(2);

  const closeModal = () => {
    setShowModal(false); // Fermer le modal
  };

  

  return (
    <div>
      <div>
        <NavbarClient />
      </div>
      <div className="flex flex-col items-center mt-8">
        {/* Vérifiez si le panier est vide */}
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-700 text-lg">Vous n'avez aucune commande pour le moment.</p>
        ) : (
          <>
            {/* Affichage des commandes si le panier n'est pas vide */}
            <ul className="max-w-4xl divide-y divide-gray-200 w-full">
              {/* En-tête de la table */}
              <li className="grid grid-cols-5 items-center font-bold text-lg bg-gray-100 py-2">
                <div className="text-black">Image</div>
                <div className="text-black">Nom</div>
                <div className="text-black">Prix</div>
                <div className="text-black">Status</div>
                <div></div>
              </li>
              {/* Affichage des produits du panier */}
              {cartItems.map((item) => (
                <li key={item.id} className="grid grid-cols-5 items-center py-2">
                  <div className="flex items-center">
                    <img
                      className="w-16 h-16 rounded-full"
                      src={`http://localhost:8000/storage/${item.produit.image}`}
                      alt={item.produit.nom}
                    />
                  </div>
                  <div className="text-sm font-medium text-black">{item.produit.nom}</div>
                  <div className="text-sm text-black">${item.produit.prix}</div>
                  <div className="text-base font-semibold text-black">{item.status}</div>
                  
                </li>
              ))}
            </ul>

            {/* Affichage du total des prix */}
            <div className="max-w-4xl w-full mt-4 text-right">
              <p className="text-lg font-bold">Total: ${totalPrix}</p>
            </div>
          </>
        )}

        {/* Modal de confirmation de suppression */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-5 shadow-lg max-w-sm">
              <h3 className="text-xl font-bold">Produit supprimé avec succès !</h3>
              <p className="mt-2">Le produit a été supprimé avec succès du panier.</p>
              <button
                className="mt-4 bg-blue-500 text-white py-1 px-4 rounded"
                onClick={closeModal}
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MesCommandes;
