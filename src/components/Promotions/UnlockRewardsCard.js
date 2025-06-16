import React from "react";

const rewardMilestones = [
  {
    title: "5,000 participants",
    desc: "Daily, Weekly and Monthly Challenges",
  },
  {
    title: "10,000 participants",
    desc: "Special Challenges on Dusserha & Sankranthi — Mini Grand Competition",
  },
  {
    title: "25,000 participants",
    desc: "Join the competition for ₹999, ₹499, or free",
  },
  {
    title: "50,000 participants",
    desc: "All 12-month subscription plan participants can join the competition for free",
  },
];

function MilestoneBox({ title, desc }) {
  return (
    <div className="bg-white/70 rounded-xl p-4 shadow text-center flex flex-col items-center">
      <div className="text-base font-bold mb-1">{title}</div>
      <div className="text-sm text-gray-700">{desc}</div>
    </div>
  );
}

export default function UnlockRewardsCard() {
  return (
    <div className="bg-gradient-to-br from-orange-500/90 via-amber-400/80 to-yellow-100/60 rounded-2xl shadow-xl p-6 flex-1 flex flex-col">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">🔓</span>
        <h3 className="text-xl font-bold text-white">Unlock Rewards</h3>
      </div>
      <div className="grid grid-cols-1 gap-3 mt-2">
        {rewardMilestones.map((milestone, idx) => (
          <MilestoneBox key={idx} {...milestone} />
        ))}
      </div>
    </div>
  );
}