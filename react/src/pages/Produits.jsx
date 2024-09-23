import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../card.css';
import NavbarClient from '../components/Navbar/NavbarClient';
import Navbar from '../components/Navbar/Navbar';
import SearchBar from '../components/SearchBar';

const Produits = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    const navigate = useNavigate(); // Utilisez useNavigate pour la redirection

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://laravel-react-shop-me.com/api/products');

                setProducts(response.data);
            } catch (error) {
                if (error.response && error.response.status === 429) {
                    
                } else {
                    
                }
            } finally {
                setLoading(false);
            }
        };
        

        fetchProducts();
        fetchUser(); 
    }, []);

    const fetchUser = async () => {
        try {
            // Récupérez le token depuis localStorage
            const token = localStorage.getItem('token');
    
            // Si le token n'est pas présent, n'essayez pas de récupérer les informations utilisateur
            if (!token) {
                
                setUser(null); // Définir l'utilisateur comme non connecté
                return; // Sortir de la fonction
            }
    
            // Chargez le cookie CSRF d'abord
            await axios.get('https://laravel-react-shop-me/sanctum/csrf-cookie', { withCredentials: true });
    
             // Vérifiez le token utilisé pour la requête
    
            // Ensuite, faites la requête pour obtenir les informations utilisateur
            const response = await axios.get('https://laravel-react-shop-me/api/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                withCredentials: true, // Assurez-vous d'inclure les cookies
            });
    
            setUser(response.data.user);
        } catch (err) {
            
            if (err.response && err.response.status === 401) {
                
                setUser(null); // Utilisateur non autorisé, on garde Navbar par défaut
            }
        }
    };
    
    
    
    
    
    
    
    
    
    

    const addToCart = async (productId) => {
        if (!user) {
            // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
            navigate('/login'); // Redirection vers la page de connexion
            return;
        }

        try {
            console.log('Adding product to cart:', productId);
            const response = await axios.post('https://laravel-react-shop-me.com/api/add-to-cart', { product_id: productId }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 201) {
                setCartCount(cartCount + 1); // Augmente le compteur de 1
                setShowModal(true);
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout au panier', error);
            alert('Erreur lors de l\'ajout au panier');
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div>
        {/* Affiche NavbarClient si l'utilisateur est connecté, sinon Navbar */}
        {user ? <NavbarClient cartCount={cartCount} /> : <Navbar />}
        
        <div className="container mx-auto p-4">
            {!loading && (
                <>
                    <div className="header mb-4">
                        <h2 className="text-2xl font-semibold">Liste des produits</h2>
                    </div>
                    <div className="mb-6">
                        <SearchBar setResults={setProducts} />
                    </div>
                    <div className="card-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="card bg-white shadow-lg rounded-lg overflow-hidden">
                                <div className="relative h-56 overflow-hidden text-white bg-blue-gray-500">
                                    <img
                                        src={`https://laravel-react-shop-me.com/storage/${product.image}`}
                                        alt="card-image"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="p-6">
                                    <h5 className="block mb-2 text-xl font-semibold">
                                        {product.nom}
                                    </h5>
                                    <p className="block text-base font-light">
                                        {product.description}
                                    </p>
                                    <p className="block text-base font-light">
                                        {product.prix} €
                                    </p>
                                </div>
                                <div className="p-6 pt-0 flex justify-between">
                                    <Link to={`/products/${product.id}`}>
                                        <button
                                            className="bg-gray-900 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg"
                                            type="button"
                                        >
                                            Détails
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => addToCart(product.id)}
                                        className="bg-green-900 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg"
                                        type="button"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>

        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-5 shadow-lg max-w-sm">
                    <h3 className="text-xl font-bold">Produit ajouté avec succès !</h3>
                    <p className="mt-2">Le produit a été ajouté avec succès.</p>
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
    );
};

export default Produits;
