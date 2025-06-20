import React, { useState, useEffect } from "react";
import { MapPin, Globe, Building2, Gift, Users, Clock, Sparkles } from "lucide-react";

export default function SpecialGiveAwayCard() {
  const [participantCount, setParticipantCount] = useState(847);
  const [isHovered, setIsHovered] = useState(false);
  const [sparkles, setSparkles] = useState([]);

  // Simulate real-time participant count updates
  useEffect(() => {
    const interval = setInterval(() => {
      setParticipantCount(prev => Math.min(prev + Math.floor(Math.random() * 3), 1000));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Generate sparkle positions
  useEffect(() => {
    const newSparkles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setSparkles(newSparkles);
  }, []);

  const levels = [
    { name: "District", icon: Building2, color: "text-blue-300", bgColor: "bg-gradient-to-r from-blue-500 to-blue-600" },
    { name: "State", icon: MapPin, color: "text-green-300", bgColor: "bg-gradient-to-r from-green-500 to-emerald-600" },
    { name: "National", icon: Globe, color: "text-orange-300", bgColor: "bg-gradient-to-r from-orange-500 to-red-600" }
  ];

  const progressPercentage = (participantCount / 1000) * 100;
  const spotsLeft = 1000 - participantCount;

  return (
    <div 
      className="relative overflow-hidden flex flex-col lg:flex-row bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-3xl shadow-2xl p-8 my-8 items-center min-h-[420px] transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute w-2 h-2 bg-white rounded-full animate-pulse"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              animationDelay: `${sparkle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Shapes */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-6 left-6 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000" />

      {/* Left: Giveaway Info */}
      <div className="flex-1 pr-0 lg:pr-10 z-10">
        {/* Header with Animation */}
        <div className="flex items-center justify-between mb-6 w-full">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`text-4xl transition-transform duration-300 ${isHovered ? 'animate-bounce' : ''}`}>
                🎁
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">
                Special Giveaway
              </h3>
              <div className="flex items-center gap-2 text-purple-100">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Limited Time Offer</span>
              </div>
            </div>
          </div>
          
          {/* Prize Info - Right Aligned */}
          <div className="text-right">
            <div className="text-yellow-300 font-bold text-2xl mb-1">
              🏆 Android Tablet
            </div>
            <div className="text-white font-bold text-xl bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              ₹25,000
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-semibold">Participation Progress</span>
            <span className="text-emerald-100 text-sm font-medium">
              {participantCount}/1000
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 mb-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-pink-400 to-yellow-400 h-full rounded-full transition-all duration-1000 relative"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-pink-200">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Only {spotsLeft} spots left!</span>
          </div>
        </div>

        {/* Description */}
        <div className="text-white/95 text-lg mb-6 leading-relaxed">
          <strong>1 lucky winner</strong> from the first 1000 participants can win at three exciting levels:
        </div>

        {/* Levels with Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {levels.map((level, index) => {
            const Icon = level.icon;
            return (
              <div 
                key={level.name}
                className={`flex flex-col items-center gap-3 p-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl ${level.bgColor} text-white`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-lg">{level.name}</span>
                <span className="text-sm opacity-90">Level</span>
              </div>
            );
          })}
        </div>

        {/* Prize Description - Removed */}

        {/* CTA Button */}
        <button className="group relative w-full lg:w-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <div className="flex items-center justify-center gap-3">
            <Gift className="w-5 h-5 group-hover:animate-bounce" />
            <span className="text-lg">Participate Now</span>
            <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </button>
      </div>

      {/* Right: Android Tablet Mockup */}
      <div className="flex-1 flex justify-center mt-8 lg:mt-0 z-10">
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
          
          {/* Tablet Container */}
          <div className="relative bg-gray-900 rounded-2xl p-3 shadow-2xl transform hover:rotate-1 transition-transform duration-300">
            {/* Screen */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 aspect-[4/3] w-80">
              {/* Screen Content */}
              <div className="h-full flex flex-col">
                {/* Status Bar */}
                <div className="flex justify-between items-center mb-4 text-xs text-gray-600">
                  <span>9:41 AM</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-green-500 rounded-full" />
                    <div className="w-1 h-1 bg-green-500 rounded-full" />
                    <div className="w-1 h-1 bg-green-500 rounded-full" />
                  </div>
                </div>
                
                {/* App Icons Grid */}
                <div className="grid grid-cols-4 gap-3 flex-1">
                  {Array.from({ length: 12 }, (_, i) => (
                    <div 
                      key={i} 
                      className={`rounded-xl aspect-square ${
                        i % 4 === 0 ? 'bg-gradient-to-br from-blue-500 to-purple-600' :
                        i % 4 === 1 ? 'bg-gradient-to-br from-green-500 to-teal-600' :
                        i % 4 === 2 ? 'bg-gradient-to-br from-orange-500 to-red-600' :
                        'bg-gradient-to-br from-purple-500 to-pink-600'
                      } shadow-sm`}
                    />
                  ))}
                </div>
                
                {/* Bottom Dock */}
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div 
                      key={i} 
                      className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg shadow-sm"
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Home Button */}
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full" />
          </div>
          
          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 text-2xl animate-bounce delay-500">⭐</div>
          <div className="absolute -bottom-2 -left-2 text-lg animate-bounce delay-1000">💎</div>
        </div>
      </div>
    </div>
  );
}