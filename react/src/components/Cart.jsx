import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


import { useParams } from 'react-router-dom';

import CheckoutForm from './CheckoutForm';





const stripePromise = loadStripe('pk_live_51OK4rBCZhPBVRN3nRAePhurtNlMDDdP0lWEzxrzBjfzPRejel6DztVZxLFzKBJJ7qk5pJqMBI4D5H4ZhQCc0HJuo00dzsmhNY4');

const Cart = () => {

  const [clientSecret, setClientSecret] = useState("");

  const { prix, id } = useParams(); // Récupère les deux paramètres de l'URL

 


  useEffect(() => {
    
    fetch("http://localhost:8000/api/payer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: { amount: prix * 100 } }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret); // Set the clientSecret once
      })
      .catch((error) => {
        
      });
  }, [prix, id]); // Ensure dependencies are correct
  
  const options = {
    clientSecret, // Do not mutate this value later
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
