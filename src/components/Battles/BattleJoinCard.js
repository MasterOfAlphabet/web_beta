import React, { useState, useEffect } from "react";
import { doc, onSnapshot, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { firestore } from "../../services/firebase";
import { FaUsers, FaClock, FaTrophy, FaShieldAlt, FaFire, FaTimes, FaStar, FaShare } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { HiLightningBolt } from "react-icons/hi";

// Import your battle questions UI component
import BattleQuestionsScreen from "./BattleQuestionsScreen"; // <-- You must implement this

export default function BattleJoinCard({ battleId, onClose }) {
  const [battle, setBattle] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [joinedPlayer, setJoinedPlayer] = useState(null); // The player name from this device
  const [showShareModal, setShowShareModal] = useState(false);

  // Subscribe to real-time updates for this battle
  useEffect(() => {
    if (!battleId) return;
    const battleRef = doc(firestore, "battles", battleId);
    const unsub = onSnapshot(battleRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setBattle({ id: snapshot.id, ...data });
        // Time remaining to join
        if (data.createdAt?.toDate) {
          const created = data.createdAt.toDate().getTime();
          const joinLimit = (data.joinTimeLimit || 300) * 1000;
          const end = created + joinLimit;
          setTimeLeft(Math.max(0, Math.floor((end - Date.now()) / 1000)));
        }
      }
    });
    return () => unsub();
  }, [battleId]);

  // Timer countdown
  useEffect(() => {
    if (!battle) return;
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [battle, timeLeft]);

  // Remember joined player name in localStorage (per device)
  useEffect(() => {
    if (battleId) {
      const saved = window.localStorage.getItem("moa_battle_join_" + battleId);
      if (saved) setJoinedPlayer(saved);
    }
  }, [battleId]);

  // This effect will auto-start the battle when timer expires and enough players joined
useEffect(() => {
  if (!battle) return;
  if (battle.status !== "waiting") return;
  if (!battle.createdAt?.toDate) return;
  if (timeLeft > 0) return;

  // Only the creator should trigger this to avoid race conditions
  const isCreator = battle.players?.[0]?.name === joinedPlayer;
  if (!isCreator) return;

  if ((battle.players?.length || 0) >= 2) {
    // Start the battle
    updateDoc(doc(firestore, "battles", battle.id), {
      status: "ongoing"
    });
  }
  // else: not enough players, could trigger cancellation, etc.
}, [battle, timeLeft, joinedPlayer]);

  // Helper functions
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleJoin = async () => {
    if (!playerName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!battle) return;
    setJoining(true);
    try {
      const battleRef = doc(firestore, "battles", battle.id);
      // Fetch latest to check if already joined
      const docSnap = await getDoc(battleRef);
      const latest = docSnap.exists() ? docSnap.data() : null;
      // Don't allow duplicate name for this battle
      const alreadyJoined = latest.players?.some(
        (p) => p.name.trim().toLowerCase() === playerName.trim().toLowerCase()
      );
      if (alreadyJoined) {
        setError("This name has already joined this battle.");
        setJoining(false);
        return;
      }
      await updateDoc(battleRef, {
        players: arrayUnion({
          name: playerName.trim(),
          joinedAt: Date.now(),
        }),
      });
      setJoinedPlayer(playerName.trim());
      window.localStorage.setItem("moa_battle_join_" + battle.id, playerName.trim());
      setPlayerName("");
      setError("");
    } catch (e) {
      setError("Join failed. Try again.");
    }
    setJoining(false);
  };

  const minPlayersToStart = 2;

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareModal(true);
    setTimeout(() => setShowShareModal(false), 2000);
  };

  // === AUTOMATICALLY SHOW QUESTIONS UI WHEN BATTLE GOES LIVE ===
  if (battle?.status === "ongoing") {
    // The battle is LIVE, show questions/progress UI
    return (
      <BattleQuestionsScreen
        battle={battle}
        joinedPlayer={joinedPlayer}
        onClose={onClose}
      />
    );
  }

  // --- JOIN UI ---

  if (!battle)
    return (
      <div className="bg-white rounded-2xl p-10 shadow-xl min-w-[350px]">
        <div className="text-lg">Loading battle...</div>
      </div>
    );

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-bounce"></div>
      </div>
      <div className="relative z-10 w-full max-w-2xl bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white overflow-hidden">
          <button className="absolute top-6 right-6 text-white/80 hover:text-white/100" onClick={onClose}>
            <FaTimes size={24} />
          </button>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <FaTrophy className="text-yellow-300" />
                  Join Battle
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  <span className="text-lg font-medium">LIVE - {battle.title || battle.module}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <div className="text-sm opacity-90">Difficulty</div>
                  <div className="font-bold flex items-center gap-1">
                    <FaFire className="text-orange-300" />
                    {battle.difficulty || battle.settings?.difficultyLevel || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Rules Section */}
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
          <h3 className="flex items-center gap-3 text-xl font-bold mb-4 text-gray-800">
            <div className="p-2 bg-blue-500 rounded-lg">
              <FaShieldAlt className="text-white" />
            </div>
            Battle Rules & Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium">Battle starts with 2+ players</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">15 seconds per question</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="font-medium">{battle.questionsCount || 15} total questions</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="font-medium">Correct answers earn points</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="font-medium">Speed bonus for quick answers</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="font-medium">Winner takes all glory!</span>
              </div>
            </div>
          </div>
        </div>
        {/* Stats Section */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 relative overflow-hidden">
              <div className="absolute top-2 right-2 opacity-10">
                <FaUsers className="text-4xl" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 text-blue-700 mb-2">
                  <FaUsers className="text-xl" />
                  <span className="font-bold text-lg">Players</span>
                </div>
                <div className="text-4xl font-black text-blue-800">
                  {battle.players?.length || 0}/{battle.maxPlayers || battle.numberOfPlayers || 10}
                </div>
                <div className="text-sm text-blue-600 mt-1">
                  {(battle.maxPlayers || battle.numberOfPlayers || 10) - (battle.players?.length || 0)} spots left
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-100 p-6 rounded-2xl border border-orange-200 relative overflow-hidden">
              <div className="absolute top-2 right-2 opacity-10">
                <FaClock className="text-4xl" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 text-orange-700 mb-2">
                  <FaClock className="text-xl" />
                  <span className="font-bold text-lg">Time Left</span>
                </div>
                <div className={`text-4xl font-black ${timeLeft <= 60 ? 'text-red-600' : 'text-orange-800'} ${timeLeft <= 10 ? 'animate-pulse' : ''}`}>
                  {formatTime(timeLeft)}
                </div>
                <div className="text-sm text-orange-600 mt-1">
                  {timeLeft <= 60 ? 'Hurry up!' : 'to join battle'}
                </div>
              </div>
            </div>
          </div>
          {/* Current Players Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaStar className="text-yellow-500" />
              Current Warriors ({battle.players?.length || 0})
            </h3>
            {(battle.players?.length === 0) ? (
              <div className="text-center py-8 text-gray-500">
                <FaUsers className="text-4xl mx-auto mb-3 opacity-30" />
                <p className="text-lg">No players yet. Be the first to join!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {battle.players.map((player, index) => (
                  <div key={player.name} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                          <FaTrophy className="text-xs text-yellow-800" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{player.name}</div>
                      <div className="text-sm text-gray-500">Joined {formatTime(Math.floor((Date.now() - player.joinedAt) / 1000))} ago</div>
                    </div>
                    <div className="text-green-500">
                      <IoMdCheckmark className="text-xl" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Join Form or Status */}
          {!joinedPlayer && timeLeft > 0 ? (
            <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
              <label className="block text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <HiLightningBolt className="text-yellow-500" />
                Enter the Battle Arena
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-lg font-medium"
                    placeholder="Your warrior name..."
                    value={playerName}
                    onChange={e => setPlayerName(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleJoin()}
                    disabled={joining}
                  />
                </div>
                <button
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"
                  onClick={handleJoin}
                  disabled={!playerName.trim() || timeLeft === 0 || joining}
                >
                  Join Battle
                </button>
              </div>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            </div>
          ) : (
            <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 text-center">
              {battle.players?.length === 1 ? (
                <span className="inline-block py-3 px-6 bg-yellow-100 text-yellow-800 rounded-full font-bold text-lg">
                  <FaClock className="inline mr-2" />
                  Waiting for players to join…
                </span>
              ) : (
                <span className="inline-block py-3 px-6 bg-green-100 text-green-800 rounded-full font-bold text-lg animate-pulse">
                  <FaTrophy className="inline mr-2" />
                  Now the Battle is Live… Be Ready!
                </span>
              )}
            </div>
          )}
          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300"
              disabled
            >
              <FaTrophy />
              {battle.players?.length < 2
                ? "Waiting for Players…"
                : "Now the Battle is Live… Be Ready!"}
            </button>
            <button
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300"
              onClick={copyShareLink}
            >
              <FaShare />
              Invite Friends
            </button>
          </div>
        </div>
        {/* Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-600 font-medium">
              🔥 Battle ID: <span className="font-mono bg-gray-200 px-2 py-1 rounded">BT-{battle.id.slice(0, 6).toUpperCase()}</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">May the best warrior win! Good luck!</p>
          </div>
        </div>
      </div>
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 relative shadow-2xl animate-pulse">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowShareModal(false)}
            >
              <FaTimes size={24} />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <IoMdCheckmark className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Link Copied!</h3>
              <p className="text-gray-600">Share this battle with your friends and let the competition begin!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}