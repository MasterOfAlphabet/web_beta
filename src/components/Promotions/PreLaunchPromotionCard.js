import React from "react";

export default function PreLaunchPromotionCard() {
  return (
    <div className="bg-gradient-to-br from-red-500/90 via-orange-400/70 to-yellow-200/60 rounded-2xl shadow-xl p-8 flex flex-col justify-between h-full min-h-[260px]">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">🚀</span>
          <h3 className="text-2xl font-bold text-white">Pre-Launch Promotion</h3>
        </div>
        <div className="text-5xl font-extrabold text-yellow-100 mb-2">50% OFF</div>
        <p className="text-white/90 text-lg mb-2">Be among the first 1000 participants and get a massive 50% off on your subscription!</p>
      </div>
      <div className="text-white font-semibold mt-4">Limited slots. Don’t miss out!</div>
    </div>
  );
}