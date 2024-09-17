import React from 'react';
import { CiSearch } from 'react-icons/ci';
import { FaDumbbell } from 'react-icons/fa';
import { MdMenu } from 'react-icons/md';
import { PiShoppingCartThin } from 'react-icons/pi';
import ResponsiveMenu from './ResponsiveMenu';
import Logo from '../../assets/logoshop.png'; // Changez l'extension pour .png

const Navbar = () => {
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <nav>
                <div className="container flex justify-between items-center py-8">
                    {/*Logo*/}
                    <div className='text-4xl flex items-center gap-2 font-bold uppercase'>
                        <img src={Logo} alt="Site Logo" className="h-40 w-auto" />
                    </div>
                    {/*Menu*/}
                    <div className='hidden md:block'>
                        <ul className='flex items-center gap-6 text-gray-600'>
                            <li>
                                <a href="/" className='inline-block py-1 px-3 hover:text-primary font-semibold'>Produits</a>
                            </li>
                            <li>
                                <a href="/contact" className='inline-block py-1 px-3 hover:text-primary font-semibold'>Contact</a>
                            </li>
                        </ul>
                    </div>
                    {/*Icons*/}
                    <div>
                        <button className='text-2xl hover:bg-primary hover:text-white rounded-full p-2 duration-200'>
                            <CiSearch />
                        </button>
                        <button className='text-2xl hover:bg-primary hover:text-white rounded-full p-2 duration-200'>
                            <PiShoppingCartThin />
                        </button>
                        <a href="/login">
                            <button className='hover:bg-primary text-primary font-semibold hover:text-white rounded-md border-2 border-primary px-6 py-2 duration-200 hidden md:block'>
                                Login
                            </button>
                        </a>
                    </div>
                    {/*Mobile menu*/}
                    <div className="md:hidden" onClick={() => setOpen(!open)}>
                        <MdMenu className='text-4xl' />
                    </div>
                </div>
            </nav>

            {/*Mobile Sidebar*/}
            <ResponsiveMenu open={open} />
        </>
    );
}

export default Navbar;
