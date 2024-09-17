import React from 'react'
import ReactDom from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import {GoogleOAuthProvider} from '@react-oauth/google';

ReactDom.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId='733957681452-i92d0f657rh3mclfdrdsnkdfugkva9uh.apps.googleusercontent.com'>
        <BrowserRouter>
            <App />
        </BrowserRouter>
        </GoogleOAuthProvider>
    </React.StrictMode>,
)
