import React, { useState, useMemo } from "react";
import {
  Play,
  Sparkles,
  Target,
  BookOpen,
  Zap,
  Shuffle,
  Trophy,
  ChevronRight,
  Filter,
  Search,
  Grid,
  List,
  Star,
  Clock,
  Users,
  Gamepad2,
  Volume2,
  Pen,
  Eye,
  MessageCircle,
  Brain,
  Award,
} from "lucide-react";

const allModules = [
  "All Modules",
  "Spelling",
  "Grammar",
  "Reading",
  "Writing",
  "Listening",
  "Pronunciation",
  "Vocabulary",
  "SHARP",
];

// Updated categories with more appropriate gaming categories
const allCategories = [
  "All Categories",
  "Word Puzzle",
  "Memory Challenge",
  "Educational Adventure",
  "Creative Workshop",
  "Competitive Arena",
  "Audio Learning",
  "Strategy Game",
];

// Updated games with better categorization
const games = [
  {
    id: 1,
    name: "Balloon Pop",
    module: "Spelling",
    category: "Word Puzzle",
    description:
      "Pop balloons to reveal letters and build words in this colorful spelling adventure",
    color: "bg-gradient-to-br from-pink-500 to-rose-600",
    difficulty: "Easy",
    duration: "5-10 min",
    players: "Single",
    rating: 4.8,
    path: "/english-skills-building-games/ballon-pop-spelling",
  },
  {
    id: 2,
    name: "Listen And Match",
    module: "Listening",
    category: "Audio Learning",
    description:
      "Sharpen your listening skills by matching sounds with their corresponding words",
    color: "bg-gradient-to-br from-blue-500 to-cyan-600",
    difficulty: "Medium",
    duration: "10-15 min",
    players: "Single",
    rating: 4.6,
    path: "/english-skills-building-games/listen-and-match",
  },
  {
    id: 3,
    name: "Magic Spelling Cauldron",
    module: "Spelling",
    category: "Educational Adventure",
    description:
      "Cast spelling spells and brew magical words in this enchanting learning quest",
    color: "bg-gradient-to-br from-purple-500 to-violet-600",
    difficulty: "Medium",
    duration: "15-20 min",
    players: "Single",
    rating: 4.9,
    path: "/english-skills-building-games/magic-spelling",
  },
  {
    id: 4,
    name: "Punctuation Adventure",
    module: "Grammar",
    category: "Educational Adventure",
    description:
      "Embark on an epic journey to master punctuation marks and grammar rules",
    color: "bg-gradient-to-br from-green-500 to-emerald-600",
    difficulty: "Hard",
    duration: "20-25 min",
    players: "Single",
    rating: 4.7,
    path: "/english-skills-building-games/punctuation-adventure",
  },
  {
    id: 5,
    name: "SHARP Word Hunt",
    module: "SHARP",
    category: "Strategy Game",
    description:
      "Hunt for hidden SHARP words using strategic thinking and pattern recognition",
    color: "bg-gradient-to-br from-orange-500 to-amber-600",
    difficulty: "Hard",
    duration: "15-30 min",
    players: "Single",
    rating: 4.5,
    path: "/english-skills-building-games/sharpwordhunt",
  },
  {
    id: 6,
    name: "Spelling Mastery",
    module: "Spelling",
    category: "Art of Spelling",
    description:
      "Spell the letters to master the art of spelling",
    color: "bg-gradient-to-br from-yellow-500 to-orange-500",
    difficulty: "Medium",
    duration: "10-15 min",
    players: "Multiplayer",
    rating: 4.8,
    path: "/english-skills-building-games/spelling-game",
  },
  {
    id: 7,
    name: "Story Scramble",
    module: "Writing",
    category: "Creative Workshop",
    description:
      "Unleash your creativity by reconstructing scrambled stories and narratives",
    color: "bg-gradient-to-br from-teal-500 to-cyan-600",
    difficulty: "Medium",
    duration: "20-30 min",
    players: "Single",
    rating: 4.4,
    path: "/english-skills-building-games/storyscramble",
  },
  {
    id: 8,
    name: "Super Hero Reading",
    module: "Reading",
    category: "Educational Adventure",
    description:
      "Transform into a reading superhero and save the world through comprehension",
    color: "bg-gradient-to-br from-red-500 to-pink-600",
    difficulty: "Easy",
    duration: "15-25 min",
    players: "Single",
    rating: 4.9,
    path: "/english-skills-building-games/super-hero-reading-academy",
  },
];

const EnglishSkillsBuildingGames = () => {
  const [hoveredGame, setHoveredGame] = useState(null);
  const [selectedModule, setSelectedModule] = useState("All Modules");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");

  const filteredAndSortedGames = useMemo(() => {
    let filtered = games.filter((game) => {
      const matchModule =
        selectedModule === "All Modules" || game.module === selectedModule;
      const matchCategory =
        selectedCategory === "All Categories" ||
        game.category === selectedCategory;
      const matchSearch =
        searchTerm === "" ||
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchModule && matchCategory && matchSearch;
    });

    // Sort games
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "difficulty":
          const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [selectedModule, selectedCategory, searchTerm, sortBy]);

  const getIcon = (index) => {
    const icons = [Sparkles, Target, BookOpen, Zap, Shuffle, Trophy, Pen, Eye];
    const IconComponent = icons[index % icons.length];
    return <IconComponent className="w-6 h-6 text-white" />;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getModuleIcon = (module) => {
    const moduleIcons = {
      Spelling: Pen,
      Grammar: BookOpen,
      Reading: Eye,
      Writing: Pen,
      Listening: Volume2,
      Pronunciation: MessageCircle,
      Vocabulary: Brain,
      SHARP: Award,
    };
    const IconComponent = moduleIcons[module] || BookOpen;
    return <IconComponent className="w-4 h-4" />;
  };

  const resetFilters = () => {
    setSelectedModule("All Modules");
    setSelectedCategory("All Categories");
    setSearchTerm("");
    setSortBy("name");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative bg-gradient-to-br from-indigo-900/90 via-purple-900/90 to-pink-900/90 backdrop-blur-sm py-16 text-center border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative z-10">
          <div className="flex justify-center items-center gap-4 mb-6">
            <Gamepad2 className="w-16 h-16 text-yellow-400 animate-bounce" />
            <Trophy className="w-16 h-16 text-yellow-400" />
            <Gamepad2 className="w-16 h-16 text-yellow-400 animate-bounce delay-300" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4">
            English Skills Game Hub
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Master English through engaging games • Choose your adventure •
            Level up your skills
          </p>
          <div className="flex justify-center gap-8 mt-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{games.length} Games Available</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>4.7 Average Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>5-30 Min Sessions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Section */}
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">
              Find Your Perfect Game
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Module Filter */}
            <div className="relative">
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-all"
              >
                {allModules.map((module) => (
                  <option
                    key={module}
                    value={module}
                    className="bg-gray-800 text-white"
                  >
                    {module}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-all"
              >
                {allCategories.map((category) => (
                  <option
                    key={category}
                    value={category}
                    className="bg-gray-800 text-white"
                  >
                    {category}
                  </option>
                ))}
              </select>
              <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort By */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer transition-all"
              >
                <option value="name" className="bg-gray-800 text-white">
                  Sort by Name
                </option>
                <option value="rating" className="bg-gray-800 text-white">
                  Sort by Rating
                </option>
                <option value="difficulty" className="bg-gray-800 text-white">
                  Sort by Difficulty
                </option>
              </select>
              <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-300 text-sm">
                Showing {filteredAndSortedGames.length} of {games.length} games
              </span>
              {(selectedModule !== "All Modules" ||
                selectedCategory !== "All Categories" ||
                searchTerm) && (
                <button
                  onClick={resetFilters}
                  className="px-3 py-1 text-xs bg-red-500/20 text-red-300 rounded-full hover:bg-red-500/30 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">View:</span>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 text-gray-400 hover:text-white"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 text-gray-400 hover:text-white"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Games Grid/List */}
      <div className="relative max-w-7xl mx-auto px-4 pb-16">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedGames.map((game, index) => (
              <div
                key={game.id}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer"
                onMouseEnter={() => setHoveredGame(game.id)}
                onMouseLeave={() => setHoveredGame(null)}
              >
                <div
                  className={`inline-flex p-4 rounded-2xl ${game.color} mb-4 shadow-lg`}
                >
                  {getIcon(index)}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  {getModuleIcon(game.module)}
                  <span className="text-xs font-medium text-blue-300">
                    {game.module}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                      game.difficulty
                    )}`}
                  >
                    {game.difficulty}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-300">{game.rating}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-2 text-white group-hover:text-blue-300 transition-colors">
                  {game.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {game.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {game.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {game.players}
                  </span>
                </div>

                <button
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 group-hover:shadow-lg"
                  onClick={() => (window.location.href = game.path)}
                >
                  <Play className="w-4 h-4" />
                  Play Now
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-300 ${
                      hoveredGame === game.id ? "translate-x-1" : ""
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedGames.map((game, index) => (
              <div
                key={game.id}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredGame(game.id)}
                onMouseLeave={() => setHoveredGame(null)}
              >
                <div className="flex items-center gap-6">
                  <div
                    className={`flex-shrink-0 p-4 rounded-2xl ${game.color}`}
                  >
                    {getIcon(index)}
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-bold text-white">
                        {game.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        {getModuleIcon(game.module)}
                        <span className="text-sm text-blue-300">
                          {game.module}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                          game.difficulty
                        )}`}
                      >
                        {game.difficulty}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-300">
                          {game.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 mb-3">{game.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {game.duration}
                      </span>
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {game.players}
                      </span>
                      <span className="px-2 py-1 bg-white/10 rounded-full text-xs">
                        {game.category}
                      </span>
                    </div>
                  </div>

                  <button
                    className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300"
                    onClick={() => (window.location.href = game.path)}
                  >
                    <Play className="w-4 h-4" />
                    Play Now
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-300 ${
                        hoveredGame === game.id ? "translate-x-1" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredAndSortedGames.length === 0 && (
          <div className="text-center py-16">
            <div className="relative">
              <div className="text-8xl mb-4 animate-bounce">🎮</div>
              <div className="absolute -top-2 -right-8 text-4xl animate-pulse">
                ✨
              </div>
              <div className="absolute -top-4 -left-6 text-3xl animate-ping">
                🌟
              </div>
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-4">
              🚀 Awesome Games Coming Soon! 🚀
            </h3>
            <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed">
              Our game wizards are cooking up{" "}
              <span className="text-yellow-400 font-bold">
                super cool games
              </span>{" "}
              for your selection!
            </p>
            <p className="text-lg text-blue-300 mb-8">
              🎯 Meanwhile, why not try these other{" "}
              <span className="text-pink-400 font-bold">
                amazing adventures
              </span>
              ?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={resetFilters}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
              >
                🎲 Show Me All Games!
              </button>
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <span className="animate-pulse">🔔</span>
                <span>We'll notify you when new games arrive!</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnglishSkillsBuildingGames;
