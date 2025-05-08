import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCountries } from '../redux/country/countriesSlice';
import { FiGlobe, FiStar, FiTrendingUp, FiArrowRight, FiCompass } from 'react-icons/fi';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useNavigate } from 'react-router-dom';
import CountryCard from '../Components/CountryCard';

const regions = [
  {
    name: 'Europe',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  {
    name: 'Asia',
    image: 'https://images.unsplash.com/photo-1536599424071-0b215a388ba7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  {
    name: 'Africa',
    image: 'https://images.unsplash.com/photo-1442530792250-81629236fe54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  {
    name: 'Americas',
    image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
  },
  {
    name: 'Oceania',
    image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1530&q=80'
  }
];

const FeatureCard = ({ icon, title, description, color }) => {
  return (
    <motion.div 
      whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className={`bg-white p-6 rounded-2xl shadow-lg border-t-4 ${color} transition-all duration-300`}
    >
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-full ${color.replace('border', 'bg')} bg-opacity-10 mr-4`}>
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const SectionTitle = ({ icon, title, subtitle }) => {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center justify-center p-3 rounded-full bg-blue-100 text-blue-600 mb-4">
        {icon}
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
    </div>
  );
};

const AnimatedRegionCard = ({ region, onClick }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const regionData = regions.find(r => r.name === region);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      className="relative rounded-2xl overflow-hidden shadow-lg h-64 cursor-pointer group"
      onClick={() => onClick(region)}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
      <div className="absolute inset-0 flex items-end p-6 z-20">
        <div>
          <h3 className="text-white text-2xl font-bold mb-2 group-hover:text-blue-300 transition-colors">{region}</h3>
          <div className="flex items-center text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Explore</span>
            <FiArrowRight className="ml-2" />
          </div>
        </div>
      </div>
      <img 
        src={regionData.image}
        alt={region}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
    </motion.div>
  );
};

const ExploreButton = ({ onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 10px 25px -5px rgba(255, 255, 255, 0.3)"
      }}
      whileTap={{ scale: 0.95 }}
      className="relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 group-hover:from-blue-700 group-hover:to-blue-800 rounded-full"></div>
      <div className="relative flex items-center justify-center px-8 py-4 text-white font-bold text-lg">
        <motion.span
          initial={{ x: 0 }}
          animate={{ x: [0, 5, 0] }}
          transition={{ 
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut"
          }}
          className="inline-flex items-center"
        >
          Explore the World <FiArrowRight className="ml-2" />
        </motion.span>
        <motion.div 
          className="absolute left-0 top-0 h-full w-0 bg-white bg-opacity-20 group-hover:w-full"
          initial={{ width: 0 }}
          whileHover={{ width: '100%' }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </motion.button>
  );
};

export default function Home() {
  const dispatch = useDispatch();
  const { countries, status, error } = useSelector((state) => state.countries);
  const [featuredCountries, setFeaturedCountries] = useState([]);
  const navigate = useNavigate();
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  useEffect(() => {
    if (countries.length > 0) {
      const shuffled = [...countries].sort(() => 0.5 - Math.random());
      setFeaturedCountries(shuffled.slice(0, 4));
    }
  }, [countries]);

  const handleExploreClick = () => {
    navigate('/countries');
  };

  const handleRegionClick = (region) => {
    navigate(`/countries?region=${encodeURIComponent(region)}`);
  };

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <Skeleton height={200} />
              <div className="p-6">
                <Skeleton width="60%" height={24} />
                <Skeleton count={3} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md mx-auto bg-red-50 border-l-4 border-red-500 p-6 rounded-lg"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Error loading countries</h3>
              <p className="text-sm text-red-700 mt-2">
                {error}
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Home
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => dispatch(fetchCountries())}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Try Again
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Discover <span className="text-blue-200">the World</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed">
              Explore breathtaking destinations, immerse in diverse cultures, and find your next adventure
            </p>
          </motion.div>
          
          {/* Explore Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ExploreButton onClick={handleExploreClick} />
          </motion.div>
        </div>
        
        {/* Decorative elements */}
        <motion.div 
          animate={{
            x: [0, 10, 0],
            y: [0, 5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-16 h-16 rounded-full bg-blue-400 opacity-20 blur-xl"
        />
        <motion.div 
          animate={{
            x: [0, -15, 0],
            y: [0, 10, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-10 right-10 w-24 h-24 rounded-full bg-blue-500 opacity-15 blur-xl"
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Features Section */}
        <motion.section 
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={{
            visible: { 
              opacity: 1,
              transition: { staggerChildren: 0.2 }
            },
            hidden: { opacity: 0 }
          }}
          className="mb-20"
        >
          <SectionTitle 
            icon={<FiGlobe className="text-2xl" />}
            title="Explore With Ease"
            subtitle="Discover the world's wonders with our comprehensive travel platform"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 50 }
              }}
            >
              <FeatureCard
                icon={<FiCompass className="text-blue-600 text-xl" />}
                title="Detailed Guides"
                description="Get in-depth information about every country's culture, attractions, and more."
                color="border-blue-500"
              />
            </motion.div>
            <motion.div
              variants={{
                visible: { opacity: 1, y: 0, transition: { delay: 0.2 } },
                hidden: { opacity: 0, y: 50 }
              }}
            >
              <FeatureCard
                icon={<FiTrendingUp className="text-green-600 text-xl" />}
                title="Trending Destinations"
                description="Discover the most popular travel spots based on real traveler data."
                color="border-green-500"
              />
            </motion.div>
            <motion.div
              variants={{
                visible: { opacity: 1, y: 0, transition: { delay: 0.4 } },
                hidden: { opacity: 0, y: 50 }
              }}
            >
              <FeatureCard
                icon={<FiStar className="text-yellow-600 text-xl" />}
                title="Personalized Recommendations"
                description="Get custom travel suggestions based on your preferences."
                color="border-yellow-500"
              />
            </motion.div>
          </div>
        </motion.section>

        {/* Featured Destinations */}
        <section className="mb-20">
          <SectionTitle 
            icon={<FiStar className="text-2xl" />}
            title="Featured Destinations"
            subtitle="Handpicked countries that will inspire your next journey"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredCountries.map((country, index) => (
              <motion.div 
                key={country.cca3}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -10 }}
                className="cursor-pointer"
                onClick={() => navigate(`/countries/${country.cca3}`)}
              >
                <CountryCard country={country} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Popular Regions */}
        <section className="mb-20">
          <SectionTitle 
            icon={<FiTrendingUp className="text-2xl" />}
            title="Explore by Region"
            subtitle="Discover the unique characteristics of each part of our world"
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {regions.map((region, index) => (
              <AnimatedRegionCard 
                key={region.name} 
                region={region.name} 
                onClick={handleRegionClick}
              />
            ))}
          </div>
        </section>

        {/* Travel Tips */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-3xl shadow-xl p-12 mb-16 overflow-hidden relative"
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-200 opacity-20"></div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-blue-300 opacity-15"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Travel Tips & Insights</h2>
            <p className="text-lg text-gray-700 mb-8 max-w-3xl">
              Essential knowledge to make your travels smoother, safer, and more enjoyable.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-md"
              >
                <h3 className="font-bold text-xl mb-3 text-blue-700">Best Time to Travel</h3>
                <p className="text-gray-700">
                  Discover the ideal seasons to visit different regions around the world based on weather, crowds, and local events.
                </p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-md"
              >
                <h3 className="font-bold text-xl mb-3 text-green-700">Cultural Etiquette</h3>
                <p className="text-gray-700">
                  Learn about customs, traditions, and social norms to respect local cultures wherever you go.
                </p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="bg-white bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-md"
              >
                <h3 className="font-bold text-xl mb-3 text-yellow-700">Budget Planning</h3>
                <p className="text-gray-700">
                  Practical tips on managing expenses, finding deals, and making the most of your travel budget.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready for Your Next Adventure?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Start exploring the world today. Find your perfect destination and create unforgettable memories.
          </p>
          <ExploreButton onClick={handleExploreClick} />
        </motion.div>
      </div>
    </div>
  );
}