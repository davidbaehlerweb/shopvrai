import React, { useEffect, useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from 'axios'; 
import { useParams, useNavigate } from "react-router-dom";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { id, uniqueInstanceId } = useParams(); // Récupère uniqueInstanceId depuis les paramètres d'URL
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    

    if (!stripe) {
        
        return;
    }

    

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );
    

    if (!clientSecret) {
        
        return;
    }

    

    stripe.retrievePaymentIntent(clientSecret)
        .then(({ paymentIntent }) => {
            

            if (!paymentIntent) {
                
                setMessage("Error retrieving payment status.");
                return;
            }

            // Vérifiez l'état du PaymentIntent avant de confirmer
            

            switch (paymentIntent.status) {
                case "succeeded":
                    
                    testUpdate(); 
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        })
        .catch(error => {
            
            setMessage("Error retrieving payment status.");
        });
}, [stripe, elements]);

const handleSubmit = async (e) => {
  e.preventDefault();
  

  if (!stripe || !elements) {
      
      return;
  }

  setIsLoading(true);

  try {
      const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
              return_url: window.location.href, // Utilisez l'URL actuelle pour le retour après paiement
          },
          redirect: "if_required" // Utilisez 'if_required' pour gérer la redirection manuellement
      });

      

      if (error) {
          
          setMessage(error.message);
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
          
          await testUpdate(); // Attendez que la mise à jour soit terminée
          setMessage("Payment confirmed and status updated.");
      } else {
          
          setMessage("Unexpected error.");
      }

  } catch (err) {
      
      setMessage("Error during payment confirmation.");
  } finally {
      setIsLoading(false);
  }
};

const testUpdate = async () => {
  try {
      
      
      // Récupérez le token depuis le localStorage
      const token = localStorage.getItem('token');
      if (!token) {
          
          setMessage('Erreur : utilisateur non authentifié.');
          return;
      }

      // Utilisez l'ID unique de l'URL
      await axios.get('http://localhost:8000/sanctum/csrf-cookie', { withCredentials: true });

      const response = await axios.post('http://localhost:8000/api/update-payment-status', {
        produit_id: id,
        unique_instance_id: uniqueInstanceId // Utilisez l'ID unique récupéré depuis les paramètres d'URL
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      
      setMessage('Update succeeded!');
      
      // Redirigez l'utilisateur seulement après la mise à jour réussie
      navigate("/"); 
  } catch (error) {
      
      setMessage('Update failed.');
  }
};

const paymentElementOptions = {
  layout: "tabs"
};

return (
  <form id="payment-form" onSubmit={handleSubmit}>
    <PaymentElement id="payment-element" options={paymentElementOptions} />
    <button type="submit"
      className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      <span id="button-text">
        {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
      </span>
    </button>
    {message && <div style={{ color: 'green', fontSize: 25 }} id="payment-message">{message}</div>}
  </form>
);
}
