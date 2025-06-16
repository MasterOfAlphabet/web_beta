// components/SignInRequiredHero.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Star, Gift, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const SignInRequiredHero = ({ className = '' }) => {
  const navigate = useNavigate();

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative max-w-7xl mx-auto px-4 py-12"
      >
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
                onClick={() => navigate('/signin')}
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-3 mx-auto"
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
                onClick={() => navigate('/signup')}
                className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-3 mx-auto"
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
      </motion.div>
    </div>
  );
};

export default SignInRequiredHero;