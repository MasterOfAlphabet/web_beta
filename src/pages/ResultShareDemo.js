import React, { useState } from "react";
import UniversalResultShareCard from "../components/UniversalResultShareCard";
import { useDownloadableCardImage } from "../components/useDownloadableCardImage";

// Demo data (replace with real props/data)
const dummyStudent = {
  name: "Aanya Sharma",
  classLevel: "IV",
  school: "MPS",
  city: "Bangalore",
  score: 22,
  total: 24,
  avatar: "🧑‍🎓",
  badge: "Spelling Star 🏆",
  level: "Master",
  module: "Spelling Assessment",
  resultText: "Outstanding!",
  summary: [
    { label: "Dictation", value: "4/4" },
    { label: "MCQ", value: "4/4" },
    { label: "Missing Letter", value: "4/4" },
    { label: "Unscramble", value: "4/4" },
    { label: "Pic", value: "3/4" },
  ],
};

const MODE_OPTIONS = [
  {
    key: "certificate",
    label: "Certificate",
    desc: "Wide, formal, printable certificate",
    accentColor: "#4f46e5",
    previewSize: "w-[380px] md:w-[600px]",
    logo: "/logo192.png",
  },
  {
    key: "social",
    label: "WhatsApp Status",
    desc: "Portrait, 9:16 ratio for WhatsApp",
    accentColor: "#16a34a",
    previewSize: "w-[380px] h-[675px]",
    logo: undefined,
  },
  {
    key: "insta",
    label: "Insta Post",
    desc: "Square, 1:1 ratio for Instagram",
    accentColor: "#ec4899",
    previewSize: "w-[380px] h-[380px] md:w-[600px] md:h-[600px]",
    logo: undefined,
  },
];

export default function ResultShareDemo() {
  const [mode, setMode] = useState("certificate");
  const { cardRef, downloadCertificate, downloadSocial, downloadInsta } = useDownloadableCardImage();

  // Pick config for current mode
  const modeConfig = MODE_OPTIONS.find((m) => m.key === mode);

  // Download handler
  const handleDownload = () => {
    if (mode === "certificate") downloadCertificate();
    else if (mode === "social") downloadSocial();
    else if (mode === "insta") downloadInsta();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center py-10 px-2">
      <div className="mb-10">
        <div className="flex flex-wrap gap-4 justify-center mb-4">
          {MODE_OPTIONS.map((m) => (
            <button
              key={m.key}
              className={`px-7 py-2.5 rounded-full font-bold border-2 transition 
                ${mode === m.key
                  ? "bg-white border-blue-700 text-blue-700 shadow"
                  : "bg-blue-100 border-blue-200 text-blue-800 hover:bg-white"
                }`}
              title={m.desc}
              onClick={() => setMode(m.key)}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="flex justify-center gap-4 text-xs text-gray-500">
          {MODE_OPTIONS.map(m => (
            <span key={m.key} className={`${mode === m.key ? "font-bold text-blue-700" : ""}`}>{m.label}{mode === m.key && <> &mdash; {m.desc}</>}</span>
          ))}
        </div>
      </div>
      {/* Live Card Preview */}
      <div className={`flex justify-center items-center bg-white rounded-2xl shadow-2xl p-4 ${modeConfig.previewSize}`}>
        <UniversalResultShareCard
          ref={cardRef}
          mode={mode === "certificate" ? "certificate" : "social"}
          {...dummyStudent}
          accentColor={modeConfig.accentColor}
          logo={modeConfig.logo}
          bgColor="#fff"
          watermark="MoA Learning"
        />
      </div>
      {/* Download Button */}
      <div className="mt-8">
        <button
          className="px-10 py-3 rounded-full bg-blue-600 hover:bg-blue-800 text-white font-bold text-lg shadow-lg transition"
          onClick={handleDownload}
        >
          Download {modeConfig.label} Image
        </button>
      </div>
    </div>
  );
}