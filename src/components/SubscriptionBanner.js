import { useState, useEffect } from 'react';

const SubscriptionBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const seconds = prev.seconds - 1;
        const minutes = seconds < 0 ? prev.minutes - 1 : prev.minutes;
        const hours = minutes < 0 ? prev.hours - 1 : prev.hours;
        
        return {
          hours: hours < 0 ? 23 : hours,
          minutes: minutes < 0 ? 59 : minutes,
          seconds: seconds < 0 ? 59 : seconds
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleBannerClick = () => {
    window.location.href = '/offers-promotions';
  };

  const handleSubscribeClick = (e) => {
    e.stopPropagation(); // Prevent banner click when clicking subscribe button
    window.location.href = '/offers-promotions#subscription-plans';
  };

  const handleBoxClick = (e, sectionId) => {
    e.stopPropagation(); // Prevent banner click when clicking individual boxes
    window.location.href = `/offers-promotions#${sectionId}`;
  };

  return (
    <div 
      className="w-full bg-gradient-to-r from-indigo-800 via-purple-700 to-pink-700 text-white py-8 shadow-xl cursor-pointer"
      onClick={handleBannerClick}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Content - Title */}
        <div className="bg-emerald-800/70 rounded-xl p-6 min-w-[280px] border border-emerald-400/20">
  <h2 className="text-2xl font-bold mb-4 text-center text-white">Unlock Your Learning Potential</h2>
  <p className="text-sm text-yellow-300 mb-5 text-center font-medium">
    "Transform your skills with our exclusive learning ecosystem"
  </p>
  <div className="space-y-4">
    <div className="flex items-center gap-3 text-white">
     
      <span className="font-medium">Premium Content</span> *
      <span className="font-medium">Challenges</span> *
      <span className="font-medium">Skills Assessment</span>

    </div>

  </div>
</div>

<div className="flex-1 max-w-4xl">
  <div className="bg-black/20 rounded-xl p-4">
    <h3 className="text-lg font-semibold mb-4 text-center">Sensational 5-in-1 Offer</h3>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {[
        { icon: '🚀', text: 'Pre-Launch Promotion', bg: 'bg-red-500/20 border-red-400/30', section: 'pre-launch' },
        { icon: '🎟️', text: 'Exclusive Coupon', bg: 'bg-blue-500/20 border-blue-400/30', section: 'exclusive-coupon' },
        { icon: '🎁', text: 'Special GiveAway', bg: 'bg-green-500/20 border-green-400/30', section: 'special-giveaway' },
        { icon: '🔓', text: 'Unlock Rewards', bg: 'bg-orange-500/20 border-orange-400/30', section: 'unlock-rewards' },
        { icon: '🤝', text: 'Collab Challenges', bg: 'bg-purple-500/20 border-purple-400/30', section: 'collab-challenges' }
      ].map((item, index) => (
        <div 
          key={index} 
          className={`${item.bg} hover:bg-white/20 rounded-lg p-3 text-center border transition-all cursor-pointer flex flex-col items-center h-[120px] justify-between`}
          onClick={(e) => handleBoxClick(e, item.section)}
        >
          <div className="text-2xl mb-2">{item.icon}</div>
          <div className="text-sm flex flex-col">
            {item.text.split(' ').map((word, i) => (
              <span key={i}>{word}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
          
          {/* Right Content - Timer & CTA */}
          <div className="flex flex-col items-center">
            <div className="text-center mb-4">
              <div className="text-sm opacity-80 mb-1">Limited Time</div>
              <div className="text-2xl font-bold flex gap-2">
                <span className="bg-white/20 px-3 py-1 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span>:</span>
                <span className="bg-white/20 px-3 py-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span>:</span>
                <span className="bg-white/20 px-3 py-1 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
              <div className="text-xs mt-1 text-red-300 animate-pulse">HURRY UP!</div>
            </div>
            
            <button 
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-indigo-900 font-bold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              onClick={handleSubscribeClick}
            >
              SUBSCRIBE NOW
            </button>
            
            <div className="mt-3 text-sm font-medium">
              Plans: 1 - 12 Months
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBanner;