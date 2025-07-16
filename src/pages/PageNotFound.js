import React, { useState, useEffect } from 'react';
import { Ghost, ArrowLeft, BookOpen, Coffee, Cat, Lightbulb } from 'lucide-react';

export default function PageNotFound() {
  const [currentExcuse, setCurrentExcuse] = useState(0);
  const [isWiggling, setIsWiggling] = useState(false);

  const excuses = [
    "The page went to get coffee and never came back ☕",
    "404: Page is probably procrastinating like you right now 😴",
    "This page is hiding from its responsibilities (relatable) 📚",
    "The page got lost in the library... it's been 3 days 📖",
    "Error 404: Page is having an existential crisis 🤔",
    "The page is stuck in traffic... internet traffic 🚗",
    "404: Page decided to drop out and become a TikTok influencer 📱",
    "This page is taking a mental health day 🧠",
    "The page is in another castle (wrong game, sorry) 🏰",
    "404: Page is currently ghosting you 👻"
  ];

  const tips = [
    "Pro tip: Check your spelling! (We won't judge... much)",
    "Fun fact: 73% of broken links are caused by typos",
    "Reminder: Even Google makes mistakes sometimes",
    "Plot twist: Maybe the page never existed 🤯",
    "Life hack: Try using the search function"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExcuse((prev) => (prev + 1) % excuses.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleGhostClick = () => {
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 600);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 text-center px-4 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute top-10 left-10 opacity-20">
        <BookOpen className="w-8 h-8 text-blue-400 animate-pulse" />
      </div>
      <div className="absolute top-20 right-20 opacity-20">
        <Coffee className="w-6 h-6 text-brown-400 animate-bounce" style={{ animationDelay: '1s' }} />
      </div>
      <div className="absolute bottom-20 left-20 opacity-20">
        <Cat className="w-10 h-10 text-orange-400 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      <div className="absolute bottom-10 right-10 opacity-20">
        <Lightbulb className="w-7 h-7 text-yellow-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="max-w-2xl w-full flex flex-col items-center z-10">
        {/* Interactive Ghost */}
        <div 
          className={`cursor-pointer transition-transform duration-300 ${isWiggling ? 'animate-ping' : 'hover:scale-110'}`}
          onClick={handleGhostClick}
        >
          <Ghost className="w-24 h-24 text-purple-500 mb-4 animate-bounce" />
        </div>

        {/* Main Title */}
        <div className="mb-6">
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            Oops! This Page Played Hide & Seek
          </h2>
          <p className="text-lg text-gray-700 font-medium">
            ...and it's really, REALLY good at hiding 🙈
          </p>
        </div>

        {/* Rotating Excuses */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-xl border border-purple-200 min-h-[100px] flex items-center justify-center">
          <p className="text-lg text-gray-700 font-medium transition-all duration-500 transform">
            {excuses[currentExcuse]}
          </p>
        </div>

        {/* Fun Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8 w-full max-w-md">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-xl shadow-lg">
            <div className="text-2xl font-bold">∞</div>
            <div className="text-sm opacity-90">Possible Pages</div>
          </div>
          <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-4 rounded-xl shadow-lg">
            <div className="text-2xl font-bold">1</div>
            <div className="text-sm opacity-90">Page Found (Not This One)</div>
          </div>
        </div>

        {/* Random Tip */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-6 max-w-md">
          <p className="text-yellow-800 font-medium">
            💡 {tips[Math.floor(Math.random() * tips.length)]}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform hover:-translate-y-1"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Take Me Home
          </button>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform hover:-translate-y-1"
          >
            Go Back & Try Again
          </button>
        </div>

        {/* Encouraging Message */}
        <div className="mt-8 p-4 bg-green-100 border border-green-300 rounded-xl max-w-md">
          <p className="text-green-800 font-medium">
            🌟 Hey, at least you found something cool! This 404 page is pretty awesome, right?
          </p>
        </div>

        {/* Fun Footer */}
        <div className="mt-6 text-sm text-gray-500">
          <p>Page last seen: Never 🤷‍♂️</p>
          <p className="mt-1">Reward if found: One virtual high-five ✋</p>
        </div>
      </div>
    </div>
  );
}