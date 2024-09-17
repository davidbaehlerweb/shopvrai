import React, { useEffect, useState } from 'react';
import NavbarClient from '../components/Navbar/NavbarClient';
import { AiOutlineClose } from 'react-icons/ai'; // Import de l'icône de croix
import axios from 'axios'; // Importer axios pour les requêtes HTTP

const PanierStripe = () => {
  const [cartItems, setCartItems] = useState([]); // État pour stocker les produits du panier
  const [loading, setLoading] = useState(true); // État pour le chargement
  const [showModal, setShowModal] = useState(false); // État pour contrôler la visibilité du modal

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/get-cart', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCartItems(response.data.cartItems);
    } catch (error) {
      console.error('Erreur lors de la récupération du panier', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer un produit du panier
  const removeFromCart = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/remove-from-cart/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Filtrer l'élément supprimé du panier
      setCartItems(cartItems.filter(item => item.id !== id));
      setShowModal(true); // Afficher le modal lorsque le produit est supprimé avec succès
    } catch (error) {
      console.error('Erreur lors de la suppression du produit', error);
    }
  };

  // Calcul du total des prix des produits dans le panier
  const totalPrix = cartItems.reduce((total, item) => total + parseFloat(item.produit.prix), 0).toFixed(2);

  const closeModal = () => {
    setShowModal(false); // Fermer le modal
  };

  const handlePayment = () => {
    // Logique pour le paiement ici
    alert('paiement en')
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <div>
        <NavbarClient />
      </div>
      <div className="flex flex-col items-center mt-8"> {/* Utilise flex pour aligner verticalement et centrer les éléments */}
        <ul className="max-w-4xl divide-y divide-gray-200 w-full"> {/* Largeur maximale définie */}
          {/* En-tête de la table */}
          <li className="grid grid-cols-5 items-center font-bold text-lg bg-gray-100 py-2"> {/* Utilise grid pour aligner les éléments */}
            <div className="text-black">Image</div>
            <div className="text-black">Nom</div>
            <div className="text-black">Prix</div>
            <div className="text-black">Status</div>
            <div></div> {/* Colonne vide pour aligner avec la croix rouge */}
          </li>
          {/* Affichage des produits du panier */}
          {cartItems.map((item) => (
            <li key={item.id} className="grid grid-cols-5 items-center py-2"> {/* Utilise grid pour aligner les éléments */}
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
              {/* Bouton avec une croix rouge */}
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => removeFromCart(item.id)} // Appel de la fonction de suppression
              >
                <AiOutlineClose size={20} />
              </button>
            </li>
          ))}
        </ul>

        {/* Affichage du total des prix */}
        <div className="max-w-4xl w-full mt-4 text-right">
          <p className="text-lg font-bold">Total: ${totalPrix}</p>
        </div>

        {/* Bouton de paiement centré */}
        <div className="mt-6"> {/* Marge en haut pour espacer */}
          <button
            className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-green-600"
            onClick={handlePayment}
          >
            Payer
          </button>
        </div>

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

export default PanierStripe;
