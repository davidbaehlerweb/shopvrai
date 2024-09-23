import axios from 'axios';
import React, { useState, useEffect } from 'react';
import GoogleLogin from 'react-google-login';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    const nav = useNavigate();
    const [error, setError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [showModal, setShowModal] = useState(false); // État pour le modal
    const [timeoutId, setTimeoutId] = useState(null); // Pour gérer le délai de vérification de l'email

    const clientId = import.meta.env.GOOGLE_CLIENT_ID;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === 'password_confirmation' || name === 'password') {
            if (formData.password !== formData.password_confirmation) {
                setError({ error: 'Les mots de passe ne correspondent pas' });
            } else {
                setError(null);
            }
        }

        if (name === 'email') {
            setEmailError(null);
            clearTimeout(timeoutId); // Clear existing timeout

            const newTimeoutId = setTimeout(() => {
                validateEmail(value);
                if (!emailError) {
                    checkEmailExists(value);
                }
            }, 500);

            setTimeoutId(newTimeoutId);
        }
    };

    const responseGoogle = (response) => {
        if (response.error) {
            
            setError("Google login failed: " + response.error);
            return;
        }

        axios.post('https://laravel-react-shop-me.com//auth/google', { token: response.tokenId })
            .then(response => {
                localStorage.setItem('token', response.data.token);
                nav('/'); // Assurez-vous que cette redirection est correcte
            })
            .catch(error => {
                
                setError('Failed to authenticate with Google');
            });
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(email)) {
            setEmailError('Email invalide');
        } else {
            setEmailError(null);
        }
    };

    const checkEmailExists = async (email) => {
        try {
            const response = await axios.post('https://laravel-react-shop-me.com/api/check-email', { email });
            if (response.data.available === false) {
                setEmailError('Cet email existe déjà');
            } else {
                setEmailError('Email valide');
            }
        } catch (err) {
            
        }
    };

    const handleEmailBlur = async () => {
        const email = formData.email;
        validateEmail(email);
        if (!emailError) {
            await checkEmailExists(email);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        console.log(formData)
        validateEmail(formData.email);
        await handleEmailBlur();
    
        if (emailError) {
            
            return; 
        }
    
        if (formData.password !== formData.password_confirmation) {
            setError({ error: 'Les mots de passe ne correspondent pas' });
            return; 
        }
    
        try {
            const response = await axios.post('https://laravel-react-shop-me.com/api/register', formData);
            
            
            setShowModal(true);
            setTimeout(() => {
                nav("/login");
            }, 2000);
    
        } catch (err) {
            
            if (err.response) {
                setError({ error: err.response.data.message || 'Une erreur s\'est produite. Veuillez réessayer.' });
            } else {
                setError({ error: 'Une erreur s\'est produite. Veuillez réessayer.' });
            }
        }
    };

    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 overflow-hidden">
            <div className="w-full max-w-md p-6 m-4 bg-white rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-2xl font-extrabold text-center text-dark-grey-900">Inscription</h3>
                    <p className="text-center text-grey-700">Créez votre compte</p>
                    
                    

                    

                    <div className="space-y-4">
                        <label htmlFor="name" className="block text-sm font-medium text-grey-900">Nom*</label>
                        <input 
                            id="name" 
                            name="name" 
                            type="text"
                            value={formData.name} 
                            onChange={handleChange}
                            placeholder="Nom" 
                            className="w-full px-4 py-2 text-sm bg-grey-200 border rounded-2xl outline-none placeholder-grey-700 focus:bg-grey-400"
                        />

                        <label htmlFor="email" className="block text-sm font-medium text-grey-900">Email*</label>
                        <input 
                            id="email" 
                            name="email" 
                            type="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            onBlur={handleEmailBlur} 
                            placeholder="mail@loopple.com" 
                            className="w-full px-4 py-2 text-sm bg-grey-200 border rounded-2xl outline-none placeholder-grey-700 focus:bg-grey-400"
                        />
                        

                        <label htmlFor="password" className="block text-sm font-medium text-grey-900">Mot de passe*</label>
                        <input 
                            id="password" 
                            name="password" 
                            type="password"
                            value={formData.password} 
                            onChange={handleChange} 
                            placeholder="Entrez votre mot de passe" 
                            className="w-full px-4 py-2 text-sm bg-grey-200 border rounded-2xl outline-none placeholder-grey-700 focus:bg-grey-400"
                        />

                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-grey-900">Confirmation de mot de passe*</label>
                        <input 
                            id="password_confirmation" 
                            name="password_confirmation" 
                            type="password" 
                            value={formData.password_confirmation} 
                            onChange={handleChange} 
                            placeholder="Confirmez votre mot de passe" 
                            className="w-full px-4 py-2 text-sm bg-grey-200 border rounded-2xl outline-none placeholder-grey-700 focus:bg-grey-400"
                        />

                        {error && <p className="text-red-500">{error.error}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 text-white bg-blue-600 rounded-2xl hover:bg-teal-700"
                    >
                        S'inscrire
                    </button>
                    <p className="text-sm text-center text-grey-900">Vous avez déjà un compte? <Link to="/login" className="font-bold text-grey-700">Connectez-vous</Link></p>
                </form>
            </div>

            {/* Modal de succès */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="p-5 bg-white rounded-lg shadow-lg max-w-sm">
                        <h3 className="text-xl font-bold">Inscription réussie !</h3>
                        <p className="mt-2">Votre compte a été créé avec succès.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;
