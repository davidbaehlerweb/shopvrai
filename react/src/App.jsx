import React from 'react'



import { Routes, Route, Router} from 'react-router-dom';
import Contact from './pages/Contact';


import Produits from './pages/Produits';
import Login from './pages/Login';
import Register from './pages/Register';

import ProduitsAdmin from './pages/ProduitsAdmin';
import AddProduits from './pages/produits/AddProduits';
import InfoProduit from './pages/produits/InfoProduit';
import UpdateProduits from './pages/produits/UpdateProduits';
import SearchBar from './components/SearchBar';
import ProduitPasClient from './pages/produits/ProduitPasClient';
import InfoPasCo from './pages/produits/InfoPasCo';
import Panier from './pages/Panier';
import MesCommandes from './pages/MesCommandes';
import Cart from './components/Cart';
import MonCompte from './pages/MonCompte';
import ModifMp from './pages/ModifMp';
import ModifInfo from './pages/ModifInfo';
import ForgotPassword from './components/ForgotPassword';
import Test from './pages/test';
import ResetPassword from './components/ResetPassword';


function App() {


    return (
        <>
            
            <div>
                
                    
                    <Routes>
                        
                       
                        <Route path='/contact' element={<Contact/>}/>
                        <Route path='/mesCommandes' element={<MesCommandes/>}/>
                        <Route path='/' element={<Produits/>}/>
                        
                        <Route path='/produitsAdmin' element={<ProduitsAdmin/>}/>
                        <Route path='/login' element={<Login/>}/>
                        <Route path='/register' element={<Register/>}/>
                        <Route path='/add' element={<AddProduits/>}/>
                        <Route path="/products/:id" element={<InfoProduit />} />
                        <Route path="/productsNon/:id" element={<InfoPasCo />} />
                        <Route path="/edit/:id" element={<UpdateProduits/>} />
                        <Route path="/product/:id" element={<UpdateProduits/>} />
                        {/* Page Panier */}
                        <Route path="/search" element={<SearchBar />} />  
                        <Route path='/panier' element={<Panier/>}/>
                        <Route path='/payer/:prix/:id/:uniqueInstanceId' element={<Cart />} />

                        <Route path='/monCompte' element={<MonCompte/>}/>
                        <Route path='/mp' element={<ModifMp/>}/>
                        <Route path='/modifInfo' element={<ModifInfo/>}/>
                        <Route path='/forgot-password' element={<ForgotPassword/>}/>
                        <Route path='/test' element={<Test/>}/>
                    
                        <Route path='/reset-password/:token' element={<ResetPassword/>}/>
                    </Routes>
                    
                
            </div>
        
        </>
    )
}

export default App
