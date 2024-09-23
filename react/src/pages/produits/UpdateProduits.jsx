import React, { useEffect, useState } from 'react';
import NavbarAdmin from '../../components/Navbar/NavbarAdmin';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UpdateProduits = () => {
    const { id } = useParams();
    
    const [product, setProduct] = useState({
        nom: '',
        description: '',
        prix: '',
        image: ''
    });
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // État pour le modal de succès
    const nav = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`https://laravel-react-shop-me.com/api/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };
    

    const handleImageChange = (e) => {
        setProduct({ ...product, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
    
        const formData = new FormData();
        formData.append('nom', product.nom);
        formData.append('description', product.description);
        formData.append('prix', product.prix);
        if (product.image) {
            formData.append('image', product.image);
        }
    
        try {
            await axios.post(`http://localhost:8000/api/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                nav("/produitsAdmin");
            }, 3000);
        } catch (error) {
            if (error.response && error.response.data) {
                
            } else {
                
            }
        }
    };
    
    
    
    
    

    if (loading) {
        return <div>Chargement...</div>;
    }

    return (
        <div>
            <NavbarAdmin />
            <div>
                <div className="container flex flex-col mx-auto bg-white rounded-lg pt-12 my-5">
                    <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
                        <div className="flex items-center justify-center w-full lg:p-12">
                            <div className="flex items-center xl:p-10">
                                <form onSubmit={handleSubmit} className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl">
                                    <h3 className="mb-3 text-4xl font-extrabold text-dark-grey-900">Ajouter un produit</h3>
                                    
                                    <label htmlFor="nom" className="mb-2 text-sm text-start text-grey-900 py-3">Nom</label>
                                    <input
                                        id="nom"
                                        name="nom"
                                        type="text"
                                        value={product.nom}
                                        onChange={handleInputChange}
                                        placeholder="Nom"
                                        className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                                    />


                                    <label htmlFor="desc" className="mb-2 text-sm text-start text-grey-900">Description</label>
                                    <input
                                        id="desc"
                                        name="description"
                                        type="text"
                                        value={product.description}
                                        onChange={handleInputChange}
                                        placeholder="Description"
                                        className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                                    />

                                    <label htmlFor="prix" className="mb-2 text-sm text-start text-grey-900">Prix</label>
                                    <input
                                        id="prix"
                                        name="prix"
                                        type="number"
                                        value={product.prix}
                                        onChange={handleInputChange}
                                        placeholder="Prix"
                                        className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                                    />

                                    <label>Image :</label>
                                    <input type="file" onChange={handleImageChange} />

                                    <button
                                        type="submit"
                                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Update
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-5 shadow-lg max-w-sm">
                        <h3 className="text-xl font-bold">Produit modifié avec succès !</h3>
                        <p className="mt-2">Le produit a été modifié avec succès.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateProduits;
