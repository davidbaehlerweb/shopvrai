import React, { useRef, useState, useEffect } from 'react';
import NavbarClient from '../components/Navbar/NavbarClient';
import Navbar from '../components/Navbar/Navbar'; // Assurez-vous d'importer votre autre barre de navigation
import emailjs from 'emailjs-com';
import axios from 'axios';

const Contact = () => {
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [user, setUser] = useState(null); // État pour gérer l'utilisateur
    const form = useRef();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Vérifier l'état de connexion de l'utilisateur
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/user', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setUser(response.data.user);
            } catch (error) {
                
                setUser(null); // Utilisateur non connecté
            }
        };

        fetchUser();
    }, []);

    const sendEmail = (e) => {
        e.preventDefault();
    
        const templateParams = {
            user_name: email,
            user_email: email,
            subject: subject,
            message: message
        };
    
        emailjs.send('service_ul274ad', 'template_hh2um1s', templateParams, '5Q1epSZtz49NPieoF')
            .then((result) => {
                
                setSuccessMessage('Votre message a été envoyé avec succès !');
                setErrorMessage('');
    
                // Réinitialiser le formulaire
                setEmail('');
                setSubject('');
                setMessage('');
    
                // Afficher le modal de succès
                setShowModal(true);
    
                // Masquer le modal après quelques secondes (optionnel)
                setTimeout(() => {
                    setShowModal(false);
                }, 3000);
            })
            .catch((error) => {
                
                setErrorMessage('Erreur lors de l\'envoi du message : ' + error.text);
                setSuccessMessage('');
            });
    };
    

    return (
        <div className="overflow-x-hidden">
            {/* Affiche NavbarClient si l'utilisateur est connecté, sinon Navbar */}
            {user ? <NavbarClient /> : <Navbar />}
            
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-5 shadow-lg max-w-sm">
                        <h3 className="text-xl font-bold">Message envoyé avec succès !</h3>
                        <p className="mt-2">Votre message a été envoyé avec succès.</p>
                    </div>
                </div>
            )}
            <div>
                <section className="bg-white">
                    <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
                        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900">
                            Contactez-nous
                        </h2>
                        <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 sm:text-xl">
                            Vous avez une question ? Faites-le nous savoir.
                        </p>
    
                        <form ref={form} onSubmit={sendEmail} className="space-y-8">
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                                    Ton email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="shadow-sm bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                                    placeholder="name@flowbite.com"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900">
                                    Sujet
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="block p-3 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Faites-nous savoir comment nous pouvons vous aider"
                                    required
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">
                                    Votre message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="6"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Laissez un commentaire..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-blue-700 sm:w-fit hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                            >
                                Envoyer le message
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Contact;
