// src/components/AssessmentResultsCard.js

import React from "react";
import { CircularProgress } from "@mui/material";
import { format } from "date-fns";

const getPerformanceColor = (percentage) => {
  if (percentage >= 85) return "text-green-600 border-green-400";
  if (percentage >= 60) return "text-yellow-600 border-yellow-400";
  return "text-red-600 border-red-400";
};

const AssessmentResultsCard = ({
  moduleLabel = "Spelling Skills",
  assessmentDate = new Date().toISOString(),
  overall = { score: 0, maximumPossibleScore: 0, totalNumberOfQuestions: 0 },
  categories = {}
}) => {
  const percentage =
    overall.maximumPossibleScore > 0
      ? Math.round((overall.score / overall.maximumPossibleScore) * 100)
      : 0;

  const formattedDate = format(new Date(assessmentDate), "dd MMM yyyy");

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-2xl mx-auto mb-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{moduleLabel}</h3>
          <p className="text-sm text-gray-500">🗓️ {formattedDate}</p>
        </div>

        {/* Overall Performance Ring */}
        <div className="flex flex-col items-center">
          <div
            className={`w-16 h-16 flex items-center justify-center rounded-full border-4 font-bold text-lg ${getPerformanceColor(
              percentage
            )}`}
          >
            {percentage}%
          </div>
          <p className="text-xs mt-1 text-gray-500">Overall</p>
        </div>
      </div>

      {/* Score Summary */}
      <div className="text-sm text-gray-600 mb-4">
        <p>
          🔢 <strong>Total Questions:</strong> {overall.totalNumberOfQuestions}
        </p>
        <p>
          🏆 <strong>Score:</strong> {overall.score} / {overall.maximumPossibleScore}
        </p>
      </div>

      {/* Category Scores */}
      <div className="space-y-3">
        {Object.entries(categories).map(([categoryName, data]) => {
          const catPercent =
            data.maximumPossibleScore > 0
              ? Math.round((data.score / data.maximumPossibleScore) * 100)
              : 0;

          return (
            <div key={categoryName}>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-800">{categoryName}</span>
                <span className="text-sm text-gray-500">
                  {data.score}/{data.maximumPossibleScore} ({catPercent}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    catPercent >= 85
                      ? "bg-green-500"
                      : catPercent >= 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ width: `${catPercent}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssessmentResultsCard;
