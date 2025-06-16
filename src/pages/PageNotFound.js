// === src/pages/PageNotFound.js ===
import React from 'react';
import { Link } from 'react-router-dom';
import { Ghost, ArrowLeft } from 'lucide-react';

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-tr from-pink-50 via-blue-50 to-purple-100 text-center px-4">
      <div className="max-w-xl w-full flex flex-col items-center">
        <Ghost className="w-20 h-20 text-purple-500 mb-4 animate-bounce" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-2">Oops! Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-6">
          We looked everywhere — under the bed, in the spelling book, even behind the grammar rules — but we couldn’t find this page.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow hover:shadow-lg hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}