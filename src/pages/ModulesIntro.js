import React, { useState } from "react";

import { moduleCategories } from '../components/ModulesIntroCategories';

const moduleOptions = [
  "Spelling", "Reading", "Pronunciation", "Grammar",
  "Writing", "Listening", "Vocabulary", "S.H.A.R.P."
];

const moduleColors = {
  Spelling: "bg-[#f44336]",
  Reading: "bg-[#e91e63]",
  Pronunciation: "bg-[#9c27b0]",
  Grammar: "bg-[#673ab7]",
  Writing: "bg-[#3f51b5]",
  Listening: "bg-[#2196f3]",
  Vocabulary: "bg-[#4caf50]",
  "S.H.A.R.P.": "bg-[#ff9800]",
};

const moduleIcons = {
  Spelling: "📚",
  Reading: "📖",
  Pronunciation: "🎤",
  Grammar: "✍️",
  Writing: "📝",
  Listening: "🎧",
  Vocabulary: "📚",
  "S.H.A.R.P.": "⚡",
};

const moduleDescriptions = {
  Spelling: "Spelling is a fundamental skill that helps improve reading, writing, and communication. Learning proper spelling enhances vocabulary, boosts confidence, and reduces confusion in written communication.",
  Reading: "Reading is the key to understanding and learning new information. It strengthens comprehension, enhances focus, and develops imagination. Being a strong reader helps in academics and real-world problem-solving.",
  Pronunciation: "Proper pronunciation is essential for clear communication. It ensures that words are understood correctly and helps in building confidence while speaking.",
  Grammar: "Grammar is the backbone of any language. Understanding grammar rules helps in constructing meaningful sentences and improving communication skills.",
  Writing: "Writing is a powerful tool for expressing thoughts and ideas. It enhances creativity, builds critical thinking, and improves communication skills.",
  Listening: "Listening is an important skill that helps in understanding and interpreting information effectively. Good listening skills improve focus, comprehension, and communication.",
  Vocabulary: "A rich vocabulary enhances both spoken and written communication. It allows for clearer expression of ideas and helps in understanding complex texts.",
  "S.H.A.R.P.": "The S.H.A.R.P. module focuses on Synonyms, Homophones, Antonyms, Root words, and Plural forms. It strengthens vocabulary and improves word relationships.",
};

export default function LearningScreen() {
  const [selectedModule, setSelectedModule] = useState("Spelling");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const categories = moduleCategories[selectedModule] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Learning Modules</h1>
          <p className="text-gray-600 mt-1">Choose a module to explore different learning activities</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - Module Selection */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Module</h2>
              <div className="space-y-2">
                {moduleOptions.map((module) => (
                  <button
                    key={module}
                    onClick={() => setSelectedModule(module)}
                    className={`w-full flex items-center p-3 rounded-lg text-left transition-all duration-200 ${
                      selectedModule === module
                        ? `${moduleColors[module]} text-white shadow-md transform scale-105`
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                    }`}
                  >
                    <span className="text-2xl mr-3">{moduleIcons[module]}</span>
                    <span className="font-medium">{module}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Selected Module Header */}
            <div className={`${moduleColors[selectedModule]} text-white rounded-xl p-6 mb-8 shadow-lg`}>
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">{moduleIcons[selectedModule]}</span>
                <div>
                  <h2 className="text-3xl font-bold">{selectedModule}</h2>
                  <p className="text-white/90 mt-1">Learning Module</p>
                </div>
              </div>
              <p className="text-white/95 leading-relaxed">
                {moduleDescriptions[selectedModule]}
              </p>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Learning Activities</h3>
              {categories.length > 0 ? (
                categories.map((category, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === index ? null : index)}
                      className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className={`w-12 h-12 ${moduleColors[selectedModule]} rounded-lg flex items-center justify-center text-white font-bold text-lg mr-4`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900">{category.title}</h4>
                          <p className="text-gray-600 mt-1">{category.description}</p>
                        </div>
                      </div>
                      <div className={`w-8 h-8 ${moduleColors[selectedModule]} rounded-full flex items-center justify-center text-white font-bold transition-transform ${
                        expandedCategory === index ? 'rotate-45' : ''
                      }`}>
                        +
                      </div>
                    </button>

                    {expandedCategory === index && (
                      <div className="px-6 pb-6 border-t bg-gray-50">
                        <div className="pt-6 space-y-6">
                          {/* Example */}
                          <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                            <h5 className="font-semibold text-gray-900 mb-2">Example</h5>
                            <p className="text-gray-700 italic">{category.example}</p>
                          </div>

                          {/* Benefits */}
                          {category.benefits && (
                            <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                              <h5 className="font-semibold text-gray-900 mb-3">Benefits</h5>
                              <ul className="space-y-2">
                                {category.benefits.map((benefit, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-green-500 mr-2 mt-1">✓</span>
                                    <span className="text-gray-700">{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Telangana Adaptation */}
                          {category.telanganaAdaptation && (
                            <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                              <h5 className="font-semibold text-gray-900 mb-2">Telangana Adaptation</h5>
                              <p className="text-gray-700">{category.telanganaAdaptation}</p>
                            </div>
                          )}

                          {/* Activity Types */}
                          {category.activityTypes && (
                            <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                              <h5 className="font-semibold text-gray-900 mb-3">Activity Types</h5>
                              <div className="flex flex-wrap gap-2">
                                {category.activityTypes.map((activity, i) => (
                                  <span key={i} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {activity}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm border">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Activities Yet</h3>
                  <p className="text-gray-600">Activities for this module are coming soon!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}