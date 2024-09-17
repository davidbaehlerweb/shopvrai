import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Navbar from '../../components/Navbar/Navbar';


const InfoPasCo = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Erreur lors du chargement du produit', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (!product) {
        return <div>Produit non trouvé</div>;
    }

    return (
        <div>
            <Navbar />
            <div className="flex justify-center items-center min-h-screen bg-gray-100"> {/* Conteneur Flexbox pour centrer la carte */}
                <div className="card bg-white shadow-lg rounded-lg p-8 max-w-md w-full"> {/* Ajuster les dimensions de la carte */}
                    <div className="relative overflow-hidden text-white rounded-xl h-64 mb-6"> {/* Augmenter la hauteur de l'image */}
                        <img
                            src={`http://localhost:8000/storage/${product.image}`}
                            alt="card-image"
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div className="text-center">
                        <h5 className="block mb-4 font-sans text-2xl font-semibold leading-snug text-blue-gray-900">
                            {product.nom}
                        </h5>
                        <p className="block font-sans text-lg font-light leading-relaxed text-gray-700 mb-4">
                            {product.description}
                        </p>
                        <p className="block font-sans text-lg font-medium leading-relaxed text-gray-900">
                            {product.prix} €
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoPasCo;
