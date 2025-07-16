import React, { useState } from "react";
import {
  Volume2,
  Zap,
  Star,
  TrendingUp,
  Lightbulb,
  Headphones,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";

const classGroups = [
  {
    label: "Class I-II",
    value: "I-II",
    gradient: "from-pink-400 to-purple-500",
  },
  {
    label: "Class III-V",
    value: "III-V",
    gradient: "from-blue-400 to-cyan-500",
  },
  {
    label: "Class VI-X",
    value: "VI-X",
    gradient: "from-green-400 to-emerald-500",
  },
];

const listeningTasks = {
  "I-II": [
    {
      title: "Animal Sounds",
      desc: "Listen to the sound and guess the animal.",
      audio: "/audio/animal.mp3",
      image: "🐘",
      difficulty: "Easy",
      duration: "2 min",
    },
    {
      title: "Who is Speaking?",
      desc: "Listen to the voice and choose the correct character.",
      audio: "/audio/child.mp3",
      image: "👶",
      difficulty: "Easy",
      duration: "3 min",
    },
    {
      title: "What's the Weather?",
      desc: "Is it raining or sunny?",
      audio: "/audio/weather.mp3",
      image: "🌦️",
      difficulty: "Easy",
      duration: "2 min",
    },
  ],
  "III-V": [
    {
      title: "Short Story",
      desc: "Listen to the story and answer a question.",
      audio: "/audio/story.mp3",
      image: "📚",
      difficulty: "Medium",
      duration: "5 min",
    },
    {
      title: "Directions",
      desc: "Listen and follow the directions.",
      audio: "/audio/directions.mp3",
      image: "🗺️",
      difficulty: "Medium",
      duration: "4 min",
    },
    {
      title: "Conversation",
      desc: "Who is talking to whom?",
      audio: "/audio/conversation.mp3",
      image: "💬",
      difficulty: "Medium",
      duration: "6 min",
    },
  ],
  "VI-X": [
    {
      title: "News Clip",
      desc: "Listen to a news clip and summarize.",
      audio: "/audio/news.mp3",
      image: "📺",
      difficulty: "Hard",
      duration: "8 min",
    },
    {
      title: "Lecture",
      desc: "Listen to a short lecture and take notes.",
      audio: "/audio/lecture.mp3",
      image: "🎓",
      difficulty: "Hard",
      duration: "10 min",
    },
    {
      title: "Interview",
      desc: "Listen to an interview and answer questions.",
      audio: "/audio/interview.mp3",
      image: "🎤",
      difficulty: "Hard",
      duration: "12 min",
    },
  ],
};

const difficultyColors = {
  Easy: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  Hard: "bg-red-100 text-red-800",
};

export default function ListeningPage() {
  const [group, setGroup] = useState("I-II");
  const [playingAudio, setPlayingAudio] = useState(null);

  const getProgressValue = () => {
    switch (group) {
      case "I-II":
        return 45;
      case "III-V":
        return 60;
      case "VI-X":
        return 78;
      default:
        return 0;
    }
  };

  const handleAudioPlay = (taskTitle) => {
    setPlayingAudio(playingAudio === taskTitle ? null : taskTitle);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500 rounded-full opacity-10 blur-3xl animate-pulse delay-2000"></div>

      <div className="relative z-10 py-8 px-4">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="backdrop-blur-md bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
                  <Zap className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <Star className="w-3 h-3 text-yellow-800" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-black text-white mb-2 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                  Listening Lounge
                </h1>
                <p className="text-xl text-white/80 leading-relaxed">
                  Sharpen your listening skills with audio stories, tasks, and
                  comprehension challenges!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Class Group Tabs */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-2 border border-white/20 shadow-xl">
            <div className="grid grid-cols-3 gap-2">
              {classGroups.map((cg) => (
                <button
                  key={cg.value}
                  onClick={() => setGroup(cg.value)}
                  className={`relative overflow-hidden rounded-xl py-4 px-6 font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                    group === cg.value
                      ? `bg-gradient-to-r ${cg.gradient} text-white shadow-xl`
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {group === cg.value && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                  )}
                  <span className="relative z-10">{cg.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/80 font-medium">Progress</span>
                  <span className="text-white font-bold">
                    {getProgressValue()}%
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                    style={{ width: `${getProgressValue()}%` }}
                  >
                    <div className="h-full bg-gradient-to-r from-white/30 to-transparent animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg">
                <TrendingUp className="w-4 h-4 text-white" />
                <span className="text-white font-bold text-sm">
                  Level Up!
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Listening Tasks */}
        <div className="max-w-6xl mx-auto mb-8">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Today's Listening Tasks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listeningTasks[group].map((item) => (
              <div
                key={item.title}
                className="group backdrop-blur-md bg-white/10 rounded-3xl p-6 border border-white/20 shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-white/20 to-white/10 rounded-2xl flex items-center justify-center text-4xl transform group-hover:scale-110 transition-transform duration-300">
                    {item.image}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      difficultyColors[item.difficulty]
                    }`}
                  >
                    {item.difficulty}
                  </span>
                  <span className="text-white/60 text-sm">
                    {item.duration}
                  </span>
                </div>

                {/* Audio Player */}
                <div className="mb-6">
                  <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleAudioPlay(item.title)}
                        className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300"
                      >
                        {playingAudio === item.title ? (
                          <Pause className="w-5 h-5 text-white" />
                        ) : (
                          <Play className="w-5 h-5 text-white ml-1" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Volume2 className="w-4 h-4 text-white/60" />
                          <span className="text-white/80 text-sm font-medium">
                            Audio Track
                          </span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full w-0 group-hover:w-1/3 transition-all duration-1000"></div>
                        </div>
                      </div>
                      <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-300">
                        <RotateCcw className="w-4 h-4 text-white/80" />
                      </button>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-purple-600 hover:to-pink-600">
                  Start Practice
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Listening Tip */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="backdrop-blur-md bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-3xl p-6 border border-yellow-400/30 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Listening Tip</h3>
            </div>
            <p className="text-white/90 text-lg">
              <strong>Pro Tip:</strong> Listen for keywords to catch the main
              idea! Focus on repeated words and phrases - they often contain
              the most important information.
            </p>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="max-w-3xl mx-auto mb-8">
          <h3 className="text-2xl font-bold text-white mb-4 text-center">
            Top Listeners
          </h3>
          <div className="flex justify-center gap-4">
            {[
              {
                name: "Aanya",
                position: 1,
                gradient: "from-yellow-400 to-orange-500",
                icon: "🥇",
              },
              {
                name: "Veer",
                position: 2,
                gradient: "from-gray-300 to-gray-400",
                icon: "🥈",
              },
              {
                name: "Riya",
                position: 3,
                gradient: "from-amber-600 to-yellow-600",
                icon: "🥉",
              },
            ].map((user) => (
              <div
                key={user.name}
                className="backdrop-blur-md bg-white/10 rounded-2xl p-4 border border-white/20 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${user.gradient} rounded-full flex items-center justify-center shadow-lg text-lg`}
                  >
                    {user.icon}
                  </div>
                  <div>
                    <div className="text-white font-bold">{user.name}</div>
                    <div className="text-white/60 text-sm">
                      Rank #{user.position}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Recommendations */}
        <div className="max-w-3xl mx-auto">
          <div className="backdrop-blur-md bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-3xl p-6 border border-cyan-400/30 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Recommended Next
              </h3>
            </div>
            <p className="text-white/90 text-lg">
              Ready for more challenges? Try the{" "}
              <strong>Listening Quiz</strong> or dive into our{" "}
              <strong>Story Challenge</strong> to test your comprehension
              skills!
            </p>
            <div className="flex gap-3 mt-4">
              <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Take Quiz
              </button>
              <button className="px-6 py-2 bg-white/20 text-white font-bold rounded-xl border border-white/30 hover:bg-white/30 transform hover:scale-105 transition-all duration-300">
                Story Challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}