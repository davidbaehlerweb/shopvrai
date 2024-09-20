import React, { useEffect, useState } from 'react';
import { NavbarMenu } from '../../mockData/data'
import { CiSearch } from 'react-icons/ci'
import { FaDumbbell } from 'react-icons/fa'
import axios from 'axios';
import { MdMenu } from 'react-icons/md'
import { PiShoppingCartThin } from 'react-icons/pi'
import ResponsiveMenu from './ResponsiveMenu';
import { useNavigate } from 'react-router-dom';
import './navbar.css';
import ResponsiveMenuClient from './ResponsiveMenuClient';
import Logo from '../../assets/logoshop.png'; // Changez l'extension pour .png

const NavbarAdmin = () => {
    const [open, setOpen] = React.useState(false);
    const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true); // Ajouter l'état de chargement
  const [isFixed, setIsFixed] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/api/logout', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Supprime le token du stockage local
      localStorage.removeItem('token');
      setShowModal(true); 

      setTimeout(() => {
          navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Utilisation correcte de l'authorization
          }
        });
        setUser(response.data.user);
      } catch (err) {
        setError('Unable to fetch user data');
        console.error(err);
      }finally{
        setLoading(false)
      }
    };

    fetchUser();
  

  const handleScroll = () => {
    if (window.scrollY > 0) {
        setIsFixed(true);
    } else {
        setIsFixed(false);
    }
};

window.addEventListener('scroll', handleScroll);

return () => {
    window.removeEventListener('scroll', handleScroll);
};
}, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return (
        
    <div role="status">
        <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>

    </div>

    );
}
    return (

        <>

            



            <nav className={isFixed ? 'navbar-fixed' : ''}>
                <div className="container flex justify-between items-center py-8">
                    {/*Logo  */}
                    <div className='text-4xl flex items-center gap-2 font-bold uppercase'>
                <img src={Logo} alt="Site Logo" className="h-40 w-auto" />
            </div>
                    {/*Menu  */}
                    <div className='hidden md:block'>
                        <ul className='flex items-center gap-6 text-gray-600'>


                            
                            <li>
                                <a href="/produitsAdmin" className='inline-block py-1 px-3 hover:text-primary
                                        font-semibold'>Produits</a>
                            </li>
                            
                            <li>
                                <a href="/contact" className='inline-block py-1 px-3 hover:text-primary
                                        font-semibold'>Contact</a>
                            </li>
                            <li>
                                <a href="/monCompte" className='inline-block py-1 px-3 hover:text-primary
                                        font-semibold'>Mon compte</a>
                            </li>


                        </ul>
                    </div>
                    {/*Icons  */}
                    <div>
                        
                        <button onClick={handleLogout} className='hove:bg-primary text-primary
                        font-semibold hover:text-white rounded-md border-2
                        border-primary px-6 py-2 duration-200 hidden md:block'>
                            Logout
                        </button>
                    </div>
                    {/*Mobile  menu*/}
                    <div className="md:hidden" onClick={() => setOpen(!open)}>
                        <MdMenu className='text-4xl' />
                    </div>
                </div>
            </nav>

            {/*Mobile Sidebar*/}
            <ResponsiveMenuClient open={open} handleLogout={handleLogout} />

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-5 shadow-lg max-w-sm">
                        <h3 className="text-xl font-bold">Déconnexion réussie !</h3>
                        <p className="mt-2">Vous êtes déconnecté avec succès.</p>
                    </div>
                </div>
            )}
        </>
    )
}

export default NavbarAdmin
