import React, { useState, useEffect } from 'react';
import { Trophy, Zap, Target, Swords, Gift, Crown, Star, Sparkles, ChevronRight, Users, Award, Gamepad2 } from 'lucide-react';

const TalentHub = () => {
  const [selectedGrade, setSelectedGrade] = useState('I-II');
  const [animateCards, setAnimateCards] = useState(false);

  useEffect(() => {
    setAnimateCards(true);
  }, []);

  const gradeGroups = [
    { id: 'I-II', label: 'Class I-II', color: 'from-pink-400 to-rose-500', participants: '2.5K+' },
    { id: 'III-V', label: 'Class III-V', color: 'from-blue-400 to-indigo-500', participants: '4.2K+' },
    { id: 'VI-X', label: 'Class VI-X', color: 'from-purple-400 to-violet-500', participants: '6.8K+' }
  ];

  const activities = [
    {
      id: 'quiz',
      title: 'Smart Quiz',
      description: 'Test your vocabulary and grammar skills with adaptive questions',
      icon: Target,
      color: 'from-emerald-400 to-teal-500',
      gradient: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      points: '50-200 pts',
      duration: '15 mins',
      difficulty: 'Adaptive'
    },
    {
      id: 'battles',
      title: 'Word Battles',
      description: 'Challenge friends in real-time vocabulary duels',
      icon: Swords,
      color: 'from-red-400 to-pink-500',
      gradient: 'bg-gradient-to-br from-red-50 to-pink-50',
      points: '100-500 pts',
      duration: '10 mins',
      difficulty: 'Competitive'
    },
    {
      id: 'challenges',
      title: 'Daily Challenges',
      description: 'Complete unique tasks and unlock achievements',
      icon: Zap,
      color: 'from-amber-400 to-orange-500',
      gradient: 'bg-gradient-to-br from-amber-50 to-orange-50',
      points: '25-150 pts',
      duration: '5-20 mins',
      difficulty: 'Varied'
    },
    {
      id: 'competitions',
      title: 'Mega Competitions',
      description: 'Join nationwide tournaments for ultimate glory',
      icon: Trophy,
      color: 'from-violet-400 to-purple-500',
      gradient: 'bg-gradient-to-br from-violet-50 to-purple-50',
      points: '500-2000 pts',
      duration: '30-60 mins',
      difficulty: 'Expert'
    }
  ];

  const rewards = [
    { icon: Crown, title: 'National Recognition', desc: 'Certificate & Hall of Fame' },
    { icon: Gamepad2, title: 'Gamified Rewards', desc: 'Badges, Levels & XP' },
    { icon: Gift, title: 'Exciting Prizes', desc: 'Gadgets, Books & Vouchers' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-green-200 to-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg animate-bounce">
            <Sparkles className="w-4 h-4" />
            Master of Alphabet Competition
            <Sparkles className="w-4 h-4" />
          </div>
          
          <h1 className="text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4 animate-fade-in">
            Talent Hub
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Unleash your English mastery through exciting competitions, battles, and challenges. 
            Win national recognition and amazing prizes!
          </p>
        </div>

        {/* Grade Selection */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-white/20">
            <div className="flex gap-2">
              {gradeGroups.map((grade) => (
                <button
                  key={grade.id}
                  onClick={() => setSelectedGrade(grade.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative overflow-hidden group ${
                    selectedGrade === grade.id
                      ? `bg-gradient-to-r ${grade.color} text-white shadow-lg scale-105`
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <div className="relative z-10">
                    <div className="font-bold">{grade.label}</div>
                    <div className="text-xs opacity-80">{grade.participants} active</div>
                  </div>
                  {selectedGrade !== grade.id && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${grade.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div
                key={activity.id}
                className={`group cursor-pointer transform transition-all duration-500 hover:scale-105 ${
                  animateCards ? 'animate-fade-in' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={`${activity.gradient} rounded-3xl p-8 shadow-xl border border-white/20 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 relative overflow-hidden h-full`}>
                  {/* Hover Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${activity.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${activity.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{activity.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{activity.description}</p>
                  
                  {/* Stats */}
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Points:</span>
                      <span className="font-semibold text-gray-700">{activity.points}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-semibold text-gray-700">{activity.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Level:</span>
                      <span className="font-semibold text-gray-700">{activity.difficulty}</span>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <button className={`w-full bg-gradient-to-r ${activity.color} text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 group-hover:gap-3`}>
                    Start Now
                    <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rewards Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl mb-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-black mb-4 flex items-center justify-center gap-3">
                <Star className="w-10 h-10 text-yellow-300 animate-pulse" />
                Amazing Rewards Await
                <Star className="w-10 h-10 text-yellow-300 animate-pulse" />
              </h2>
              <p className="text-xl opacity-90">Compete, Excel, and Win Big!</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {rewards.map((reward, index) => {
                const Icon = reward.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:bg-white/30 transition-all duration-300 group-hover:scale-105">
                      <Icon className="w-12 h-12 mx-auto mb-4 text-yellow-300 group-hover:scale-110 transition-transform duration-300" />
                      <h3 className="text-xl font-bold mb-2">{reward.title}</h3>
                      <p className="opacity-90">{reward.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-black text-gray-800 mb-2">13.5K+</h3>
            <p className="text-gray-600">Active Participants</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-black text-gray-800 mb-2">2.8K+</h3>
            <p className="text-gray-600">Awards Distributed</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-black text-gray-800 mb-2">156</h3>
            <p className="text-gray-600">National Champions</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-xl px-12 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transform transition-all duration-300 hover:scale-105 hover:from-purple-700 hover:to-pink-700 inline-flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            Join the Competition Now
            <ChevronRight className="w-6 h-6" />
          </button>
          <p className="text-gray-600 mt-4 text-lg">Start your journey to English mastery today!</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TalentHub;