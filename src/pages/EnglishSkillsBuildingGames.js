import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Sparkles, Target, Zap, BookOpen, Shuffle, Trophy, ChevronRight } from 'lucide-react';

const EnglishSkillsBuildingGames = () => {
  const [hoveredGame, setHoveredGame] = useState(null);
  const navigate = useNavigate();

  const games = [
    {
      id: 1,
      name: "Balloon Pop Game",
      description: "Pop colorful balloons in this fun and engaging arcade-style game",
      category: "Arcade",
      color: "bg-pink-500",
      path: "/english-skills-building-games/ballon-pop-spelling"
    },
    {
      id: 2,
      name: "Listen And Match Game",
      description: "Test your audio memory skills with this challenging matching game",
      category: "Memory",
      color: "bg-blue-500",
      path: "/english-skills-building-games/listen-and-match"
    },
    {
      id: 3,
      name: "Magic Spelling Cauldron",
      description: "Brew magical words in this enchanting spelling adventure",
      category: "Educational",
      color: "bg-purple-500",
      path: "/english-skills-building-games/magic-spelling"
    },
    {
      id: 4,
      name: "Punctuation Adventure Game",
      description: "Master the art of punctuation with interactive challenges",
      category: "Educational",
      color: "bg-green-500",
      path: "/english-skills-building-games/punctuation-adventure"
    },
    {
      id: 5,
      name: "SHARP Word Hunt",
      description: "Hunt for hidden words in this thrilling word search adventure",
      category: "Puzzle",
      color: "bg-orange-500",
      path: "/english-skills-building-games/sharpwordhunt"
    },
    {
      id: 6,
      name: "Spelling Duel",
      description: "Challenge opponents in epic spelling battles and competitions",
      category: "Competitive",
      color: "bg-yellow-500",
      path: "/english-skills-building-games/spelling-duel"
    },
    {
      id: 7,
      name: "Story Scramble Game",
      description: "Unscramble story pieces to create amazing narrative adventures",
      category: "Creative",
      color: "bg-teal-500",
      path: "/english-skills-building-games/storyscramble"
    },
     {
      id: 8,
      name: "Super-Hero-Reading-Academy",
      description: "Train to become the ultimate reading superhero!",
      category: "Arcade",
      color: "bg-pink-500",
      path: "/english-skills-building-games/super-hero-reading-academy"
    },
  ];

  const getIcon = (index) => {
    const icons = [Sparkles, Target, BookOpen, BookOpen, Target, Zap, Shuffle, Sparkles]; // Added 8th icon
    const IconComponent = icons[index];
    return <IconComponent className="w-6 h-6 text-white" />;
  };

  const handlePlayClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <div className="mb-8">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h1 className="text-6xl font-bold mb-6">
              Game <span className="text-yellow-400">Collection</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Discover an amazing collection of interactive games designed to entertain, 
              educate, and challenge players of all ages
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                className="flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 rounded-full font-semibold transition-colors"
                onClick={() => navigate('/games')}
              >
                <Play className="w-5 h-5" />
                Start Playing
                <ChevronRight className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-6 text-gray-300">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{games.length}</div>
                  <div className="text-sm">Games</div>
                </div>
                <div className="w-px h-8 bg-gray-600"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">5</div>
                  <div className="text-sm">Categories</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Choose Your Adventure
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Each game offers unique challenges and endless fun. Pick your favorite and start playing today!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <div
              key={game.id}
              className="bg-gray-800 rounded-2xl p-8 hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 cursor-pointer"
              onMouseEnter={() => setHoveredGame(game.id)}
              onMouseLeave={() => setHoveredGame(null)}
            >
              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl ${game.color} mb-6`}>
                {getIcon(index)}
              </div>
              
              {/* Category Badge */}
              <div className="mb-4">
                <span className="px-3 py-1 bg-gray-700 text-white text-xs font-medium rounded-full">
                  {game.category}
                </span>
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-white mb-3">
                {game.name}
              </h3>
              
              <p className="text-gray-400 mb-6">
                {game.description}
              </p>
              
              <button 
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors"
                onClick={() => handlePlayClick(game.path)}
              >
                <Play className="w-4 h-4" />
                Play Now
                <ChevronRight className={`w-4 h-4 transition-transform ${hoveredGame === game.id ? 'translate-x-1' : ''}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-gray-400 mb-4">
            Ready to challenge yourself with more games?
          </p>
          <button 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors"
            onClick={() => navigate('/games/all')}
          >
            Explore More Games
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnglishSkillsBuildingGames;