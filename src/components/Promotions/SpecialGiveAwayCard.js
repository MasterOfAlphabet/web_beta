import React from "react";

export default function SpecialGiveAwayCard() {
  return (
    <div className="flex flex-col md:flex-row bg-gradient-to-br from-green-500/90 via-teal-400/80 to-green-100/60 rounded-2xl shadow-xl p-8 my-8 items-center min-h-[340px]">
      {/* Left: Giveaway Info */}
      <div className="flex-1 pr-0 md:pr-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🎁</span>
          <h3 className="text-2xl font-bold text-white">Special GiveAway</h3>
        </div>
        <div className="text-white/90 text-lg mb-2">
          1 lucky winner out of the first 1000 participants can win at three levels:
        </div>
        <ul className="list-disc ml-7 mb-3 text-white font-semibold text-lg space-y-1">
          <li>District</li>
          <li>State</li>
          <li>National</li>
        </ul>
        <div className="text-green-100 font-medium">Participate now for your chance to win an Android Tab!</div>
      </div>
      {/* Right: Android Tablet Image */}
      <div className="flex-1 flex justify-center mt-6 md:mt-0">
        <img
          src="/android_tab_mockup.png"
          alt="Android Tablet Giveaway"
          className="w-64 h-auto rounded-xl drop-shadow-xl"
        />
      </div>
    </div>
  );
}