import React from "react";

/*
Expected resultData structure:

{
  overallScore: 62,
  gamificationLevel: "Yellow", // Red | Yellow | Green
  grade: "Grade 5",
  modules: [
    { name: "Spelling", score: 48 },
    { name: "Vocabulary", score: 52 },
    { name: "Reading", score: 74 },
    { name: "Pronunciation", score: 69 }
  ]
}
*/

export default function ResultsPage({ resultData }) {
  if (!resultData) return null;

  const getStatusColor = (score) => {
    if (score >= 75) return "text-green-600 bg-green-100";
    if (score >= 55) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getStatusLabel = (score) => {
    if (score >= 75) return "Secure";
    if (score >= 55) return "Developing";
    return "Needs Attention";
  };

  const lowestModules = resultData.modules
    .filter((m) => m.score < 60)
    .map((m) => m.name);

  const projectedGrowth = resultData.overallScore < 70 ? "18–25%" : "10–15%";

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-purple-50 py-16 px-6">

      {/* ===============================
          LAYER 1 – HERO SUMMARY
      =============================== */}

      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          English Skill Health Report
        </h1>

        <div className="text-6xl font-black text-purple-600 mb-4">
          {resultData.overallScore}%
        </div>

        <div className="text-lg text-gray-600 mb-2">
          Grade Evaluated: {resultData.grade}
        </div>

        <div className="text-xl font-semibold text-gray-800">
          Gamification Level: {resultData.gamificationLevel}
        </div>

        <p className="mt-6 text-gray-700 max-w-3xl mx-auto">
          Your child shows strong potential. Strengthening specific modules will significantly improve academic performance and competition readiness.
        </p>
      </div>

      {/* ===============================
          LAYER 2 – SKILL HEATMAP
      =============================== */}

      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6 mb-20">
        {resultData.modules.map((mod, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-2xl p-6 border hover:shadow-xl transition"
          >
            <div className="text-lg font-bold text-gray-900 mb-3">
              {mod.name}
            </div>

            <div className="text-4xl font-black text-purple-600 mb-3">
              {mod.score}%
            </div>

            <div
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                mod.score
              )}`}
            >
              {getStatusLabel(mod.score)}
            </div>
          </div>
        ))}
      </div>

      {/* ===============================
          LAYER 3 – GAP IMPACT
      =============================== */}

      {lowestModules.length > 0 && (
        <div className="max-w-4xl mx-auto bg-yellow-50 border border-yellow-200 rounded-2xl p-8 mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Identified Growth Opportunities
          </h2>

          <p className="text-gray-700">
            Improvement is recommended in{" "}
            <strong>{lowestModules.join(", ")}</strong>. Addressing these areas
            will enhance written accuracy, comprehension speed, and competitive
            performance.
          </p>
        </div>
      )}

      {/* ===============================
          LAYER 4 – PROGRESS PROJECTION
      =============================== */}

      <div className="max-w-5xl mx-auto text-center mb-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Growth Projection
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-100 p-8 rounded-2xl">
            <h3 className="text-lg font-bold mb-2">Without Structured Plan</h3>
            <p className="text-gray-600">
              Expected gradual improvement of ~3–5% over the next 3 months.
            </p>
          </div>

          <div className="bg-purple-100 p-8 rounded-2xl">
            <h3 className="text-lg font-bold mb-2">
              With Guided Improvement Plan
            </h3>
            <p className="text-purple-700 font-semibold">
              Estimated growth: {projectedGrowth} within 8–12 weeks.
            </p>
          </div>
        </div>
      </div>

      {/* ===============================
          LAYER 5 – PATH OPTIONS
      =============================== */}

      <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Choose the Next Step
        </h2>

        <div className="grid md:grid-cols-2 gap-10">

          {/* Skills Improvement */}
          <div className="bg-white border rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-bold mb-4">
              🎯 Skills Improvement Plan
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li>✔ Personalized weekly focus modules</li>
              <li>✔ Target weak areas first</li>
              <li>✔ Gamification level tracking</li>
              <li>✔ Parent performance dashboard</li>
            </ul>
          </div>

          {/* Competition Track */}
          <div className="bg-white border rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <h3 className="text-2xl font-bold mb-4">
              🏆 Competition Readiness Track
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li>✔ Benchmark against peers</li>
              <li>✔ Timed quizzes & accuracy training</li>
              <li>✔ Performance percentile ranking</li>
              <li>✔ Certification & leaderboard</li>
            </ul>
          </div>

        </div>
      </div>

      {/* ===============================
          LAYER 6 – SUBSCRIPTION TIERS
      =============================== */}

      <div className="max-w-6xl mx-auto mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Improvement Plans
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {/* 1 Month */}
          <PlanCard
            title="1 Month Boost"
            description="Quick correction of 1–2 weak modules"
            highlight={false}
          />

          {/* 3 Month (Recommended) */}
          <PlanCard
            title="3 Month Strength Builder"
            description="Move from Yellow to Green confidently"
            highlight={true}
          />

          {/* 12 Month */}
          <PlanCard
            title="12 Month Mastery"
            description="Long-term academic & competition excellence"
            highlight={false}
          />

        </div>
      </div>

      {/* ===============================
          FINAL CTA
      =============================== */}

      <div className="text-center">
        <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg px-12 py-5 rounded-2xl shadow-xl hover:scale-105 transition">
          Start Improvement Plan
        </button>
      </div>
    </div>
  );
}

/* ===============================
   PLAN CARD COMPONENT
=============================== */

function PlanCard({ title, description, highlight }) {
  return (
    <div
      className={`p-8 rounded-2xl shadow-lg border transition ${
        highlight
          ? "bg-purple-600 text-white scale-105"
          : "bg-white"
      }`}
    >
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className={`${highlight ? "text-purple-100" : "text-gray-600"}`}>
        {description}
      </p>

      <button
        className={`mt-6 px-6 py-3 rounded-xl font-semibold ${
          highlight
            ? "bg-white text-purple-600"
            : "bg-purple-600 text-white"
        }`}
      >
        Select Plan
      </button>
    </div>
  );
}
