import React from "react";

const collabMilestones = [
  {
    title: "5,000 participants",
    desc: "Extends the subscription by one month",
  },
  {
    title: "10,000 participants",
    desc: "Double the subscription plan",
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

export default function CollabChallengesCard() {
  return (
    <div className="bg-gradient-to-br from-purple-700/90 via-violet-400/80 to-pink-100/60 rounded-2xl shadow-xl p-6 flex-1 flex flex-col">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">🤝</span>
        <h3 className="text-xl font-bold text-white">Collab Challenges (Parents)</h3>
      </div>
      <div className="grid grid-cols-1 gap-3 mt-2">
        {collabMilestones.map((milestone, idx) => (
          <MilestoneBox key={idx} {...milestone} />
        ))}
      </div>
    </div>
  );
}