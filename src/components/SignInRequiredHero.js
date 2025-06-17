import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, UserPlus, Star, Gift, Shield, Sparkles, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Props:
 * - redirectTo: string (optional) - where to redirect after successful sign-in
 * - onClose: function (optional) - called when user clicks outside, presses Escape, or hits Back/Cancel
 * - open: boolean (default true) - controls overlay/modal visible state
 * - className: string (optional) - extra classes for root
 */
const SignInRequiredHero = ({
  redirectTo,
  onClose,
  open = true,
  className = '',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const overlayRef = useRef();

  // Handle Escape key and click-outside
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (onClose) onClose();
      }
    }
    function handleClickOutside(e) {
      if (
        overlayRef.current &&
        e.target instanceof Element &&
        overlayRef.current === e.target
      ) {
        if (onClose) onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose]);

  // Redirect after sign-in if token/session detected (simulate check)
  useEffect(() => {
    if (!open) return;
    // This should be replaced with actual auth/session logic
    // For demonstration, look for "?signedin=1" in query string
    const params = new URLSearchParams(location.search);
    if (params.has('signedin') && params.get('signedin') === '1') {
      // Redirect to redirectTo or home
      navigate(redirectTo || '/', { replace: true });
    }
  }, [location, navigate, redirectTo, open]);

  // Handlers
  const handleSignIn = () => {
    // Redirect to sign-in. Pass redirectTo in location state or query.
    let path = '/signin';
    if (redirectTo) {
      path += '?redirectTo=' + encodeURIComponent(redirectTo);
    }
    navigate(path);
  };

  const handleSignUp = () => {
    // Redirect to sign-up. Pass redirectTo in location state or query.
    let path = '/signup';
    if (redirectTo) {
      path += '?redirectTo=' + encodeURIComponent(redirectTo);
    }
    navigate(path);
  };

  // Overlay/modal animation config
  const overlayVariants = {
    hidden: { opacity: 0, pointerEvents: 'none' },
    visible: { opacity: 1, pointerEvents: 'auto' },
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          className={`fixed inset-0 z-50 bg-black/40 flex items-center justify-center transition-all ${className}`}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-4xl w-full mx-4 px-0 py-0 overflow-hidden"
          >
            {/* Close button */}
            {onClose && (
              <button
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-gray-700 dark:text-white/80 transition"
                aria-label="Close"
                onClick={onClose}
                tabIndex={0}
                type="button"
              >
                <X className="w-6 h-6" />
              </button>
            )}

            <div className="px-4 py-10 md:px-10 md:py-16">
              <motion.div
                className="flex flex-col md:flex-row gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.15 } },
                }}
              >
                {/* Sign In Block */}
                <motion.div
                  className="flex-1 bg-blue-50 dark:bg-blue-900 rounded-3xl p-8 border border-blue-100 dark:border-blue-800 shadow-lg"
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                >
                  <div className="text-center">
                    <div className="flex justify-center mb-6">
                      <div className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                        <Sparkles className="h-4 w-4" />
                        <span>Sign In Required</span>
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-blue-800 dark:text-white mb-4">Welcome Back!</h2>
                    <p className="text-lg text-gray-800 dark:text-gray-300 mb-8 leading-relaxed">
                      Already registered? Sign in to resume your journey.
                    </p>
                    <button
                      onClick={handleSignIn}
                      className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center gap-2 mx-auto"
                      autoFocus
                    >
                      <LogIn className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      Sign In
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>

                {/* Sign Up Block */}
                <motion.div
                  className="flex-1 bg-green-50 dark:bg-green-900 rounded-3xl p-8 border border-green-100 dark:border-green-800 shadow-lg"
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                >
                  <div className="text-center">
                    <div className="flex justify-center mb-6">
                      <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                        <Gift className="h-4 w-4" />
                        <span>100% FREE</span>
                        <Star className="h-4 w-4 fill-yellow-300" />
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-green-800 dark:text-white mb-4">
                      New Here?{' '}
                      <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Join Us
                      </span>
                    </h2>
                    <p className="text-lg text-gray-800 dark:text-gray-300 mb-8 leading-relaxed">
                      No fees, no catch — just full access to explore and grow.
                    </p>
                    <button
                      onClick={handleSignUp}
                      className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center gap-2 mx-auto"
                    >
                      <UserPlus className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      Create Account
                      <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex flex-col items-center p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200/50 rounded-2xl">
                  <Star className="h-6 w-6 fill-yellow-500 text-yellow-600 mb-2" />
                  <p className="font-semibold text-gray-800 dark:text-white">Instant Access</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">No wait — jump in</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-green-50 dark:bg-green-900 border border-green-200/50 rounded-2xl">
                  <Shield className="h-6 w-6 text-green-600 mb-2" />
                  <p className="font-semibold text-gray-800 dark:text-white">Data Safe</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">End-to-end security</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200/50 rounded-2xl">
                  <Gift className="h-6 w-6 text-blue-600 mb-2" />
                  <p className="font-semibold text-gray-800 dark:text-white">Forever Free</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">No credit card ever</p>
                </div>
              </motion.div>

              {/* Back/Cancel button */}
              {onClose && (
                <div className="flex justify-center mt-10">
                  <button
                    className="px-6 py-2 rounded-xl font-semibold border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-white shadow hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                    onClick={onClose}
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SignInRequiredHero;