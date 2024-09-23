import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useParams } from 'react-router-dom';
import CheckoutForm from './CheckoutForm';

// Vérifiez que la clé est bien chargée
console.log("Clé Stripe chargée depuis l'environnement :", import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Charger la clé Stripe depuis les variables d'environnement
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Cart = () => {
  const [clientSecret, setClientSecret] = useState("");
  const { prix, id } = useParams(); 

  useEffect(() => {
    fetch("https://laravel-react-shop-me.com/api/payer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: { amount: prix * 100 } }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret); 
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération du clientSecret :', error);
      });
  }, [prix, id]); 
  
  const options = {
    clientSecret, 
    appearance: { theme: 'stripe' },
  };

  return (
    <div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm id={id}/>
        </Elements>
      )}
    </div>
  );
};

export default Cart;
