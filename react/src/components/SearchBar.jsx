import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { debounce } from 'lodash';

const SearchBar = ({ setResults }) => {
    const [query, setQuery] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const handleSearch = debounce(async (value) => {
        try {
            const response = await axios.get(`https://laravel-react-shop-me.com/api/search?query=${value}`);
            setResults(response.data);
        } catch (error) {
            console.error('Erreur lors de la recherche', error);
        }
    }, 300); // Attendre 300ms après que l'utilisateur ait fini de taper

    useEffect(() => {
        if (query) {
            handleSearch(query);
        }
    }, [query]);

    return (
        <div className="relative">
            <FontAwesomeIcon
                icon={faSearch}
                onClick={() => setIsSearchVisible(!isSearchVisible)}
                className="cursor-pointer text-gray-600"
            />
            {isSearchVisible && (
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher un produit..."
                    className="border rounded px-4 py-2 absolute top-0 left-8"
                    style={{ width: '200px' }} // Ajustez la largeur si nécessaire
                />
            )}
        </div>
    );
};

export default SearchBar;
