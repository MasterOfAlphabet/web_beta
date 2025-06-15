import React, { useState } from "react";

// --- MOCK DATA ---
const user = {
  name: "Aanya Sharma",
  avatar: "",
  class: "IV",
  city: "Bangalore",
  state: "Karnataka",
};

const achievements = [
  { id: 1, title: "1st Place: Spelling Blitz", badge: "🥇", date: "2025-06-05" },
  { id: 2, title: "Grammar Guru Badge", badge: "📘", date: "2025-06-03" },
];

const gamifiedRewards = [
  { id: 1, title: "Daily Streak - 5 Days", emoji: "🔥" },
  { id: 2, title: "Word Wizard", emoji: "🪄" },
];

const dailyDose = [
  { id: 1, type: "Skill Spotlight", title: "Pronunciation", desc: "Improve your word clarity" },
  { id: 2, type: "Challenge", title: "Vocab Sprint", desc: "Complete today's new set" },
  { id: 3, type: "Word of the Day", title: "Quixotic", desc: "Meaning: exceedingly idealistic" },
];

const skillsAssessment = [
  { name: "Spelling", value: 88, history: [70, 80, 85, 88] },
  { name: "Reading", value: 82, history: [75, 78, 80, 82] },
  { name: "Pronunciation", value: 91, history: [80, 85, 90, 91] },
  { name: "Grammar", value: 84, history: [70, 80, 82, 84] },
  { name: "Writing", value: 79, history: [60, 72, 75, 79] },
  { name: "Listening", value: 86, history: [73, 80, 84, 86] },
  { name: "Vocabulary", value: 90, history: [82, 87, 89, 90] },
  { name: "S.H.A.R.P", value: 76, history: [50, 60, 68, 76] },
  { name: "8-in-1", value: 83, history: [70, 74, 80, 83] },
];

const progressSummary = [
  { type: "Learn", value: 88, history: [60, 75, 80, 88] },
  { type: "Practice", value: 92, history: [70, 80, 85, 92] },
  { type: "Test", value: 85, history: [60, 70, 75, 85] },
  { type: "Battle", value: 80, history: [40, 60, 70, 80] },
  { type: "Challenge", value: 90, history: [70, 75, 85, 90] },
  { type: "Competition", value: 73, history: [40, 65, 70, 73] },
];

const suggestions = [
  { id: 1, text: "Practice your spelling skills", type: "Practice" },
  { id: 2, text: "Take today's Pronunciation Challenge", type: "Challenge" },
  { id: 3, text: "Revise new vocabulary words", type: "Vocab" },
];

// --- COMPONENTS ---
function BoxTitle({ children }) {
  return (
    <div className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
      {children}
    </div>
  );
}

function AchievementSummary({ achievements, gamifiedRewards }) {
  const [showAll, setShowAll] = useState(false);
  return (
    <div className="bg-white rounded-xl shadow p-5 mb-4">
      <BoxTitle>
        🏆 Achievements & Gamified Rewards
        <button
          onClick={() => setShowAll((s) => !s)}
          className="ml-auto text-blue-600 text-sm hover:underline"
        >
          {showAll ? "Hide" : "View All"}
        </button>
      </BoxTitle>
      <div className="flex flex-wrap gap-3">
        {[...achievements, ...gamifiedRewards].slice(0, showAll ? undefined : 3).map((a) => (
          <div key={a.id || a.title} className="flex items-center px-3 py-1.5 rounded-lg bg-blue-50/80 text-blue-900 font-semibold shadow-sm">
            <span className="text-2xl mr-2">{a.badge || a.emoji}</span>
            <span>{a.title}</span>
            {a.date && <span className="ml-2 text-xs text-gray-500">({a.date})</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function DailyDose({ dailyDose }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      {dailyDose.map((item) => (
        <div key={item.id} className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl shadow p-4 flex flex-col">
          <div className="font-semibold text-indigo-700 text-sm mb-1">{item.type}</div>
          <div className="text-lg font-bold text-gray-800">{item.title}</div>
          <div className="text-sm text-gray-500 mt-1">{item.desc}</div>
        </div>
      ))}
    </div>
  );
}

function SkillsAssessment({ skillsAssessment }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 mb-4">
      <BoxTitle>📊 Skills Assessment Status</BoxTitle>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {skillsAssessment.map((skill) => (
          <div key={skill.name} className="flex flex-col items-center bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-3 shadow-sm">
            <span className="font-semibold text-gray-700">{skill.name}</span>
            <span className={`text-lg font-bold ${skill.value >= 90 ? "text-green-600" : skill.value >= 80 ? "text-yellow-600" : "text-red-500"}`}>{skill.value}%</span>
            <div className="flex mt-1 gap-1">
              {skill.history.slice(-3).map((h, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${h >= 85 ? "bg-green-400" : h >= 75 ? "bg-yellow-400" : "bg-red-300"}`}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="text-right mt-1">
        <span className="text-xs text-blue-600 cursor-pointer hover:underline">Show History</span>
      </div>
    </div>
  );
}

function ProgressSummary({ progressSummary }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 mb-4">
      <BoxTitle>📈 Progress Summary</BoxTitle>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {progressSummary.map((prog) => (
          <div key={prog.type} className="flex flex-col items-center bg-gradient-to-br from-yellow-50 to-pink-50 rounded-lg p-3 shadow-sm">
            <span className="font-semibold text-gray-700">{prog.type}</span>
            <span className={`text-lg font-bold ${prog.value >= 90 ? "text-green-600" : prog.value >= 80 ? "text-yellow-600" : "text-red-500"}`}>{prog.value}%</span>
            <div className="flex mt-1 gap-1">
              {prog.history.slice(-3).map((h, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${h >= 85 ? "bg-green-400" : h >= 75 ? "bg-yellow-400" : "bg-red-300"}`}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="text-right mt-1">
        <span className="text-xs text-blue-600 cursor-pointer hover:underline">Show History</span>
      </div>
    </div>
  );
}

function Suggestions({ suggestions }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 mb-4">
      <BoxTitle>🌱 Personalized Learning Journey</BoxTitle>
      <div className="flex flex-col gap-2">
        <div className="font-semibold text-gray-700 mb-1">Suggestions For You</div>
        {suggestions.map((s) => (
          <div key={s.id} className="flex items-center gap-2 p-2 rounded-lg bg-blue-50/80 text-blue-900 font-medium">
            <span className="font-bold text-lg">{s.type === "Practice" ? "📝" : s.type === "Challenge" ? "🏁" : "🧠"}</span>
            <span>{s.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- MAIN DASHBOARD ---
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 md:p-8">
      {/* Top Section: Profile */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Student Info Box */}
        <div className="flex-1 flex flex-col md:flex-row items-center bg-white rounded-xl shadow p-5 gap-5">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-4 border-blue-200 overflow-hidden flex items-center justify-center bg-blue-50 text-3xl font-bold text-blue-500">
              {user.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" /> :
                user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
            </div>
            <div className="mt-2 text-xl font-bold text-gray-800">{user.name}</div>
          </div>
          <div className="flex flex-col justify-center items-start ml-0 md:ml-4 gap-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-600">Class:</span>
              <span className="font-bold text-blue-700">{user.class}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-600">City:</span>
              <span className="font-bold text-blue-700">{user.city}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-600">State:</span>
              <span className="font-bold text-blue-700">{user.state}</span>
            </div>
          </div>
        </div>
        {/* Achievements & Rewards */}
        <div className="flex-1 min-w-[320px]">
          <AchievementSummary achievements={achievements} gamifiedRewards={gamifiedRewards} />
        </div>
      </div>
      {/* Daily Dose */}
      <DailyDose dailyDose={dailyDose} />
      {/* Skills Assessment */}
      <SkillsAssessment skillsAssessment={skillsAssessment} />
      {/* Progress Summary */}
      <ProgressSummary progressSummary={progressSummary} />
      {/* Personalized Learning Journey */}
      <Suggestions suggestions={suggestions} />
    </div>
  );
}