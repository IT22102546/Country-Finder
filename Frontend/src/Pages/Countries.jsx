import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCountries } from '../redux/country/countriesSlice';
import { FiSearch, FiFilter, FiX, FiArrowLeft } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CountryCard from '../Components/CountryCard';

export default function Countries() {
  const dispatch = useDispatch();
  const { countries, status, error } = useSelector((state) => state.countries);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [previousFilters, setPreviousFilters] = useState({
    searchTerm: '',
    regionFilter: '',
    languageFilter: '',
    searchTriggered: false
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  // Extract filters from URL query params on initial load
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const region = searchParams.get('region');
    const language = searchParams.get('language');
    
    if (region) {
      setRegionFilter(region);
    }
    if (language) {
      setLanguageFilter(language);
    }
    
    if (region || language) {
      setSearchTriggered(true);
    }
  }, [location.search]);

  // Extract unique languages from all countries
  const allLanguages = useMemo(() => {
    const languages = new Set();
    countries.forEach(country => {
      if (country.languages) {
        Object.values(country.languages).forEach(lang => languages.add(lang));
      }
    });
    return Array.from(languages).sort();
  }, [countries]);

  const handleSearch = () => {
    // Save current filters before applying new search
    setPreviousFilters({
      searchTerm,
      regionFilter,
      languageFilter,
      searchTriggered
    });
    setSearchTriggered(true);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const updateURLParams = () => {
    const searchParams = new URLSearchParams();
    
    if (regionFilter) {
      searchParams.set('region', regionFilter);
    }
    if (languageFilter) {
      searchParams.set('language', languageFilter);
    }
    
    navigate(`/countries?${searchParams.toString()}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setRegionFilter('');
    setLanguageFilter('');
    setSearchTriggered(false);
    navigate('/countries'); // Clear URL params when clearing filters
  };

  const restorePreviousFilters = () => {
    setSearchTerm(previousFilters.searchTerm);
    setRegionFilter(previousFilters.regionFilter);
    setLanguageFilter(previousFilters.languageFilter);
    setSearchTriggered(previousFilters.searchTriggered);
    updateURLParams();
  };

  const filteredCountries = useMemo(() => {
    let filtered = countries;

    if (regionFilter) {
      filtered = filtered.filter(country => country.region === regionFilter);
    }

    if (languageFilter) {
      filtered = filtered.filter(country => 
        country.languages && 
        Object.values(country.languages).includes(languageFilter)
      );
    }

    if (searchTriggered && searchTerm.trim()) {
      filtered = filtered.filter(country =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [countries, searchTerm, regionFilter, languageFilter, searchTriggered]);

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow overflow-hidden">
              <Skeleton height={160} />
              <div className="p-4">
                <Skeleton count={4} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
        <button
          onClick={() => dispatch(fetchCountries())}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8 items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-1/2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <button onClick={handleSearch}>
              <FiSearch className="text-gray-400 hover:text-gray-600" />
            </button>
          </div>
          <input
            type="text"
            placeholder="Search countries by name..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyPress}
          />
          {(searchTerm || regionFilter || languageFilter) && (
            <button
              onClick={clearFilters}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <FiX className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-3 w-full md:w-auto">
          {/* Region Filter */}
          <div className="relative">
            <select
              value={regionFilter}
              onChange={(e) => {
                setRegionFilter(e.target.value);
                // Update URL with both filters
                const searchParams = new URLSearchParams();
                if (e.target.value) {
                  searchParams.set('region', e.target.value);
                }
                if (languageFilter) {
                  searchParams.set('language', languageFilter);
                }
                navigate(`/countries?${searchParams.toString()}`);
              }}
              className="appearance-none pl-4 pr-10 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
            >
              <option value="">All Regions</option>
              <option value="Africa">Africa</option>
              <option value="Americas">Americas</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Oceania">Oceania</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Language Filter */}
          <div className="relative">
            <select
              value={languageFilter}
              onChange={(e) => {
                setLanguageFilter(e.target.value);
                // Update URL with both filters
                const searchParams = new URLSearchParams();
                if (regionFilter) {
                  searchParams.set('region', regionFilter);
                }
                if (e.target.value) {
                  searchParams.set('language', e.target.value);
                }
                navigate(`/countries?${searchParams.toString()}`);
              }}
              className="appearance-none pl-4 pr-10 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white"
            >
              <option value="">All Languages</option>
              {allLanguages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Countries Grid */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <motion.div
                key={country.cca3}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CountryCard country={country} />
              </motion.div>
            ))
          ) : (
            <motion.div
              className="col-span-full text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-gray-500 text-lg">
                No countries found matching your filters.
              </div>
              {(searchTerm || regionFilter || languageFilter) && (
                <div className="mt-4 flex justify-center gap-4">
                  <button
                    onClick={restorePreviousFilters}
                    className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
                  >
                    <FiArrowLeft /> Go Back
                  </button>
                  <button
                    onClick={clearFilters}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}