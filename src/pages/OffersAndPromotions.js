import React, { useState, useEffect } from "react";

import { useLocation } from 'react-router-dom';

// Import the 7 promotion components
import Premium5in1MainBanner from "../components/Promotions/Premium5in1MainBanner";
import PreLaunchPromotionCard from "../components/Promotions/PreLaunchPromotionCard";
import ExclusiveCouponCard from "../components/Promotions/ExclusiveCouponCard";
import SpecialGiveAwayCard from "../components/Promotions/SpecialGiveAwayCard";
import UnlockRewardsCard from "../components/Promotions/UnlockRewardsCard";
import CollabChallengesCard from "../components/Promotions/CollabChallengesCard";
import SubscriptionPlansCard from "../components/Promotions/SubscriptionPlansCard";

export default function OffersAndPromotions() {

  const location = useLocation();

  // Timer logic for the main banner (24 hour countdown)
  const [timer, setTimer] = useState({ days: 100, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
  // Hash scrolling functionality
  const handleHashScroll = () => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 300);
      }
    }
  };

  handleHashScroll(); // Run on initial load
  
  // Listen for hash changes
  window.addEventListener('hashchange', handleHashScroll);
  return () => window.removeEventListener('hashchange', handleHashScroll);
}, [location]); // Only runs when location changes



useEffect(() => {
  const targetDate = new Date("2025-10-01T00:00:00"); // example: 100 days from now or fixed

  const interval = setInterval(() => {
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) {
      clearInterval(interval);
      setTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    setTimer({ days, hours, minutes, seconds });
  }, 1000);

  return () => clearInterval(interval);
}, []);


  // Handlers for CTAs (these could use routers or modals in a real app)
  const handleMainCTAClick = () => {
    window.scrollTo({ top: 500, behavior: "smooth" });
  };

  const handleSubscribe = () => {
    window.location.href = "/offers-promotions/subscription-plans";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-700">
      <Premium5in1MainBanner timer={timer} onCTAClick={handleMainCTAClick} />
      <div className="container mx-auto px-2 md:px-4 py-10 max-w-5xl">
        {/* Pre-Launch Promotion and Exclusive Coupon side by side */}
        <div className="flex flex-col md:flex-row gap-6 my-8">
          <div id="pre-launch" className="flex-1">
            <PreLaunchPromotionCard />
          </div>
          <div id="exclusive-coupon" className="flex-1">
            <ExclusiveCouponCard couponCode="PREMIUM5" />
          </div>
        </div>
        {/* Special GiveAway full width */}
        <div id="special-giveaway" className="my-8">
          <SpecialGiveAwayCard />
        </div>
        {/* Unlock Rewards and Collab Challenges side by side */}
        <div className="flex flex-col md:flex-row gap-6 my-8">
          <div id="unlock-rewards" className="flex-1">
            <UnlockRewardsCard />
          </div>
          <div id="collab-challenges" className="flex-1">
            <CollabChallengesCard />
          </div>
        </div>
        {/* Subscription Plans full width */}
        <div id="subscription-plans" className="my-8">
          <SubscriptionPlansCard onSubscribe={handleSubscribe} />
        </div>
      </div>
    </div>
  );
}