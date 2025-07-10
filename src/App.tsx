import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useEffect } from 'react';
import { analytics } from './lib/firebase';
import { logEvent } from 'firebase/analytics';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import BookUs from './pages/BookUs';
import Footer from './components/Footer';

// Protected route wrapper
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" />;
  return children;
}

// Main App
function App() {
  useEffect(() => {
    logEvent(analytics, 'app_initialized');
  }, []);

  return (
    <AuthProvider>
      <Router>
        <MainLayout />
      </Router>
    </AuthProvider>
  );
}

// Extract layout for route-level logic (like showing banner only on home)
function MainLayout() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* ✅ Cover Banner Image (only on homepage) */}
      {location.pathname === '/' && (
        <img
          src="images/vblush-email-banner.png"
          alt="Vblush Email Banner"
          className="w-full h-auto max-h-[300px] md:max-h-[400px] lg:max-h-[600px] object-cover"
        />
      )}

      <AnimatePresence mode="wait">
        <motion.main
          className="flex-grow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/book-us" element={<BookUs />} />
          </Routes>
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default App;

