import React from "react";

const offerBoxes = [
  {
    label: "Pre-Launch Promotion",
    icon: "🚀",
    anchor: "pre-launch",
    bg: "bg-red-500/20 border-red-400/30",
  },
  {
    label: "Exclusive Coupon",
    icon: "🎟️",
    anchor: "exclusive-coupon",
    bg: "bg-blue-500/20 border-blue-400/30",
  },
  {
    label: "Special GiveAway",
    icon: "🎁",
    anchor: "special-giveaway",
    bg: "bg-green-500/20 border-green-400/30",
  },
  {
    label: "Unlock Rewards",
    icon: "🔓",
    anchor: "unlock-rewards",
    bg: "bg-orange-500/20 border-orange-400/30",
  },
  {
    label: "Collab Challenges",
    icon: "🤝",
    anchor: "collab-challenges",
    bg: "bg-purple-500/20 border-purple-400/30",
  },
];

// Subscription plan anchors
const plans = [
  { duration: "1 Month", anchor: "subscription-plans" },
  { duration: "3 Months", anchor: "subscription-plans" },
  { duration: "12 Months", anchor: "subscription-plans" },
];

export default function Premium5in1MainBanner({
  collabTimer = { days: 99, hours: 23, minutes: 59, seconds: 59 },
  className = "",
}) {
  // Handles anchor scroll for offer boxes
  const handleBoxClick = (e, sectionId) => {
    e.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.hash = `#${sectionId}`;
    }
  };

  return (
    <div
      className={`w-full bg-gradient-to-r from-indigo-800 via-purple-700 to-pink-700 text-white py-10 shadow-2xl ${className}`}
    >
      <div className="container mx-auto px-2 md:px-6">
        <div className="flex flex-col md:flex-row items-stretch justify-between gap-8">
          {/* LEFT: 5-in-1 Offer Visual */}
          <div className="flex-1 max-w-4xl flex items-center justify-center order-1">
            <div className="bg-black/20 rounded-xl p-4 w-full">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Sensational 5-in-1 Offer
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {offerBoxes.map((item, index) => (
                  <a
                    key={item.anchor}
                    href={`#${item.anchor}`}
                    className={`${item.bg} hover:bg-white/20 rounded-lg p-3 text-center border transition-all cursor-pointer flex flex-col items-center h-[120px] justify-between focus:outline-none focus:ring-2 focus:ring-yellow-400`}
                    onClick={(e) => handleBoxClick(e, item.anchor)}
                    tabIndex={0}
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="text-sm flex flex-col">
                      {item.label.split(" ").map((word, i) => (
                        <span key={i}>{word}</span>
                      ))}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
          {/* CENTER: Subscription Plans */}
          <div className="flex-1 flex flex-col items-center justify-center order-2">
            <div className="bg-white/10 rounded-2xl px-6 py-6 shadow-lg w-full max-w-md">
              <h3 className="text-xl font-bold mb-4 text-center text-yellow-200" id="subscription-box">
                Subscription Plans
              </h3>
              <div className="flex flex-row justify-center gap-3 mb-2">
                {plans.map((plan, idx) => (
                  <a
                    key={plan.anchor}
                    href={`#${plan.anchor}`}
                    className="bg-gradient-to-b from-yellow-100 via-yellow-200 to-yellow-300 flex flex-col items-center rounded-lg px-4 py-4 font-bold text-indigo-900 shadow border border-yellow-100 min-w-[90px] text-base hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <span>{plan.duration}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          {/* RIGHT: Collaboration Timer */}
          <div className="flex-1 flex flex-col items-center justify-center order-3 max-w-xs">
            <a
              href="#collab-box"
              className="w-full"
              tabIndex={0}
              style={{ display: "block" }}
            >
              <div
                className="bg-emerald-800/80 rounded-2xl px-6 py-7 shadow-lg w-full flex flex-col items-center hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
                id="collab-box"
              >
                <h2 className="text-lg font-bold text-yellow-200 mb-3 text-center">
                  It's time for Collaboration
                </h2>
                <div className="text-center mb-2 text-white/90 text-sm">
                  Limited Time
                </div>
                {/* Timer for 100 days */}
                <div className="flex gap-2 text-2xl font-bold mb-1">
                  <span className="bg-white/20 px-3 py-1 rounded">
                    {String(collabTimer.days ?? 100).padStart(2, "0")}
                  </span>
                  <span>d</span>
                  <span className="bg-white/20 px-3 py-1 rounded">
                    {String(collabTimer.hours ?? 0).padStart(2, "0")}
                  </span>
                  <span>:</span>
                  <span className="bg-white/20 px-3 py-1 rounded">
                    {String(collabTimer.minutes ?? 0).padStart(2, "0")}
                  </span>
                  <span>:</span>
                  <span className="bg-white/20 px-3 py-1 rounded">
                    {String(collabTimer.seconds ?? 0).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-1 text-xs text-red-200 animate-pulse font-bold">
                  HURRY UP!
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}