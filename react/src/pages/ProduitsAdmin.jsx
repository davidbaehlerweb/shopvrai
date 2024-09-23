import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavbarAdmin from '../components/Navbar/NavbarAdmin';
import axios from 'axios';
import '../card.css';

const ProduitsAdmin = () => {
    const [products, setProducts] = useState([]);
    const nav = useNavigate(); // Utiliser useNavigate pour la redirection
    const [showModal, setShowModal] = useState(false); // État pour le modal de succès

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://laravel-react-shop-me.com/api/products');
                setProducts(response.data);
            } catch (error) {
                
            }
        };

        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://laravel-react-shop-me.com/api/products/${id}`);
            
            // Mettre à jour l'état des produits après suppression
            setProducts(products.filter(product => product.id !== id));
            
            // Afficher le modal de succès
            setShowModal(true);
    
            // Masquer le modal après quelques secondes (optionnel)
            setTimeout(() => {
                setShowModal(false);
            }, 3000);
        } catch (error) {
            
            alert('Erreur lors de la suppression du produit');
        }
    };

    return (
        <div>
            <NavbarAdmin />
            <div className="container">
                <div className="header">
                    <h2 className="text-2xl font-semibold">Liste des produits</h2>
                    <Link to="/add">
                        <button className="add-button">Add</button>
                    </Link>
                </div>
                <div className="card-container">
                    {products.length === 0 ? (
                        <p>Aucun produit disponible.</p>
                    ) : (
                        products.map((product) => (
                            <div key={product.id} className="card">
                                <div className="relative h-56 overflow-hidden text-white shadow-lg rounded-xl bg-blue-gray-500">
                                    <img
                                        src={`https://laravel-react-shop-me.com/storage/${product.image}`}
                                        alt="card-image"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div className="p-6">
                                    <h5 className="block mb-2 font-sans text-xl font-semibold leading-snug text-blue-gray-900">
                                        {product.nom}
                                    </h5>
                                    <p className="block font-sans text-base font-light leading-relaxed">
                                        {product.description}
                                    </p>
                                    <p className="block font-sans text-base font-light leading-relaxed">
                                        {product.prix} CHF
                                    </p>
                                </div>
                                <div className="p-6 pt-0 flex space-x-4">
                                    <Link to={`/edit/${product.id}`}>
                                        <button
                                            className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gray-900 text-white shadow-md hover:shadow-lg"
                                            type="button"
                                        >
                                            Modifier
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-red-900 text-white shadow-md hover:shadow-lg"
                                        type="button"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-5 shadow-lg max-w-sm">
                        <h3 className="text-xl font-bold">Produit supprimé avec succès !</h3>
                        <p className="mt-2">Le produit a été supprimé avec succès.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProduitsAdmin;
