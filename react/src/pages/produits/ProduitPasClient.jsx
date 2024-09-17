import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../card.css';


import Navbar from '../../components/Navbar/Navbar';
import SearchBar from '../../components/SearchBar';

const ProduitPasClient = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Erreur lors du chargement des produits', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
        fetchUser(); 
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/user', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUser(response.data.user);
        } catch (error) {
            console.error('Erreur lors de la récupération des informations utilisateur', error);
        }
    };

    const addToCart = async (productId) => {
        try {
            await axios.post('http://localhost:8000/api/panier', {
                user_id: user.id,
                produit_id: productId,
                quantite: 1,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            alert('Produit ajouté au panier');
        } catch (error) {
            console.error('Erreur lors de l\'ajout au panier', error);
            alert('Erreur lors de l\'ajout au panier');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="container mx-auto p-4">
                <div className="header mb-4">
                    <h2 className="text-2xl font-semibold">Liste des produits</h2>
                </div>
                <div className="mb-6">
                    <SearchBar setResults={setProducts} />
                </div>
                <div className="card-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div role="status">
                            {/* Spinner pour le chargement */}
                        </div>
                    ) : (
                        products.map((product) => (
                            <div key={product.id} className="card bg-white shadow-lg rounded-lg overflow-hidden">
                                <div className="relative h-56 overflow-hidden text-white bg-blue-gray-500">
                                    <img
                                        src={`http://localhost:8000/storage/${product.image}`}
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
                                    <Link to={`/productsNon/${product.id}`}>
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
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProduitPasClient;
