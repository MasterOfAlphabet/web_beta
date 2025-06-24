// BattlePage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { firestore, auth } from '../services/firebase';
import { signInAnonymously } from 'firebase/auth';
import Battles from './Battles.js_WIP';

const BattlePage = () => {
  const { battleId } = useParams();
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [battle, setBattle] = useState(null);
  const [user, setUser] = useState(null);

  // Sign in anonymously
  useEffect(() => {
    signInAnonymously(auth)
      .then((userCredential) => setUser(userCredential.user))
      .catch((error) => console.error('Anonymous sign-in failed:', error));
  }, []);

  // Load battle data
  useEffect(() => {
    if (!battleId) return;
    
    const battleRef = doc(firestore, 'battles', battleId);
    const unsubscribe = onSnapshot(battleRef, (doc) => {
      if (!doc.exists()) {
        navigate('/');
        return;
      }
      setBattle(doc.data());
    });

    return () => unsubscribe();
  }, [battleId, navigate]);

  // Join the battle
  const joinBattle = async () => {
    if (!playerName.trim() || !user || !battleId) return;

    try {
      await updateDoc(doc(firestore, 'battles', battleId), {
        players: arrayUnion({ id: user.uid, name: playerName }),
        [`scores.${user.uid}`]: 0
      });
      setHasJoined(true);
    } catch (error) {
      console.error('Error joining battle:', error);
    }
  };

  if (!battle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Loading Battle...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{battle.module} Battle</h1>
          <p className="text-gray-600 mb-6">
            {battle.players?.length || 0}/{battle.maxPlayers} players joined
          </p>
          <input
            type="text"
            className="w-full px-4 py-3 border rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your battle name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={20}
          />
          <button
            onClick={joinBattle}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
            disabled={!playerName.trim()}
          >
            Join Battle
          </button>
        </div>
      </div>
    );
  }

  return <Battles battleId={battleId} playerName={playerName} />;
};

export default BattlePage;