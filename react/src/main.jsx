// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Ajout des logs de débogage
console.log('Script loaded successfully');

const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);

if (rootElement) {
    console.log('Rendering React application');
    // Initialisation de la racine de l'application React
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <GoogleOAuthProvider clientId='733957681452-i92d0f657rh3mclfdrdsnkdfugkva9uh.apps.googleusercontent.com'>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </GoogleOAuthProvider>
        </React.StrictMode>
    );
} else {
    console.error('Root element not found');
}
