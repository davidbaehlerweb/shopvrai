import React, { useState } from 'react';
import NavbarAdmin from '../../components/Navbar/NavbarAdmin';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddProduits = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [prix, setPrix] = useState('');
    const [image, setImage] = useState(null);
    const [showModal, setShowModal] = useState(false); // État pour le modal
    const nav = useNavigate();
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nom', name); // Changez 'name' en 'nom'
        formData.append('description', description);
        formData.append('prix', prix); // Assurez-vous d'envoyer également le prix
        if (image) formData.append('image', image);

        try {
            const response = await axios.post('https://laravel-react-shop-me.com/api/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            setShowModal(true); // Affichez le modal de produit ajouté
            // Redirection ou autre action après l'ajout du produit
            setTimeout(() => {
                nav("/produitsAdmin"); // Redirection après 2 secondes
            }, 2000);
        } catch (error) {
            
            setError(error.response ? error.response.data : { message: "Une erreur est survenue" });
        }
    };

    return (
        <div>
            <div>
                <NavbarAdmin />
            </div>
            <div>
                <div className="container flex flex-col mx-auto bg-white rounded-lg pt-12 my-5">
                    <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
                        <div className="flex items-center justify-center w-full lg:p-12">
                            <div className="flex items-center xl:p-10">
                                <form
                                    onSubmit={handleSubmit}
                                    className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl"
                                >
                                    <h3 className="mb-3 text-4xl font-extrabold text-dark-grey-900 ">Ajouter un produit</h3>

                                    <label htmlFor="nom" className="mb-2 text-sm text-start text-grey-900 py-3">Nom</label>
                                    <input
                                        id="nom"
                                        name="nom"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Nom"
                                        className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-grey-400 mb-7 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                                    />

                                    <label htmlFor="desc" className="mb-2 text-sm text-start text-grey-900">Description</label>
                                    <input
                                        id="desc"
                                        name="description"
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Description"
                                        className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                                    />

                                    <label htmlFor="prix" className="mb-2 text-sm text-start text-grey-900">Prix</label>
                                    <input
                                        id="prix"
                                        name="prix"
                                        type="number"
                                        value={prix}
                                        onChange={(e) => setPrix(e.target.value)}
                                        placeholder="Prix"
                                        className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                                    />

                                    <label>Image :</label>
                                    <input type="file" onChange={(e) => setImage(e.target.files[0])} />

                                    <button
                                        type="submit"
                                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Ajouter
                                    </button>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal d'ajout de produit */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-5 shadow-lg max-w-sm">
                        <h3 className="text-xl font-bold">Produit ajouté avec succès !</h3>
                        <p className="mt-2">Le produit a été ajouté avec succès.</p>
                        
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddProduits;
