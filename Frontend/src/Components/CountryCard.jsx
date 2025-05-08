import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiEye } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../redux/country/countriesSlice';
import CountryDetailsModal from './CountryDetails';

export default function CountryCard({ country }) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { favorites } = useSelector((state) => state.countries);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isFavorite = favorites?.some(fav => fav.cca3 === country.cca3);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFavorite(country.cca3));
    } else {
      dispatch(addFavorite(country));
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03 }}
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative">
          <img 
            src={country.flags.png} 
            alt={`Flag of ${country.name.common}`} 
            className="w-full h-48 object-cover"
          />
          {currentUser && (
            <button 
              onClick={toggleFavorite}
              className={`absolute top-2 right-2 p-2 rounded-full ${isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-700'}`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <FiHeart className={isFavorite ? 'fill-current' : ''} />
            </button>
          )}
        </div>
        
        <div className="p-4 flex justify-between items-center">
          <h3 className="font-bold text-lg">{country.name.common}</h3>
          <button 
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
          >
            <FiEye /> View Details
          </button>
        </div>
      </motion.div>

      <CountryDetailsModal
        country={country}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}