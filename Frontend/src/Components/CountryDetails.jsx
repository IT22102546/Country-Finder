import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMapPin, FiUsers, FiGlobe, FiClock, FiDollarSign } from 'react-icons/fi';

export default function CountryDetailsModal({ country, isOpen, onClose }) {
  if (!country || !isOpen) return null;

  // Format currencies for display
  const formatCurrencies = () => {
    if (!country.currencies) return 'N/A';
    return Object.entries(country.currencies).map(([code, currency]) => (
      `${currency.name} (${currency.symbol || code})`
    )).join(', ');
  };

  // Format timezones for display
  const formatTimezones = () => {
    if (!country.timezones) return 'N/A';
    return country.timezones.join(', ');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with flag and close button - Improved flag display */}
          <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <img 
                src={country.flags.svg || country.flags.png} 
                alt={`Flag of ${country.name.common}`} 
                className="max-w-full max-h-full object-contain shadow-md border border-gray-200 dark:border-gray-600"
                style={{ aspectRatio: '3/2' }} // Maintain flag aspect ratio
              />
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/90 dark:bg-gray-700/90 rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
              aria-label="Close modal"
            >
              <FiX className="text-gray-800 dark:text-white text-xl" />
            </button>
          </div>

          {/* Country name and basic info */}
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {country.name.common}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {country.name.official}
                </p>
              </div>
              <div className="mt-4 md:mt-0 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full">
                {country.region} {country.subregion && `• ${country.subregion}`}
              </div>
            </div>

            {/* Information sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column */}
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
                  <h3 className="flex items-center text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    <FiMapPin className="mr-2 text-blue-500" />
                    Geography
                  </h3>
                  <div className="space-y-3">
                    <InfoItem 
                      label="Capital" 
                      value={country.capital?.join(', ') || 'N/A'} 
                    />
                    <InfoItem 
                      label="Area" 
                      value={`${country.area.toLocaleString()} km²`} 
                    />
                    <InfoItem 
                      label="Borders" 
                      value={country.borders?.join(', ') || 'None'} 
                    />
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
                  <h3 className="flex items-center text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    <FiUsers className="mr-2 text-green-500" />
                    Demographics
                  </h3>
                  <div className="space-y-3">
                    <InfoItem 
                      label="Population" 
                      value={country.population.toLocaleString()} 
                    />
                    <InfoItem 
                      label="Languages" 
                      value={Object.values(country.languages || {}).join(', ') || 'N/A'} 
                    />
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
                  <h3 className="flex items-center text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    <FiGlobe className="mr-2 text-purple-500" />
                    General Info
                  </h3>
                  <div className="space-y-3">
                    <InfoItem 
                      label="Country Code" 
                      value={country.cca3} 
                    />
                    <InfoItem 
                      label="TLD" 
                      value={country.tld?.join(', ') || 'N/A'} 
                    />
                    <InfoItem 
                      label="UN Member" 
                      value={country.unMember ? 'Yes' : 'No'} 
                    />
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
                  <h3 className="flex items-center text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    <FiDollarSign className="mr-2 text-yellow-500" />
                    Economy & Time
                  </h3>
                  <div className="space-y-3">
                    <InfoItem 
                      label="Currencies" 
                      value={formatCurrencies()} 
                    />
                    <InfoItem 
                      label="Timezones" 
                      value={formatTimezones()} 
                    />
                    <InfoItem 
                      label="Driving Side" 
                      value={country.car?.side ? country.car.side.charAt(0).toUpperCase() + country.car.side.slice(1) : 'N/A'} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps link */}
            {country.maps?.googleMaps && (
              <div className="mt-8 text-center">
                <a
                  href={country.maps.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  View on Google Maps
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex">
      <span className="font-medium text-gray-600 dark:text-gray-300 w-32 flex-shrink-0">
        {label}:
      </span>
      <span className="text-gray-800 dark:text-white">
        {value}
      </span>
    </div>
  );
}