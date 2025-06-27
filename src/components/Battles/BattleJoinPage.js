import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import BattleJoinCard from "./BattleJoinCard";

export default function BattleJoinPage() {
  const { battleId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <BattleJoinCard battleId={battleId} onClose={() => navigate(-1)} />
    </div>
  );
}