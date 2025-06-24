import React, { useState, useEffect, useRef } from "react";
import {
  doc, collection, query, where, getDocs, getDoc, addDoc, updateDoc,
  deleteDoc, onSnapshot, serverTimestamp, enableIndexedDbPersistence
} from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import { firestore, auth } from "../services/firebase";
import { allQuestions } from "../data/battleQuestions";

// Enable offline persistence
enableIndexedDbPersistence(firestore)
  .then(() => console.log("Offline persistence enabled"))
  .catch((err) => console.error("Offline persistence error:", err));

// Settings
const MAX_PLAYERS = 3;

export default function Battles() {
  // Auth
  const [user, setUser] = useState(null);

  // Form
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState("1");
  const [selectedModule, setSelectedModule] = useState("Spelling");
  const [selectedBattleGround, setSelectedBattleGround] = useState("Class");

  // Game State
  const [battle, setBattle] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);
  const [battleEnded, setBattleEnded] = useState(false);
  const [matchTimeLeft, setMatchTimeLeft] = useState(0); // seconds
  const [questionTimeLeft, setQuestionTimeLeft] = useState(15); // seconds
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [opponentScores, setOpponentScores] = useState({});
  const [answeredPlayers, setAnsweredPlayers] = useState([]);

  // Battles
  const [availableBattles, setAvailableBattles] = useState([]);
  const [usedQuestions, setUsedQuestions] = useState([]);
  const [joinName, setJoinName] = useState("");
  const [hasJoinedBattle, setHasJoinedBattle] = useState(false);
  const [battleHistory, setBattleHistory] = useState([]);

  // 1. Anonymous Login
  useEffect(() => {
    signInAnonymously(auth)
      .then((res) => setUser(res.user))
      .catch((err) => console.error("Anon login error:", err));
  }, []);

  // 2. Listen to available battles
  useEffect(() => {
    const battlesRef = collection(firestore, "battles");
    const q = query(battlesRef, where("status", "==", "waiting"));
    const unsub = onSnapshot(q, (snap) => {
      const battles = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAvailableBattles(battles);
    });
    return () => unsub();
  }, []);

  // 3. Listen to active battle
  useEffect(() => {
    if (!battle?.id) return;
    const battleRef = doc(firestore, "battles", battle.id);
    const unsub = onSnapshot(battleRef, (snap) => {
      if (!snap.exists()) {
        resetBattle();
        return;
      }
      const data = snap.data();
      setBattle({ id: snap.id, ...data });

      if (data.status === "ongoing") {
        setWaitingForOpponent(false);
        setQuestions(data.questions || []);
      }
      if (data.status === "ended") {
        setBattleEnded(true);
        if (data.scores) {
          setScore(data.scores[user.uid] || 0);
          const opp = {};
          Object.keys(data.scores).forEach(pid => {
            if (pid !== user.uid) opp[pid] = data.scores[pid];
          });
          setOpponentScores(opp);
        }
        setBattleHistory((prev) => {
          if (prev.some((b) => b.id === snap.id)) return prev;
          return [...prev, { id: snap.id, ...data }];
        });
      }
      setAnsweredPlayers(data.answeredPlayers || []);
    });
    return () => unsub();
    // eslint-disable-next-line
  }, [battle?.id]);

  // 4. Match timer (15 min)
  useEffect(() => {
    if (!battle || !battle.createdAt || battle.status === "ended") return;
    if (!battle.createdAt.toDate) return;
    const createdMs = battle.createdAt.toDate().getTime();
    const matchDeadline = createdMs + 15 * 60 * 1000;
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = matchDeadline - now;
      if (diff <= 0) {
        setMatchTimeLeft(0);
        if (battle.status === "waiting") cancelBattle();
        else if (battle.status === "ongoing") endBattle("matchTimeUp");
      } else {
        setMatchTimeLeft(Math.floor(diff / 1000));
      }
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [battle]);

  // 5. Question timer (15s)
  useEffect(() => {
    if (!battle || battle.status !== "ongoing" || battleEnded) return;
    if (currentQuestionIndex >= questions.length) return;
    if (questionTimeLeft === 15) {
      const timer = setInterval(() => {
        setQuestionTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            handleAnswer(null);
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
    // eslint-disable-next-line
  }, [questionTimeLeft, battle, battleEnded, currentQuestionIndex, questions]);

  // =============== BATTLE ACTIONS =================

  // Get random questions
  const getRandomQuestions = (count) => {
    let pool = [];
    if (selectedModule === "8-in-1") {
      Object.values(allQuestions).forEach((modData) => {
        if (modData[selectedClass]) {
          if (Array.isArray(modData[selectedClass])) {
            pool = [...pool, ...modData[selectedClass]];
          } else {
            Object.values(modData[selectedClass]).forEach((qt) => {
              pool = [...pool, ...qt];
            });
          }
        }
      });
    } else {
      const modData = allQuestions[selectedModule];
      if (modData && modData[selectedClass]) {
        if (Array.isArray(modData[selectedClass])) {
          pool = [...modData[selectedClass]];
        } else {
          Object.values(modData[selectedClass]).forEach((qt) => {
            pool = [...pool, ...qt];
          });
        }
      }
    }
    pool = pool.filter((q) => !usedQuestions.includes(q));
    if (!pool.length) return [];
    const shuffled = pool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Create new battle
  const handleFormSubmit = async () => {
    if (!name || !selectedClass || !selectedModule || !selectedBattleGround) {
      alert("Please fill all fields.");
      return;
    }
    setShowForm(false);
    const newQuestions = getRandomQuestions(10);
    if (!newQuestions.length) {
      alert("No questions available for this module/class.");
      resetBattle();
      return;
    }
    const newBattle = {
      players: [{ id: user.uid, name }],
      scores: { [user.uid]: 0 },
      status: "waiting",
      questions: newQuestions,
      createdAt: serverTimestamp(),
      class: selectedClass,
      module: selectedModule,
      place: selectedBattleGround,
      answeredPlayers: [],
    };
    try {
      const ref = await addDoc(collection(firestore, "battles"), newBattle);
      onSnapshot(ref, (snap) => {
        if (snap.exists()) setBattle({ id: snap.id, ...snap.data() });
      });
      setUsedQuestions((prev) => [...prev, ...newQuestions]);
      setWaitingForOpponent(true);
    } catch (err) {
      console.error("create battle error:", err);
      resetBattle();
    }
  };

  // Join a battle
  const joinBattle = async (battleId, playerName) => {
    if (!user || !playerName) {
      alert("Please enter your name to join the battle.");
      return;
    }
    try {
      const battleRef = doc(firestore, "battles", battleId);
      const snap = await getDoc(battleRef);
      if (!snap.exists()) return;
      const data = snap.data();
      if (data.players.length >= MAX_PLAYERS) {
        alert("Battle is full.");
        return;
      }
      await updateDoc(battleRef, {
        players: [...data.players, { id: user.uid, name: playerName }],
        [`scores.${user.uid}`]: 0,
        status: data.players.length + 1 === MAX_PLAYERS ? "ongoing" : "waiting",
      });
      setBattle({ id: snap.id, ...data });
      setShowForm(false);
      setHasJoinedBattle(true);
    } catch (err) {
      console.error("joinBattle error:", err);
    }
  };

  // Cancel if still waiting
  const cancelBattle = async () => {
    if (!battle || battle.status !== "waiting") return;
    try {
      await deleteDoc(doc(firestore, "battles", battle.id));
      resetBattle();
    } catch (err) {
      console.error("cancelBattle error:", err);
    }
  };

  // End battle => set status=ended, store final scores
  const endBattle = async (reason) => {
    if (!battle || battle.status === "ended") return;
    try {
      const finalScores = { ...battle.scores };
      finalScores[user.uid] = score;
      await updateDoc(doc(firestore, "battles", battle.id), {
        status: "ended",
        scores: finalScores,
      });
      setBattleEnded(true);
    } catch (err) {
      console.error("endBattle error:", err);
    }
  };

  // handle user answer
  const handleAnswer = async (optionIndex) => {
    if (!questions[currentQuestionIndex]) return;
    const correct = questions[currentQuestionIndex].correctAnswer;
    let newScore = score;
    if (optionIndex !== null && optionIndex === correct) {
      newScore++;
      setScore(newScore);
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setQuestionTimeLeft(15);
    } else {
      endBattle("all-answered");
    }
    if (battle && battle.id) {
      const newScores = { ...battle.scores };
      newScores[user.uid] = newScore;
      try {
        await updateDoc(doc(firestore, "battles", battle.id), {
          scores: newScores,
          answeredPlayers: [...(battle.answeredPlayers || []), user.uid],
        });
      } catch (err) {
        console.error("partial score update error:", err);
      }
    }
  };

  // Reset everything
  const resetBattle = () => {
    setBattle(null);
    setQuestions([]);
    setShowForm(true);
    setWaitingForOpponent(false);
    setBattleEnded(false);
    setMatchTimeLeft(0);
    setQuestionTimeLeft(15);
    setCurrentQuestionIndex(0);
    setScore(0);
    setOpponentScores({});
    setUsedQuestions([]);
    setJoinName("");
    setHasJoinedBattle(false);
    setAnsweredPlayers([]);
  };

  // Calculate progress
  const calculateProgress = (playerId) => {
    if (!battle || !battle.answeredPlayers) return 0;
    const totalQuestions = battle.questions.length;
    const answeredCount = battle.answeredPlayers.filter((uid) => uid === playerId).length;
    return (answeredCount / totalQuestions) * 100;
  };

  // Determine the winner
  const determineWinner = (b = battle) => {
    if (!b || !b.scores) return null;
    const scores = b.scores;
    let winnerId = null;
    let highestScore = -1;
    Object.entries(scores).forEach(([playerId, playerScore]) => {
      if (playerScore > highestScore) {
        highestScore = playerScore;
        winnerId = playerId;
      }
    });
    if (winnerId === user.uid) {
      return "You Won! 🎉";
    } else {
      const winner = b.players.find((p) => p.id === winnerId);
      return `${winner?.name || "Opponent"} Won! 🎉`;
    }
  };

  // Render battle history
  const renderBattleHistory = () => {
    if (!battleHistory.length) {
      return <div className="text-gray-500 text-center mb-6">No battle history available.</div>;
    }
    return (
      <div className="overflow-x-auto mb-10">
        <table className="w-full border bg-white shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Class</th>
              <th className="p-2 border">Module</th>
              <th className="p-2 border">Place</th>
              <th className="p-2 border">Winner</th>
            </tr>
          </thead>
          <tbody>
            {battleHistory.map((b) => (
              <tr key={b.id}>
                <td className="p-2 border text-center">{b.class}</td>
                <td className="p-2 border text-center">{b.module}</td>
                <td className="p-2 border text-center">{b.place}</td>
                <td className="p-2 border text-center">{determineWinner(b)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render available battles
  const renderAvailableBattles = () => {
    if (!availableBattles.length) {
      return <div className="text-gray-500 text-center mb-4">No battles available.</div>;
    }
    return (
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {availableBattles.map((b) => {
          const isOwner = b.players[0]?.id === user?.uid;
          const cTime = b.createdAt?.toDate?.()?.getTime() || 0;
          const diff = cTime + 15 * 60 * 1000 - Date.now();
          const localTimeLeft = Math.max(Math.floor(diff / 1000), 0);
          if (!cTime || localTimeLeft <= 0) return null;

          return (
            <div key={b.id} className="bg-white shadow rounded-xl p-5 relative">
              <div className="font-bold text-lg mb-1 text-blue-700">Available Battle</div>
              <div className="mb-1">Players: {b.players.length}/{MAX_PLAYERS}</div>
              <div className="mb-1">Class: {b.class}</div>
              <div className="mb-1">Module: {b.module}</div>
              <div className="mb-1">Place: {b.place}</div>
              <div className="text-red-500 font-bold mb-1">
                Time Left to Join: {Math.floor(localTimeLeft / 60)}:{(localTimeLeft % 60).toString().padStart(2, "0")}
              </div>
              {isOwner ? (
                <button
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded shadow"
                  onClick={cancelBattle}
                >
                  Cancel Battle
                </button>
              ) : (
                !isOwner && localTimeLeft > 0 && (
                  <>
                    <input
                      type="text"
                      className="mt-2 w-full border rounded px-3 py-2"
                      placeholder="Enter your name"
                      value={joinName}
                      onChange={e => setJoinName(e.target.value)}
                    />
                    <button
                      className={`mt-2 px-4 py-2 bg-green-500 text-white rounded shadow w-full ${hasJoinedBattle ? "opacity-70 cursor-not-allowed" : ""}`}
                      onClick={() => {
                        if (!joinName) {
                          alert("Please enter your name to join the battle.");
                          return;
                        }
                        joinBattle(b.id, joinName);
                        setHasJoinedBattle(true);
                      }}
                      disabled={hasJoinedBattle}
                    >
                      {hasJoinedBattle ? "Waiting for other players..." : "Join Battle"}
                    </button>
                  </>
                )
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100 flex flex-col items-center pt-8 px-2">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-2">Available Battles</h1>
      {renderAvailableBattles()}
      {/* If no active battle => show creation form */}
      {showForm && !battle && (
        <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-pink-700 text-center">Start a New Battle</h2>
          <input
            className="w-full border rounded px-4 py-3 mb-4"
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <select
            className="w-full border rounded px-4 py-3 mb-4"
            value={selectedClass}
            onChange={e => setSelectedClass(e.target.value)}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>Class {i + 1}</option>
            ))}
          </select>
          <select
            className="w-full border rounded px-4 py-3 mb-4"
            value={selectedModule}
            onChange={e => setSelectedModule(e.target.value)}
          >
            <option>Spelling</option>
            <option>Reading</option>
            <option>Pronunciation</option>
            <option>Grammar</option>
            <option>Writing</option>
            <option>Listening</option>
            <option>Vocabulary</option>
            <option>SHARP</option>
            <option>8-in-1</option>
          </select>
          <select
            className="w-full border rounded px-4 py-3 mb-4"
            value={selectedBattleGround}
            onChange={e => setSelectedBattleGround(e.target.value)}
          >
            <option>Class</option>
            <option>School</option>
            <option>Neighborhood</option>
            <option>City</option>
            <option>District</option>
            <option>State</option>
            <option>Nation</option>
            <option>Global</option>
          </select>
          <button
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-pink-500 text-white font-bold text-lg shadow mt-2"
            onClick={handleFormSubmit}
          >
            Start Battle
          </button>
        </div>
      )}

      {/* If waiting */}
      {battle && battle.status === "waiting" && waitingForOpponent && (
        <div className="w-full max-w-xl bg-white shadow rounded-2xl p-7 mb-10 text-center">
          <h2 className="text-xl font-bold mb-2 text-blue-700">Waiting for Opponents...</h2>
          <div className="mb-1">Players: {battle.players.length}/{MAX_PLAYERS}</div>
          <div className="mb-1">Class: {selectedClass}</div>
          <div className="mb-1">Module: {selectedModule}</div>
          <div className="mb-1">Place: {selectedBattleGround}</div>
          <div className="text-red-500 font-bold mb-2">
            Match Time Left: {Math.floor(matchTimeLeft / 60)}:{(matchTimeLeft % 60).toString().padStart(2, "0")}
          </div>
          <button className="mt-2 px-6 py-2 bg-red-500 text-white rounded shadow" onClick={cancelBattle}>
            Cancel Battle
          </button>
        </div>
      )}

      {/* Ongoing => show questions */}
      {battle && battle.status === "ongoing" && !battleEnded && (
        <div className="w-full max-w-2xl bg-white shadow rounded-2xl p-10 mb-10">
          {questions.length === 0 ? (
            <div className="text-lg font-semibold text-center">No questions available.</div>
          ) : currentQuestionIndex < questions.length ? (
            <>
              {/* Progress for all players */}
              <div className="mb-7">
                {battle.players.map((player) => (
                  <div className="mb-2" key={player.id}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold">{player.name}</span>
                      <span className="text-xs text-gray-500">
                        {battle.answeredPlayers.filter((uid) => uid === player.id).length}/{battle.questions.length}
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-gray-200">
                      <div
                        className="h-3 rounded-full bg-green-500 transition-all"
                        style={{ width: `${calculateProgress(player.id)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-xl font-bold mb-5 text-center text-purple-800">
                {questions[currentQuestionIndex]?.question}
              </div>
              <div className="flex justify-between mb-4 text-sm">
                <div className="text-blue-700">
                  Question Time Left: {questionTimeLeft}s
                </div>
                <div className="text-red-500 font-bold">
                  Match Time Left: {Math.floor(matchTimeLeft / 60)}:{(matchTimeLeft % 60).toString().padStart(2, "0")}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {questions[currentQuestionIndex]?.options.map((opt, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left px-6 py-3 bg-gray-100 hover:bg-blue-100 rounded-xl border border-gray-200 font-semibold text-lg transition"
                    onClick={() => handleAnswer(idx)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-lg font-semibold text-center">
              All questions answered! Please wait for the battle to end...
            </div>
          )}
        </div>
      )}

      {/* Ended => final scores */}
      {battle && battle.status === "ended" && (
        <div className="w-full max-w-xl bg-white shadow rounded-2xl p-10 mb-10 text-center">
          <div className="text-3xl font-black mb-2 text-pink-700">Battle Over!</div>
          <div className="text-xl mb-3">Your Score: <span className="font-bold text-green-600">{score}</span></div>
          {Object.entries(opponentScores).map(([playerId, playerScore]) => (
            <div key={playerId} className="text-lg mb-1">
              {battle.players.find((p) => p.id === playerId)?.name || "Opponent"}'s Score: <span className="font-bold text-blue-700">{playerScore}</span>
            </div>
          ))}
          <div className="mt-3 text-xl font-bold">{determineWinner()}</div>
          <button className="mt-6 px-7 py-3 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-xl font-bold text-lg shadow" onClick={resetBattle}>
            Back to Battles
          </button>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-2 text-purple-700 mt-8">Battle History</h2>
      {renderBattleHistory()}
    </div>
  );
}