import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Target, 
  BookOpen, 
  TrendingUp, 
  Crown, 
  Star, 
  Zap, 
  Gift,
  Calendar,
  Award,
  Brain,
  BarChart3,
  Sparkles,
  Flame,
  Diamond
} from 'lucide-react';

export default function PremiumSubscriptionPromo() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Click handlers from SubscriptionBanner
  const handleSubscribeClick = () => {
    window.location.href = '/offers-promotions/subscription-plans';
  };

  const handlePromotionClick = (sectionId) => {
    window.location.href = `/offers-promotions#${sectionId}`;
  };

  const features = [
    {
      icon: Trophy,
      title: "Challenges",
      subtitle: "Win exciting prizes",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: Brain,
      title: "Skills Assessment",
      subtitle: "8 modules and 8-in-1 comprehensive testing",
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: BookOpen,
      title: "Word of the Day Series",
      subtitle: "Learn, Practice and Test Your Skills",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: BarChart3,
      title: "Progress Summary",
      subtitle: "Be shown in Leaderboard / Winners list",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: Crown,
      title: "Leaderboards",
      subtitle: "Get the recognition you truly deserve",
      color: "from-amber-400 to-yellow-500"
    }
  ];

  const promotionItems = [
    { icon: '🚀', text: 'Pre-Launch Promotion', bg: 'bg-red-500/30 border-red-400/50', section: 'pre-launch' },
    { icon: '🎟️', text: 'Exclusive Coupon', bg: 'bg-blue-500/30 border-blue-400/50', section: 'exclusive-coupon' },
    { icon: '🎁', text: 'Special GiveAway', bg: 'bg-green-500/30 border-green-400/50', section: 'special-giveaway' },
    { icon: '🔓', text: 'Unlock Rewards', bg: 'bg-orange-500/30 border-orange-400/50', section: 'unlock-rewards' },
    { icon: '🤝', text: 'Collab Challenges', bg: 'bg-purple-500/30 border-purple-400/50', section: 'collab-challenges' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 flex items-center justify-center">
      <div className={`max-w-4xl w-full transform transition-all duration-1000 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        
        {/* Main Card */}
        <div className="bg-gradient-to-br from-purple-800/30 to-blue-800/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-yellow-400 mr-2 animate-pulse" />
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Ready for the Full Experience?
                </h1>
                <Sparkles className="w-8 h-8 text-yellow-400 ml-2 animate-pulse" />
              </div>
              <p className="text-xl text-purple-100 mb-6">
                Excited about what you've seen? Unlock premium features like
              </p>
            </div>

            {/* Premium Features Grid */}
            <div className="flex justify-center items-center space-x-3 md:space-x-4 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group text-center transform hover:scale-110 transition-all duration-300"
                  style={{ animationDelay: `${index * 200}ms` }}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className={`w-16 h-12 md:w-20 md:h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-all duration-300 border-2 border-white/20 group-hover:shadow-lg ${
                    activeFeature === index ? 'shadow-2xl scale-110' : ''
                  }`}>
                    <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <p className="text-xs text-purple-200 font-medium group-hover:text-white transition-colors max-w-20 leading-tight text-center">
                    {feature.title}
                  </p>
                </div>
              ))}
            </div>

            {/* "And Many More" Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-400/30">
                <Star className="w-5 h-5 text-yellow-400 mr-2 animate-spin" />
                <span className="text-lg font-medium text-white">and many more amazing features!</span>
                <Star className="w-5 h-5 text-yellow-400 ml-2 animate-spin" />
              </div>
            </div>

            {/* Still Not Excited Section */}
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Still not excited? 🤔
              </h2>
              <p className="text-xl text-purple-200 mb-6">
                Please take a look at our current sensational
              </p>
              <div className="inline-flex items-center px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <Flame className="w-8 h-8 text-white mr-3 animate-bounce" />
                <span className="text-2xl font-bold text-white">5-in-1 Promotion</span>
                <Flame className="w-8 h-8 text-white ml-3 animate-bounce" />
              </div>
            </div>

            {/* 5-in-1 Promotion Icons - Now Clickable */}
            <div className="flex justify-center items-center space-x-4 md:space-x-8 mb-8">
              {promotionItems.map((item, index) => (
                <div
                  key={index}
                  className="group text-center transform hover:scale-110 transition-all duration-300 cursor-pointer"
                  style={{ animationDelay: `${index * 200}ms` }}
                  onClick={() => handlePromotionClick(item.section)}
                >
                  <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl ${item.bg} backdrop-blur-sm flex items-center justify-center mb-2 group-hover:scale-110 transition-all duration-300 border-2 group-hover:shadow-lg hover:shadow-xl`}>
                    <span className="text-2xl md:text-3xl group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-purple-200 font-medium group-hover:text-white transition-colors">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <p className="text-lg text-purple-200 mb-6">
                Let's make this more visually stunning and should make you excited to join right away!
              </p>
              
              <button 
                className="group relative inline-flex items-center px-8 py-4 text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-purple-500/25 overflow-hidden cursor-pointer"
                onClick={handleSubscribeClick}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center">
                  <Crown className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                  View Subscription Plans
                  <Diamond className="w-6 h-6 ml-3 group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </button>

              {/* Excitement Indicators */}
              <div className="flex justify-center items-center mt-6 space-x-2">
                <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
                <span className="text-sm text-purple-200">Limited Time Offer</span>
                <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}