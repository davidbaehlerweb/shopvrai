import React, { useEffect, useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from 'axios'; 
import { useParams, useNavigate } from "react-router-dom";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { id, uniqueInstanceId } = useParams();
 // Récupère uniqueInstanceId depuis les paramètres d'URL
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
                    
                 testUpdate(uniqueInstanceId);
                 navigate("/");

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
        return_url: window.location.href,
      },
      redirect: "if_required"
    });

    if (error) {
      setMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Mettez à jour tous les éléments après la confirmation du paiement
      await updateAllItems();
      setMessage("Payment confirmed and status updated.");

      // Rediriger vers la page d'accueil après toutes les mises à jour
      navigate("/");
    } else {
      setMessage("Unexpected error.");
    }

  } catch (err) {
    setMessage("Error during payment confirmation.");
  } finally {
    setIsLoading(false);
  }
};

// Fonction pour mettre à jour toutes les instances de produits
const updateAllItems = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Erreur : utilisateur non authentifié.');
      return;
    }

    // Obtenez tous les identifiants uniques des produits dans le panier
    const cartResponse = await axios.get('https://laravel-react-shop-me.com/api/get-cart', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const cartItems = cartResponse.data.cartItems;
    for (const item of cartItems) {
      await testUpdate(item.unique_instance_id); // Passez chaque uniqueInstanceId pour mise à jour
    }
  } catch (error) {
    setMessage('Update failed.');
  }
};

// Fonction mise à jour individuelle
const testUpdate = async (uniqueInstanceId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Erreur : utilisateur non authentifié.');
      return;
    }

    await axios.get('https://laravel-react-shop-me.com/sanctum/csrf-cookie', { withCredentials: true });

    const response = await axios.post('https://laravel-react-shop-me.com/api/update-payment-status', {
      unique_instance_id: uniqueInstanceId // Utilisation de l'ID unique
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log(`Update for ${uniqueInstanceId} succeeded!`);
  } catch (error) {
    console.error(`Update for ${uniqueInstanceId} failed.`, error);
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
