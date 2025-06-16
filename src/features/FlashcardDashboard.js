import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ModuleCard = ({ 
  module, 
  progress, 
  onNavigate, 
  isLoading 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      key={module.id}
      className={`rounded-xl shadow-lg p-6 text-white ${module.color} flex flex-col justify-between transition-all duration-300 
        ${isHovered ? 'transform hover:scale-[1.03] shadow-xl' : ''}
        ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-labelledby={`module-title-${module.id}`}
    >
      {isLoading ? (
        <div className="animate-pulse space-y-4 w-full">
          <div className="h-8 w-8 bg-white bg-opacity-30 rounded-full"></div>
          <div className="h-6 w-3/4 bg-white bg-opacity-30 rounded"></div>
          <div className="h-4 w-full bg-white bg-opacity-30 rounded"></div>
          <div className="h-2 w-full bg-white bg-opacity-30 rounded-full mt-6">
            <div className="h-2 bg-white rounded-full" style={{ width: '30%' }}></div>
          </div>
        </div>
      ) : (
        <>
          <div>
            <div className="text-4xl mb-2" aria-hidden="true">
              {module.icon}
            </div>
            <h2 
              id={`module-title-${module.id}`}
              className="text-2xl font-bold mb-1"
            >
              {module.name}
            </h2>
            <p className="text-sm opacity-90 mb-3">{module.description}</p>
          </div>

          <div className="my-4">
            <div className="h-2 w-full bg-white bg-opacity-30 rounded-full">
              <div
                className="h-2 bg-white rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span>Today's Progress</span>
              <span>{progress}%</span>
            </div>
          </div>

          <button
            className={`mt-3 bg-white text-black px-4 py-2 rounded-lg font-semibold 
              hover:bg-opacity-90 transition flex items-center justify-center gap-2
              ${module.id === 'reading' ? 'hover:bg-yellow-400' : ''}`}
            onClick={() => onNavigate(module.id)}
            aria-label={`Start learning ${module.name}`}
          >
            <span aria-hidden="true">🚀</span>
            Start Learning
          </button>
        </>
      )}
    </div>
  );
};

ModuleCard.propTypes = {
  module: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
  }).isRequired,
  progress: PropTypes.number.isRequired,
  onNavigate: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

const FlashcardDashboard = ({ modulesConfig, userProgress }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setModules(modulesConfig || defaultModules);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [modulesConfig]);

  const handleNavigate = (moduleId) => {
    // Add analytics or pre-loading here if needed
    navigate(`/flashcards/${moduleId}`);
  };

  const getModuleProgress = (moduleId) => {
    return userProgress?.[moduleId] || 0;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-8">
        🎯 Master Your Skills
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <ModuleCard
            key={mod.id}
            module={mod}
            progress={getModuleProgress(mod.id)}
            onNavigate={handleNavigate}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
};

// Default modules if none provided
const defaultModules = [
  {
    id: 'vocabulary',
    name: 'Vocabulary',
    icon: '🧠',
    description: 'Master tricky words with spaced repetition.',
    color: 'bg-purple-600',
  },
  // ... rest of the modules
];

FlashcardDashboard.propTypes = {
  modulesConfig: PropTypes.array,
  userProgress: PropTypes.object,
};

FlashcardDashboard.defaultProps = {
  modulesConfig: null,
  userProgress: {},
};

export default FlashcardDashboard;