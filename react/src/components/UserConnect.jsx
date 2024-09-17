import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserConnect = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Remplacez cela par votre méthode d'authentification
          }
        });
        setUser(response.data.user);
      } catch (err) {
        setError('Unable to fetch user data');
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
    </div>
  );
};

export default UserConnect;
