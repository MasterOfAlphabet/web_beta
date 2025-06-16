import React, { useState, useEffect } from "react";

// Import the 7 promotion components
import Premium5in1MainBanner from "../components/Promotions/Premium5in1MainBanner";
import PreLaunchPromotionCard from "../components/Promotions/PreLaunchPromotionCard";
import ExclusiveCouponCard from "../components/Promotions/ExclusiveCouponCard";
import SpecialGiveAwayCard from "../components/Promotions/SpecialGiveAwayCard";
import UnlockRewardsCard from "../components/Promotions/UnlockRewardsCard";
import CollabChallengesCard from "../components/Promotions/CollabChallengesCard";
import SubscriptionPlansCard from "../components/Promotions/SubscriptionPlansCard";

export default function OffersAndPromotions() {
  // Timer logic for the main banner (24 hour countdown)
  const [timer, setTimer] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Reset timer if needed or stop countdown
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
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