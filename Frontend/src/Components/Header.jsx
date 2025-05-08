import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { signOut, signInSuccess } from '../redux/user/userSlice';
import { motion } from 'framer-motion';
import { 
  HiMenu, 
  HiX,
  HiHome, 
  HiBookOpen, 
  HiGlobe,
  HiInformationCircle,
  HiUserCircle,
  HiLogout,
  HiHeart
} from 'react-icons/hi';
import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, signInWithPopup, getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Check auth state on component mount
  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          _id: user.uid,
          username: user.displayName,
          email: user.email,
          profilePicture: user.photoURL
        };
        dispatch(signInSuccess(userData));
        sessionStorage.setItem('user', JSON.stringify(userData));
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  const handleSignOut = () => {
    const auth = getAuth(app);
    auth.signOut();
    dispatch(signOut());
    sessionStorage.removeItem('user');
    navigate("/");
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      
      const userData = {
        _id: result.user.uid,
        username: result.user.displayName,
        email: result.user.email,
        profilePicture: result.user.photoURL
      };

      dispatch(signInSuccess(userData));
      sessionStorage.setItem('user', JSON.stringify(userData));
      navigate('/');
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  const navItems = [
    { name: "Home", path: "/", icon: <HiHome className="mr-2" /> },
    { name: "Countries", path: "/countries", icon: <HiGlobe className="mr-2" /> },
    { name: "Favourites", path: "/favourite", icon: <HiHeart className="mr-2" /> },
  ];

  return (
    <header className="bg-blue-900 text-white shadow-lg w-full z-50 sticky top-0">
      <div className="container mx-auto flex items-center justify-between py-3 px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 60 }}
          className="flex items-center"
        >
          <NavLink 
            to="/" 
            className="flex items-center text-2xl font-bold hover:text-white transition-colors"
          >
            <HiGlobe className="text-white mr-2" />
            <span className="hidden sm:inline">Country Finder</span>
          </NavLink>
        </motion.div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center px-3 py-2 rounded-md transition-all
                ${isActive 
                  ? "bg-blue-800 text-white shadow-inner" 
                  : "hover:bg-blue-800 hover:text-white"}
              `}
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}

          {currentUser ? (
            <div className="relative ml-4">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <img
                  src={currentUser.profilePicture || "https://via.placeholder.com/150"}
                  alt={currentUser.username}
                  className="h-10 w-10 rounded-full border-2 border-blue-700 hover:border-white transition-colors"
                />
              </button>

              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-56 bg-blue-800 border border-blue-700 rounded-lg shadow-xl py-2 z-50"
                >
                  <div className="px-4 py-3 border-b border-blue-700">
                    <p className="font-medium text-white">{currentUser.username}</p>
                    <p className="text-sm text-blue-200">{currentUser.email}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-blue-100 hover:bg-blue-700 hover:text-red-300"
                  >
                    <HiLogout className="mr-2" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="ml-4">
              <Button 
                type="button" 
                className="bg-white hover:bg-gray-100 text-blue-900"
                onClick={handleGoogleSignIn}
              >
                <AiFillGoogleCircle className="w-5 h-5 mr-2" />
                Sign in with Google
              </Button>
            </div>
          )}
        </nav>

      
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-blue-900/95 backdrop-blur-sm z-40 md:hidden flex flex-col pt-20 px-6"
            onClick={() => setMenuOpen(false)}
          >
            <div className="space-y-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center text-xl py-4 px-4 rounded-lg transition-all
                    ${isActive 
                      ? "bg-blue-800 text-white" 
                      : "hover:bg-blue-800 hover:text-white"}
                  `}
                >
                  {item.icon}
                  {item.name}
                </NavLink>
              ))}
            </div>

            <div className="mt-auto mb-8">
              {currentUser ? (
                <div className="flex items-center p-4 bg-blue-800 rounded-lg">
                  <img
                    src={currentUser.profilePicture || "https://via.placeholder.com/150"}
                    alt={currentUser.username}
                    className="h-12 w-12 rounded-full border-2 border-blue-700"
                  />
                  <div className="ml-4">
                    <p className="font-medium">{currentUser.username}</p>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center text-sm text-blue-200 hover:text-red-300 mt-1"
                    >
                      <HiLogout className="mr-1" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Button 
                  type="button" 
                  className="w-full bg-white hover:bg-gray-100 text-blue-900"
                  onClick={handleGoogleSignIn}
                >
                  <AiFillGoogleCircle className="w-5 h-5 mr-2" />
                  Sign in with Google
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
}