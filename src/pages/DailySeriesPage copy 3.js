import React, { useState } from 'react';
import { Sun, BookOpen, Target, Trophy, Volume2, Eye, Brain, Zap, Star, ArrowRight, Play, CheckCircle, Calendar, Users, MessageSquare, Headphones, Mic, Gamepad2, Coffee, Clock, Lightbulb, Globe, Film, Music, PenTool, Camera } from 'lucide-react';

const DailySeriesPage = () => {
  const [activeSection, setActiveSection] = useState(null);

  const mainOptions = [
    // Existing categories
    {
      id: 'skill-spotlight',
      title: 'Skill Spotlight',
      description: 'Listen for key words to understand the main idea.',
      icon: Sun,
      color: 'from-amber-400 to-orange-500',
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      buttonText: 'Explore Tips',
      duration: '15 min'
    },
    {
      id: 'word-of-day',
      title: 'Word of The Day',
      description: 'Discover, learn, and use a new word every day!',
      icon: BookOpen,
      color: 'from-purple-400 to-pink-500',
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      buttonText: 'Explore Series',
      duration: '10 min'
    },
    {
      id: 'daily-learning',
      title: 'Daily Learning',
      description: 'Bite-sized lessons, every single day!',
      icon: Target,
      color: 'from-teal-400 to-cyan-500',
      textColor: 'text-teal-700',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      buttonText: 'Start Learning',
      duration: '15 min'
    },
    {
      id: 'daily-challenges',
      title: 'Daily Challenges',
      description: 'Compete, have fun, and win rewards!',
      icon: Trophy,
      color: 'from-orange-400 to-red-500',
      textColor: 'text-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      buttonText: 'View Challenges',
      duration: '15 min'
    },
    // New engaging categories
    {
      id: 'conversation-café',
      title: 'Conversation Café',
      description: 'Daily chat scenarios with AI partners and real topics!',
      icon: MessageSquare,
      color: 'from-emerald-400 to-teal-500',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      buttonText: 'Start Chatting',
      duration: '15 min'
    },
    {
      id: 'story-spotlight',
      title: 'Story Spotlight',
      description: 'Engaging mini-stories with comprehension games!',
      icon: Film,
      color: 'from-indigo-400 to-blue-500',
      textColor: 'text-indigo-700',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      buttonText: 'Read & Play',
      duration: '15 min'
    },
    {
      id: 'accent-adventure',
      title: 'Accent Adventure',
      description: 'Master pronunciation with fun tongue twisters & mimics!',
      icon: Mic,
      color: 'from-rose-400 to-pink-500',
      textColor: 'text-rose-700',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      buttonText: 'Practice Speaking',
      duration: '15 min'
    },
    {
      id: 'word-games',
      title: 'Word Games Arena',
      description: 'Puzzles, crosswords, and brain teasers for vocabulary!',
      icon: Gamepad2,
      color: 'from-violet-400 to-purple-500',
      textColor: 'text-violet-700',
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-200',
      buttonText: 'Play Games',
      duration: '15 min'
    },
    {
      id: 'culture-corner',
      title: 'Culture Corner',
      description: 'Explore English-speaking cultures through fun facts!',
      icon: Globe,
      color: 'from-cyan-400 to-blue-500',
      textColor: 'text-cyan-700',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
      buttonText: 'Explore Culture',
      duration: '10 min'
    },
    {
      id: 'music-moments',
      title: 'Music Moments',
      description: 'Learn English through popular songs and lyrics!',
      icon: Music,
      color: 'from-yellow-400 to-orange-500',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      buttonText: 'Tune In',
      duration: '15 min'
    },
    {
      id: 'quick-bites',
      title: 'Quick Bites',
      description: '5-minute grammar, idioms, and tips for busy moments!',
      icon: Coffee,
      color: 'from-amber-500 to-yellow-500',
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      buttonText: 'Quick Learn',
      duration: '5 min'
    },
    {
      id: 'creative-corner',
      title: 'Creative Corner',
      description: 'Write poems, stories, and creative pieces in English!',
      icon: PenTool,
      color: 'from-pink-400 to-rose-500',
      textColor: 'text-pink-700',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      buttonText: 'Get Creative',
      duration: '15 min'
    }
  ];

  // Sample component for one of the new categories
  const ConversationCafeComponent = () => (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-emerald-400 to-teal-500 p-3 rounded-full">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-emerald-800">Today's Conversation Topics</h3>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {[
            { 
              topic: 'Travel Dreams', 
              scenario: 'Planning a weekend trip with friends',
              level: 'Intermediate',
              participants: 'You + AI Travel Buddy',
              duration: '8 mins'
            },
            { 
              topic: 'Food Adventures', 
              scenario: 'Ordering at a trendy restaurant',
              level: 'Beginner',
              participants: 'You + AI Waiter',
              duration: '6 mins'
            },
            { 
              topic: 'Tech Talk', 
              scenario: 'Discussing latest gadgets and apps',
              level: 'Advanced',
              participants: 'You + AI Tech Enthusiast',
              duration: '10 mins'
            }
          ].map((conv, index) => (
            <div key={conv.topic} className="bg-white rounded-xl p-6 shadow-sm border border-emerald-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-emerald-800">{conv.topic}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      conv.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                      conv.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {conv.level}
                    </span>
                  </div>
                  <p className="text-emerald-700 mb-3">{conv.scenario}</p>
                  <div className="flex items-center gap-4 text-sm text-emerald-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {conv.participants}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {conv.duration}
                    </div>
                  </div>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all">
                Start Conversation
              </button>
            </div>
          ))}
        </div>
        
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-200">
            <h5 className="font-semibold text-emerald-800 mb-3">Conversation Stats</h5>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-emerald-700">Conversations</span>
                <span className="text-emerald-600 font-medium">47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700">Confidence Score</span>
                <span className="text-emerald-600 font-medium">8.2/10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700">Favorite Topic</span>
                <span className="text-emerald-600 font-medium">Travel</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-emerald-200">
            <h5 className="font-semibold text-emerald-800 mb-3">Today's Phrases</h5>
            <div className="space-y-2">
              {['That sounds amazing!', 'I couldn\'t agree more', 'What do you think about...?'].map((phrase, index) => (
                <div key={phrase} className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg">
                  <Lightbulb className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-emerald-700">{phrase}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Weekly Schedule Component
  const WeeklyScheduleComponent = () => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-800">Your 30-Minute Daily Plan</h3>
      </div>
      
      <div className="grid md:grid-cols-5 gap-4">
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, index) => (
          <div key={day} className={`p-4 rounded-xl border-2 ${
            index === 4 ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'
          }`}>
            <h4 className="font-semibold text-gray-800 mb-3">{day}</h4>
            {index === 4 ? (
              <div className="text-center">
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-sm text-yellow-700 font-medium">Catch-up & Review Day</p>
                <p className="text-xs text-yellow-600 mt-1">Complete any pending activities</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Module 1</span>
                  </div>
                  <p className="text-xs text-gray-600">15 minutes</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Module 2</span>
                  </div>
                  <p className="text-xs text-gray-600">15 minutes</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Original Components (restored)
  const SkillSpotlightComponent = () => (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-3 rounded-full">
          <Volume2 className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-amber-800">Active Listening Skills</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-200">
            <div className="flex items-center gap-3 mb-3">
              <Eye className="w-5 h-5 text-amber-600" />
              <h4 className="font-semibold text-amber-800">Focus Techniques</h4>
            </div>
            <ul className="space-y-2 text-amber-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-500" />
                Listen for repeated words
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-500" />
                Identify tone changes
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-500" />
                Note emphasis patterns
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-200">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-5 h-5 text-amber-600" />
              <h4 className="font-semibold text-amber-800">Practice Exercise</h4>
            </div>
            <p className="text-amber-700 mb-4">Today's listening challenge: Identify the main topic in a 2-minute audio clip</p>
            <button className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:shadow-lg transition-all">
              <Play className="w-4 h-4" />
              Start Exercise
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-200">
          <h4 className="font-semibold text-amber-800 mb-4">Weekly Progress</h4>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((day) => (
              <div key={day} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${day <= 3 ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-600'}`}>
                  {day}
                </div>
                <div className="flex-1 bg-amber-100 rounded-full h-2">
                  <div className={`h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 ${day <= 3 ? 'w-full' : 'w-0'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const WordOfDayComponent = () => (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-3 rounded-full">
          <Star className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-purple-800">Today's Featured Word</h3>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-purple-200">
          <div className="text-center mb-6">
            <h4 className="text-4xl font-bold text-purple-800 mb-2">Serendipity</h4>
            <p className="text-purple-600 text-lg">/ˌser.ənˈdɪp.ə.t̬i/</p>
            <p className="text-purple-700 mt-2">noun</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold text-purple-800 mb-2">Definition</h5>
              <p className="text-purple-700">The occurrence of events by chance in a happy or beneficial way</p>
            </div>
            
            <div>
              <h5 className="font-semibold text-purple-800 mb-2">Example</h5>
              <p className="text-purple-700 italic">"Finding this cozy café was pure serendipity - it became my favorite study spot!"</p>
            </div>
            
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Coincidence</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Fortune</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Chance</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-200">
            <h5 className="font-semibold text-purple-800 mb-3">Word History</h5>
            <div className="space-y-2">
              {['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'].map((day, index) => (
                <div key={day} className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-purple-700">{day}: {['Ineffable', 'Wanderlust', 'Ephemeral', 'Luminous', 'Serendipity'][index]}</span>
                </div>
              ))}
            </div>
          </div>
          
          <button className="w-full bg-gradient-to-r from-purple-400 to-pink-500 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all">
            <BookOpen className="w-4 h-4" />
            Add to Vocabulary
          </button>
        </div>
      </div>
    </div>
  );

  const DailyLearningComponent = () => (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-teal-400 to-cyan-500 p-3 rounded-full">
          <Target className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-teal-800">Today's Learning Path</h3>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {[
            { title: 'Grammar Basics', progress: 85, time: '5 min', icon: BookOpen },
            { title: 'Vocabulary Builder', progress: 60, time: '7 min', icon: Star },
            { title: 'Pronunciation Practice', progress: 30, time: '10 min', icon: Volume2 },
            { title: 'Reading Comprehension', progress: 0, time: '8 min', icon: Eye }
          ].map((lesson, index) => (
            <div key={lesson.title} className="bg-white rounded-xl p-4 shadow-sm border border-teal-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-teal-100 p-2 rounded-lg">
                    <lesson.icon className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-teal-800">{lesson.title}</h4>
                    <p className="text-sm text-teal-600">{lesson.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-teal-700">{lesson.progress}%</div>
                </div>
              </div>
              <div className="bg-teal-100 rounded-full h-2 mb-3">
                <div 
                  className="h-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 transition-all duration-300"
                  style={{ width: `${lesson.progress}%` }}
                ></div>
              </div>
              <button className="text-teal-600 hover:text-teal-800 text-sm font-medium flex items-center gap-1">
                {lesson.progress > 0 ? 'Continue' : 'Start'} <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-teal-200">
          <h4 className="font-semibold text-teal-800 mb-4">Learning Streak</h4>
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-teal-600 mb-2">12</div>
            <p className="text-teal-700">Days in a row!</p>
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-6">
            {Array.from({ length: 21 }, (_, i) => (
              <div 
                key={i}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium ${
                  i < 12 ? 'bg-teal-500 text-white' : 'bg-teal-100 text-teal-400'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-teal-700">Weekly Goal</span>
              <span className="text-teal-600 font-semibold">5/7 days</span>
            </div>
            <div className="bg-teal-100 rounded-full h-2">
              <div className="h-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 w-5/7"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const DailyChallengesComponent = () => (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-orange-400 to-red-500 p-3 rounded-full">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-orange-800">Today's Challenges</h3>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {[
            { 
              title: 'Speed Reading Challenge', 
              description: 'Read 300 words in under 2 minutes',
              difficulty: 'Easy',
              reward: '50 XP',
              participants: 1247,
              timeLeft: '2h 30m'
            },
            { 
              title: 'Vocabulary Duel', 
              description: 'Match definitions faster than your opponent',
              difficulty: 'Medium',
              reward: '100 XP',
              participants: 892,
              timeLeft: '4h 15m'
            },
            { 
              title: 'Grammar Lightning', 
              description: 'Fix 20 sentences without mistakes',
              difficulty: 'Hard',
              reward: '200 XP',
              participants: 456,
              timeLeft: '1h 45m'
            }
          ].map((challenge, index) => (
            <div key={challenge.title} className="bg-white rounded-xl p-6 shadow-sm border border-orange-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-orange-800">{challenge.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-orange-700 mb-3">{challenge.description}</p>
                  <div className="flex items-center gap-4 text-sm text-orange-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {challenge.participants} joined
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      {challenge.reward}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-orange-700 mb-1">{challenge.timeLeft}</div>
                  <div className="text-xs text-orange-600">remaining</div>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all">
                Join Challenge
              </button>
            </div>
          ))}
        </div>
        
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-200">
            <h5 className="font-semibold text-orange-800 mb-3">Leaderboard</h5>
            <div className="space-y-3">
              {[
                { name: 'Sarah M.', points: 2850, rank: 1 },
                { name: 'Alex K.', points: 2720, rank: 2 },
                { name: 'You', points: 2650, rank: 3 },
                { name: 'Maria L.', points: 2580, rank: 4 },
                { name: 'John D.', points: 2490, rank: 5 }
              ].map((user) => (
                <div key={user.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      user.rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                      user.rank === 2 ? 'bg-gray-300 text-gray-700' :
                      user.rank === 3 ? 'bg-orange-300 text-orange-900' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {user.rank}
                    </div>
                    <span className={`text-sm ${user.name === 'You' ? 'font-semibold text-orange-800' : 'text-orange-700'}`}>
                      {user.name}
                    </span>
                  </div>
                  <span className="text-sm text-orange-600 font-medium">{user.points}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-200">
            <h5 className="font-semibold text-orange-800 mb-3">Your Stats</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-orange-700">Challenges Won</span>
                <span className="text-orange-600 font-medium">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700">Win Rate</span>
                <span className="text-orange-600 font-medium">76%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-700">Total XP</span>
                <span className="text-orange-600 font-medium">2,650</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const componentMap = {
    'skill-spotlight': SkillSpotlightComponent,
    'word-of-day': WordOfDayComponent,
    'daily-learning': DailyLearningComponent,
    'daily-challenges': DailyChallengesComponent,
    'conversation-café': ConversationCafeComponent,
  };

  const ActiveComponent = activeSection ? componentMap[activeSection] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Daily Series Hub
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
            Transform your English Language Skills with just 30 minutes a day!
          </p>
          <p className="text-sm text-gray-500">
            📅 Mon-Thu: 15 min × 2 modules | 🎉 Friday: Catch-up day
          </p>
        </div>

        {/* Weekly Schedule */}
        <WeeklyScheduleComponent />

        {/* Main Options Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          {mainOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                className={`${option.bgColor} ${option.borderColor} border-2 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
                  activeSection === option.id ? 'ring-4 ring-blue-200 scale-[1.02]' : ''
                }`}
                onClick={() => setActiveSection(activeSection === option.id ? null : option.id)}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`bg-gradient-to-r ${option.color} p-3 rounded-full w-fit`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="bg-white px-2 py-1 rounded-full">
                      <span className="text-xs font-medium text-gray-600">{option.duration}</span>
                    </div>
                  </div>
                  
                  <h3 className={`text-xl font-bold ${option.textColor} mb-3`}>
                    {option.title}
                  </h3>
                  
                  <p className={`${option.textColor} mb-6 flex-grow text-sm`}>
                    {option.description}
                  </p>
                  
                  <button 
                    className={`bg-gradient-to-r ${option.color} text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2`}
                  >
                    {option.buttonText}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Component */}
        {ActiveComponent && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <ActiveComponent />
          </div>
        )}

        {/* Engagement Tips */}
        {!activeSection && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Pro Tips for Success</h3>
              <ul className="space-y-2 text-sm">
                <li>• Pick 2 different categories each day for variety</li>
                <li>• Use Friday to catch up on missed activities</li>
                <li>• Mix skills: combine speaking + reading or listening + writing</li>
                <li>• Track your streak and celebrate milestones!</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">🎯 This Week's Focus</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Conversation skills & confidence</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>New vocabulary through stories</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Pronunciation & accent practice</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        {!activeSection && (
          <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ready for Today's 30-Minute Adventure?
            </h2>
            <p className="text-gray-600 mb-6">
              Choose 2 modules to complete your daily English learning journey
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {mainOptions.slice(0, 6).map((option) => (
                <button
                  key={option.id}
                  onClick={() => setActiveSection(option.id)}
                  className={`bg-gradient-to-r ${option.color} text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300 text-sm`}
                >
                  {option.title} ({option.duration})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailySeriesPage;