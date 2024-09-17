import React, { useState } from 'react';
import axios from 'axios';

const Test = () => {
  const [message, setMessage] = useState('');

  const testUpdate = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/update-payment-status",
        { produit_id: 14
        }, // Utilisez un ID de produit existant pour tester
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      console.log('Réponse de mise à jour:', response.data);
      setMessage('Update succeeded!');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut de paiement', error);
      setMessage('Update failed.');
    }
  };

  return (
    <div>
      <button onClick={testUpdate}>Test Update Payment Status</button>
      <p>{message}</p>
    </div>
  );
};

export default Test;
