import React, { useState } from "react";
import {
  FaUsers, FaClock, FaPlay, FaPause, FaStop, FaTrophy, FaChartBar, FaEye, FaShareAlt, FaArrowLeft, FaCrown,
} from "react-icons/fa";
import { useParams, Link, useNavigate } from "react-router-dom";

// --- Sample data ---
const modules = [
  { name: "Spelling", icon: <FaTrophy className="text-red-500" /> },
  { name: "Reading", icon: <FaTrophy className="text-pink-500" /> },
  { name: "Listening", icon: <FaTrophy className="text-blue-500" /> },
];

const allBattles = [
  {
    id: "b1",
    module: "Spelling",
    title: "Morning Spelling Bee",
    status: "waiting",
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    scheduledStart: null,
    startedAt: null,
    endedAt: null,
    players: [
      { id: "u1", name: "Alex", avatar: "🦁", ready: true },
      { id: "u2", name: "Sam", avatar: "🐯", ready: false },
    ],
    spectators: 2,
    battleMode: "Standard",
    battleType: "public",
    description: "Fun spelling game for everyone!",
    leaderboard: [],
    questions: 10,
    timeLimit: 15,
    allowSpectators: true,
    enableChat: true,
    showLeaderboard: true,
    chat: [],
    sharedCount: 8,
    winners: [],
    logs: [],
  },
  {
    id: "b2",
    module: "Listening",
    title: "Listening Challenge",
    status: "ongoing",
    createdAt: new Date(Date.now() - 20 * 60 * 1000),
    scheduledStart: null,
    startedAt: new Date(Date.now() - 10 * 60 * 1000),
    endedAt: null,
    players: [
      { id: "u3", name: "Taylor", avatar: "🐼", ready: true, score: 8 },
      { id: "u4", name: "Morgan", avatar: "🦊", ready: true, score: 7 },
      { id: "u5", name: "Jordan", avatar: "🐨", ready: true, score: 6 },
    ],
    spectators: 3,
    battleMode: "Speed Round",
    battleType: "private",
    description: "Test your listening skills.",
    leaderboard: [
      { id: "u3", name: "Taylor", avatar: "🐼", score: 8 },
      { id: "u4", name: "Morgan", avatar: "🦊", score: 7 },
      { id: "u5", name: "Jordan", avatar: "🐨", score: 6 },
    ],
    questions: 10,
    timeLimit: 10,
    allowSpectators: true,
    enableChat: true,
    showLeaderboard: true,
    chat: [
      { user: "Taylor", message: "Let's go!", ts: new Date(Date.now() - 9 * 60 * 1000) },
      { user: "Morgan", message: "Good luck all!", ts: new Date(Date.now() - 9 * 60 * 1000) },
    ],
    sharedCount: 5,
    winners: [],
    logs: [],
  },
  {
    id: "b3",
    module: "Reading",
    title: "Evening Reading Battle",
    status: "ended",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    scheduledStart: null,
    startedAt: new Date(Date.now() - 100 * 60 * 1000),
    endedAt: new Date(Date.now() - 80 * 60 * 1000),
    players: [
      { id: "u6", name: "Pat", avatar: "🦉", ready: true, score: 12 },
      { id: "u7", name: "Chris", avatar: "🐧", ready: true, score: 13 },
    ],
    spectators: 1,
    battleMode: "Survival",
    battleType: "public",
    description: "Compete to see who reads best.",
    leaderboard: [
      { id: "u7", name: "Chris", avatar: "🐧", score: 13 },
      { id: "u6", name: "Pat", avatar: "🦉", score: 12 },
    ],
    questions: 15,
    timeLimit: 20,
    allowSpectators: false,
    enableChat: false,
    showLeaderboard: true,
    chat: [],
    sharedCount: 2,
    winners: ["u7"],
    logs: [],
  },
];

// --- BattleDashboardPage component ---
function formatTime(date) {
  if (!date) return "-";
  return date.toLocaleString(undefined, { hour12: false });
}

function StatusBadge({ status }) {
  const map = {
    waiting: "bg-yellow-100 text-yellow-800",
    ongoing: "bg-green-100 text-green-800",
    ended: "bg-gray-100 text-gray-800",
    paused: "bg-orange-100 text-orange-800",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${map[status] || "bg-gray-100"}`}>
      {status?.toUpperCase()}
    </span>
  );
}

// --- Detailed Battle Dashboard ---
function BattleDetails({ battle }) {
  const navigate = useNavigate();
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-600 px-3 py-2 rounded hover:bg-blue-100 flex items-center gap-1"
        >
          <FaArrowLeft /> Back
        </button>
        <h2 className="text-3xl font-bold ml-2 flex items-center gap-3">
          {battle.title}
          <StatusBadge status={battle.status} />
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-7">
        <div className="bg-white rounded-xl p-6 shadow flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{modules.find(m => m.name === battle.module)?.icon}</span>
            <span className="font-bold text-lg">{battle.module}</span>
          </div>
          <div className="text-gray-600">{battle.description}</div>
          <div>
            <span className="font-semibold">Mode:</span> {battle.battleMode}
          </div>
          <div>
            <span className="font-semibold">Type:</span> {battle.battleType}
          </div>
          <div>
            <span className="font-semibold">Questions:</span> {battle.questions}
          </div>
          <div>
            <span className="font-semibold">Time Limit:</span> {battle.timeLimit} min
          </div>
          <div>
            <span className="font-semibold">Created:</span> {formatTime(battle.createdAt)}
          </div>
          <div>
            <span className="font-semibold">Started:</span> {formatTime(battle.startedAt)}
          </div>
          <div>
            <span className="font-semibold">Ended:</span> {formatTime(battle.endedAt)}
          </div>
          <div>
            <span className="font-semibold">Spectators:</span> {battle.allowSpectators ? battle.spectators : "N/A"}
          </div>
          <div>
            <span className="font-semibold">Shared:</span> {battle.sharedCount} times
          </div>
        </div>

        {/* Participants */}
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="font-bold mb-2 flex items-center gap-2">
            <FaUsers /> Players ({battle.players.length})
          </div>
          <div className="flex flex-wrap gap-3">
            {battle.players.map(p => (
              <div key={p.id} className="flex flex-col items-center p-2 rounded bg-gray-50 min-w-[64px]">
                <span className="text-2xl">{p.avatar}</span>
                <span className="font-semibold">{p.name}</span>
                {"score" in p && (
                  <span className="text-sm text-blue-600 font-bold">{p.score} pts</span>
                )}
                {battle.winners && battle.winners.includes(p.id) && (
                  <span className="text-yellow-500"><FaCrown /></span>
                )}
                <span className="text-xs">
                  {p.ready ? "✅" : "⏳"}
                </span>
              </div>
            ))}
          </div>
          {battle.allowSpectators && (
            <div className="mt-3 text-sm text-gray-600 flex items-center gap-1">
              <FaEye /> Spectators: {battle.spectators}
            </div>
          )}
        </div>

        {/* Leaderboard / Winners / Actions */}
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="font-bold mb-2 flex items-center gap-2">
            <FaTrophy /> {battle.status === "ended" ? "Winners" : "Leaderboard"}
          </div>
          {battle.leaderboard?.length > 0 ? (
            <div className="flex flex-col gap-2">
              {battle.leaderboard.map((p, i) => (
                <div key={p.id} className="flex items-center gap-2 font-semibold">
                  <span className="text-lg">{i === 0 ? <FaCrown className="text-yellow-400" /> : i + 1}</span>
                  <span className="text-xl">{p.avatar}</span>
                  <span>{p.name}</span>
                  <span className="ml-auto text-blue-700">{p.score} pts</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No leaderboard yet.</div>
          )}
          <div className="mt-4 flex gap-2">
            <button className="flex-1 py-2 rounded bg-blue-500 text-white flex items-center justify-center gap-2 hover:bg-blue-600">
              <FaShareAlt /> Share
            </button>
            {battle.status === "ended" && (
              <button className="flex-1 py-2 rounded bg-green-500 text-white flex items-center justify-center gap-2 hover:bg-green-600">
                <FaChartBar /> Results
              </button>
            )}
            {battle.status === "ongoing" && (
              <button className="flex-1 py-2 rounded bg-orange-500 text-white flex items-center justify-center gap-2 hover:bg-orange-600">
                <FaEye /> Live
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Timeline/Logs */}
      <div className="mb-7">
        <div className="font-semibold text-lg mb-2 flex items-center gap-2"><FaClock /> Timeline</div>
        <div className="flex flex-col gap-2 text-sm">
          <div>Created: {formatTime(battle.createdAt)}</div>
          {battle.startedAt && <div>Started: {formatTime(battle.startedAt)}</div>}
          {battle.endedAt && <div>Ended: {formatTime(battle.endedAt)}</div>}
        </div>
      </div>

      {/* Chat / Activity / Advanced */}
      {battle.enableChat && (
        <div className="bg-white rounded-xl p-6 shadow mb-6">
          <div className="font-bold mb-2 flex items-center gap-2"><FaUsers /> Chat</div>
          <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
            {battle.chat.length === 0
              ? <div className="text-gray-500">No chat yet.</div>
              : battle.chat.map((msg, idx) => (
                <div key={idx} className="text-sm">
                  <span className="font-bold">{msg.user}:</span> {msg.message}
                  <span className="ml-2 text-xs text-gray-400">{msg.ts?.toLocaleTimeString()}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

// --- All Battles Overview ---
function AllBattlesTable({ battles }) {
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Battle Dashboard</h1>
        <div className="flex gap-2">
          <Link to="/" className="text-blue-600 px-3 py-2 rounded hover:bg-blue-100 flex items-center gap-1">
            <FaArrowLeft /> Home
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {battles.map(battle => (
          <div key={battle.id} className="bg-white rounded-xl p-6 shadow flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{modules.find(m => m.name === battle.module)?.icon}</span>
              <span className="font-bold">{battle.title}</span>
              <StatusBadge status={battle.status} />
            </div>
            <div className="text-gray-600 mb-1"><span className="font-semibold">Module:</span> {battle.module}</div>
            <div className="flex flex-wrap gap-2 text-sm">
              <div className="flex items-center gap-1">
                <FaUsers /> {battle.players.length}
              </div>
              <div className="flex items-center gap-1">
                <FaEye /> {battle.spectators}
              </div>
              <div className="flex items-center gap-1">
                <FaClock /> {battle.timeLimit} min
              </div>
              <div className="flex items-center gap-1">
                <FaTrophy /> {battle.questions} Qs
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Link
                to={`/dashboard/${battle.id}`}
                className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-center flex items-center justify-center gap-2"
              >
                <FaChartBar /> View Dashboard
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main Page ---
export default function BattleDashboardPage() {
  const { battleId } = useParams();

  // In real app, this would load from backend based on id
  const battle = allBattles.find(b => b.id === battleId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {!battleId
          ? <AllBattlesTable battles={allBattles} />
          : battle
            ? <BattleDetails battle={battle} />
            : <div className="text-red-500 font-bold text-xl">Battle not found.</div>
        }
      </div>
    </div>
  );
}