import { motion, AnimatePresence } from 'framer-motion'
import React from 'react'

const ResponsiveMenuClient = ({ open, handleLogout }) => {
    return (
        <AnimatePresence mode='wait'>
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ duration: 0.3 }}
                    className='absolute top-20 left-0 w-full h-screen z-20'
                >
                    <div className='text-xl font-semibold uppercase bg-primary text-white py-10 m-6 rounded-3xl'>
                        <ul className='flex flex-col justify-center items-center gap-10'>
                            <a href="/"><li>Produits</li></a>
                            <a href="/mesCommandes"><li>Mes Commandes</li></a>
                            <a href="/contact"><li>Contact</li></a>
                            <a href="/monCompte"><li>Mon Compte</li></a>
                            {/* Utilisation de la fonction handleLogout pour déconnecter l'utilisateur */}
                            <li onClick={handleLogout} className="cursor-pointer">Logout</li>
                        </ul>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ResponsiveMenuClient;
