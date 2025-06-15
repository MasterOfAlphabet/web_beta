import React, { useState, useRef, useEffect } from 'react';
import { Mic, Play, Pause, RotateCcw, Star, Award, Volume2, BookOpen, Users, TrendingUp, Settings, Home, User } from 'lucide-react';

const PronunciationTool = () => {
  const [selectedClass, setSelectedClass] = useState('I-II');
  const [currentWord, setCurrentWord] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [score, setScore] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(5);
  const [badges, setBadges] = useState(['First Try', 'Daily Practice']);
  const [activeTab, setActiveTab] = useState('practice');
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const playbackRef = useRef(null);

  // Sample words/content for different class groups
  const content = {
    'I-II': {
      words: ['cat', 'dog', 'sun', 'ball', 'tree'],
      type: 'Single Words',
      difficulty: 'Basic',
      expectedScore: '55-70%'
    },
    'III-V': {
      words: ['beautiful', 'elephant', 'wonderful', 'The cat is sleeping', 'Birds fly high'],
      type: 'Words & Simple Sentences',
      difficulty: 'Intermediate',
      expectedScore: '65-75%'
    },
    'VI-X': {
      words: ['The quick brown fox jumps over the lazy dog', 'Pronunciation practice improves communication skills', 'Technology enhances learning experiences'],
      type: 'Complex Sentences',
      difficulty: 'Advanced',
      expectedScore: '70-80%'
    }
  };

  useEffect(() => {
    setCurrentWord(content[selectedClass].words[0]);
    setScore(null);
    setRecordedAudio(null);
  }, [selectedClass]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        
        // Simulate pronunciation scoring
        const randomScore = Math.floor(Math.random() * 30) + (selectedClass === 'I-II' ? 60 : selectedClass === 'III-V' ? 70 : 75);
        setScore(randomScore);
        setAttempts(prev => prev + 1);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playAudio = (audioSrc) => {
    if (playbackRef.current) {
      playbackRef.current.pause();
    }
    
    playbackRef.current = new Audio(audioSrc);
    playbackRef.current.play();
    setIsPlaying(true);
    
    playbackRef.current.onended = () => {
      setIsPlaying(false);
    };
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreMessage = (score) => {
    if (selectedClass === 'I-II') {
      if (score >= 65) return '🌟 Excellent! You did great!';
      if (score >= 55) return '👍 Good job! Keep practicing!';
      return '💪 Nice try! Let\'s practice more!';
    } else if (selectedClass === 'III-V') {
      if (score >= 75) return '🎉 Outstanding pronunciation!';
      if (score >= 65) return '✨ Well done! Almost perfect!';
      return '🔄 Good effort! Try again for better score!';
    } else {
      if (score >= 80) return '🏆 Exceptional pronunciation skills!';
      if (score >= 70) return '⭐ Great job! Professional level!';
      return '📈 Good work! Room for improvement!';
    }
  };

  const ClassSelector = () => (
    <div className="mb-6 bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Select Class Group</h3>
      <div className="grid grid-cols-3 gap-3">
        {Object.keys(content).map((classGroup) => (
          <button
            key={classGroup}
            onClick={() => setSelectedClass(classGroup)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedClass === classGroup
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-semibold">Class {classGroup}</div>
            <div className="text-sm text-gray-600">{content[classGroup].difficulty}</div>
          </button>
        ))}
      </div>
    </div>
  );

  const PracticeInterface = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-gray-800">Pronunciation Practice</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Type: {content[selectedClass].type}</span>
            <span>•</span>
            <span>Expected: {content[selectedClass].expectedScore}</span>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-blue-800">Practice Word/Sentence:</span>
            <button
              onClick={() => playAudio(`data:audio/wav;base64,`)} // Simulated audio
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
            >
              <Volume2 size={16} />
              <span>Listen</span>
            </button>
          </div>
          <div className="text-2xl font-bold text-center text-blue-900 py-2">
            {currentWord}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <h4 className="font-semibold text-gray-700 mb-2">Model Audio</h4>
            <button 
              onClick={() => playAudio(`data:audio/wav;base64,`)}
              className="w-full bg-green-100 hover:bg-green-200 p-4 rounded-lg border border-green-300 transition-colors"
            >
              <Volume2 className="mx-auto mb-2 text-green-600" size={24} />
              <span className="text-green-700 font-semibold">Play Model</span>
            </button>
          </div>

          <div className="text-center">
            <h4 className="font-semibold text-gray-700 mb-2">Your Recording</h4>
            {recordedAudio ? (
              <button 
                onClick={() => playAudio(recordedAudio)}
                disabled={isPlaying}
                className="w-full bg-blue-100 hover:bg-blue-200 p-4 rounded-lg border border-blue-300 transition-colors"
              >
                <Play className="mx-auto mb-2 text-blue-600" size={24} />
                <span className="text-blue-700 font-semibold">Play Recording</span>
              </button>
            ) : (
              <div className="w-full bg-gray-100 p-4 rounded-lg border border-gray-300">
                <Mic className="mx-auto mb-2 text-gray-400" size={24} />
                <span className="text-gray-500">No recording yet</span>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={stopRecording}
            className={`px-8 py-4 rounded-full font-semibold text-white transition-all ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            <Mic className="inline mr-2" size={20} />
            {isRecording ? 'Recording... Release to Stop' : 'Hold to Record'}
          </button>
        </div>

        {score !== null && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center mb-4">
              <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
                {score}%
              </div>
              <div className="text-lg text-gray-700 mt-2">
                {getScoreMessage(score)}
              </div>
            </div>

            {selectedClass !== 'I-II' && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Phoneme Accuracy:</span> {score - 5}%
                </div>
                <div>
                  <span className="font-semibold">Rhythm/Timing:</span> {score - 10}%
                </div>
                {selectedClass === 'VI-X' && (
                  <>
                    <div>
                      <span className="font-semibold">Intonation:</span> {score - 8}%
                    </div>
                    <div>
                      <span className="font-semibold">Fluency:</span> {score - 12}%
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="flex justify-center space-x-3 mt-4">
              <button
                onClick={() => {
                  setScore(null);
                  setRecordedAudio(null);
                }}
                className="flex items-center space-x-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <RotateCcw size={16} />
                <span>Try Again</span>
              </button>
              <button
                onClick={() => {
                  const nextIndex = (content[selectedClass].words.indexOf(currentWord) + 1) % content[selectedClass].words.length;
                  setCurrentWord(content[selectedClass].words[nextIndex]);
                  setScore(null);
                  setRecordedAudio(null);
                }}
                className="flex items-center space-x-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                <span>Next Word</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const ProgressDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Your Progress</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <span className="font-semibold">Total Attempts</span>
            <span className="text-2xl font-bold text-blue-600">{attempts}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span className="font-semibold">Practice Streak</span>
            <span className="text-2xl font-bold text-green-600">{streak} days</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
            <span className="font-semibold">Average Score</span>
            <span className="text-2xl font-bold text-yellow-600">
              {selectedClass === 'I-II' ? '68' : selectedClass === 'III-V' ? '72' : '76'}%
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Achievements</h3>
        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
              <Award className="text-purple-600" size={20} />
              <span className="text-sm font-semibold text-purple-700">{badge}</span>
            </div>
          ))}
          <div className="flex items-center space-x-2 p-3 bg-gold-50 rounded-lg border-2 border-yellow-300">
            <Star className="text-yellow-500" size={20} />
            <span className="text-sm font-semibold text-yellow-700">Star Student</span>
          </div>
          <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
            <TrendingUp className="text-blue-600" size={20} />
            <span className="text-sm font-semibold text-blue-700">Improving</span>
          </div>
        </div>
      </div>
    </div>
  );

  const Features = () => {
    const classFeatures = {
      'I-II': [
        'Single word pronunciation',
        'Visual mouth demonstrations',
        'Color-coded feedback',
        'Star-based scoring',
        'Picture-word association',
        'Slow-motion playback'
      ],
      'III-V': [
        'Short sentence practice',
        'Syllable stress identification',
        'Basic intonation patterns',
        'Minimal pair exercises',
        'Echo practice mode',
        'Progress tracking'
      ],
      'VI-X': [
        'Paragraph practice',
        'Advanced phoneme analysis',
        'Prosody training',
        'Spectrogram visualization',
        'Fluency scoring',
        'Peer comparison'
      ]
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">
          Features for Class {selectedClass}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classFeatures[selectedClass].map((feature, index) => (
            <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Pronunciation Comparison Tool
          </h1>
          <p className="text-lg text-gray-600">
            Advanced pronunciation practice with AI-powered feedback
          </p>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6 p-2">
          <div className="flex space-x-1">
            {[
              { id: 'practice', icon: Mic, label: 'Practice' },
              { id: 'progress', icon: TrendingUp, label: 'Progress' },
              { id: 'features', icon: Settings, label: 'Features' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Class Selector */}
        <ClassSelector />

        {/* Main Content */}
        <div className="space-y-6">
          {activeTab === 'practice' && <PracticeInterface />}
          {activeTab === 'progress' && <ProgressDashboard />}
          {activeTab === 'features' && <Features />}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2025 Pronunciation Learning Tool - Empowering students with AI-driven pronunciation feedback</p>
        </div>
      </div>
    </div>
  );
};

export default PronunciationTool;