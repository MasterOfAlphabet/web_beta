import React, { useState } from "react";
import {
  BookOpen,
  Mic,
  PenTool,
  Volume2,
  FileText,
  Headphones,
  MessageSquare,
  Award,
  Trophy,
  Target,
  Zap,
  Star,
  Users,
  Crown,
  Sparkles,
  TrendingUp,
  Gift,
  Medal,
  ChevronRight,
  Play,
  Globe,
  Brain,
  Heart,
  Lightbulb,
  Rocket,
  Shield,
  BookMarked,
  Compass,
} from "lucide-react";

const modules = [
  {
    name: "Spelling",
    icon: <PenTool className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
    tagline: "Words Without Worry",
    description:
      "Transform spelling anxiety into spelling mastery through phonetic patterns, memory techniques, and visual word recognition.",
    masterSkills: [
      "Phonetic Pattern Recognition",
      "Silent Letter Mastery",
      "Compound Word Construction",
      "Etymology-Based Learning",
    ],
    realWorldImpact:
      "Write emails, essays, and exams with absolute confidence. Never second-guess your spelling again.",
    funFact:
      "Students master 2000+ commonly misspelled words through our systematic approach",
  },
  {
    name: "Reading",
    icon: <BookOpen className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
    tagline: "Stories That Shape Minds",
    description:
      "Develop speed reading, comprehension, and critical analysis through diverse literature from classics to contemporary works.",
    masterSkills: [
      "Speed Reading Techniques",
      "Contextual Understanding",
      "Literary Analysis",
      "Genre Appreciation",
    ],
    realWorldImpact:
      "Absorb knowledge faster, understand complex texts, and develop a lifelong love for learning.",
    funFact:
      "Our students read 3x faster while maintaining 95%+ comprehension rates",
  },
  {
    name: "Pronunciation",
    icon: <Mic className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500",
    tagline: "Speak Like a Native",
    description:
      "Perfect your accent, intonation, and speech clarity through AI-powered feedback and phonetic training.",
    masterSkills: [
      "Accent Neutralization",
      "Stress Pattern Mastery",
      "Intonation Control",
      "Rhythm and Flow",
    ],
    realWorldImpact:
      "Command attention in presentations, interviews, and conversations with crystal-clear speech.",
    funFact:
      "Practice with 15+ accent variations including British, American, and Australian English",
  },
  {
    name: "Grammar",
    icon: <FileText className="w-6 h-6" />,
    color: "from-orange-500 to-red-500",
    tagline: "Structure Your Success",
    description:
      "Build unshakeable grammatical foundation through interactive exercises, real-world applications, and advanced syntax patterns.",
    masterSkills: [
      "Advanced Sentence Structure",
      "Tense Mastery",
      "Punctuation Precision",
      "Formal vs Informal Usage",
    ],
    realWorldImpact:
      "Write professional documents, academic papers, and creative content with grammatical excellence.",
    funFact:
      "Master 127 essential grammar rules through story-based learning instead of rote memorization",
  },
  {
    name: "Writing",
    icon: <MessageSquare className="w-6 h-6" />,
    color: "from-yellow-500 to-orange-500",
    tagline: "Words That Move Mountains",
    description:
      "Express ideas powerfully through creative writing, persuasive essays, technical documentation, and storytelling mastery.",
    masterSkills: [
      "Creative Storytelling",
      "Persuasive Arguments",
      "Technical Documentation",
      "Poetic Expression",
    ],
    realWorldImpact:
      "Influence decisions, inspire action, and express complex ideas clearly in any format.",
    funFact:
      "Students write 50+ different text types from poetry to business proposals",
  },
  {
    name: "Listening",
    icon: <Headphones className="w-6 h-6" />,
    color: "from-teal-500 to-blue-500",
    tagline: "Hear Beyond Words",
    description:
      "Develop active listening skills through diverse audio content, accent training, and comprehension strategies.",
    masterSkills: [
      "Active Listening Techniques",
      "Accent Comprehension",
      "Context Clue Recognition",
      "Note-Taking Strategies",
    ],
    realWorldImpact:
      "Understand lectures, podcasts, and conversations perfectly, regardless of speaker's accent or speed.",
    funFact:
      "Train with 500+ audio samples from 25+ countries and regions worldwide",
  },
  {
    name: "Vocabulary",
    icon: <Volume2 className="w-6 h-6" />,
    color: "from-indigo-500 to-purple-500",
    tagline: "Words Are Your Weapons",
    description:
      "Build an extensive vocabulary through contextual learning, word families, and advanced usage patterns.",
    masterSkills: [
      "Contextual Usage",
      "Synonym Mastery",
      "Idiomatic Expressions",
      "Academic Terminology",
    ],
    realWorldImpact:
      "Express yourself precisely, understand complex texts, and impress in academic and professional settings.",
    funFact:
      "Expand your vocabulary by 5000+ words through engaging stories and real-world contexts",
  },
  {
    name: "S.H.A.R.P",
    icon: <Award className="w-6 h-6" />,
    color: "from-pink-500 to-rose-500",
    tagline:
      "Synonyms, Homonyms, Antonyms, Rhyming & Plurals — all mastered together",
    description:
      "Master word relationships fast with integrated practice in S.H.A.R.P Skills.",
    masterSkills: ["Integrated Word Skills", "Rapid Vocabulary Connections"],
    realWorldImpact:
      "Unlock powerful word sense for confident speaking, writing, and reading.",
    funFact: "3× faster progress than studying each skill alone!",
  },
];

const classGroups = [
  {
    label: "Class I-II",
    value: "I-II",
    description: "Foundation builders",
    focus: "Phonics, basic vocabulary, simple sentence structures",
  },
  {
    label: "Class III-V",
    value: "III-V",
    description: "Skill developers",
    focus: "Reading fluency, creative writing, grammar fundamentals",
  },
  {
    label: "Class VI-X",
    value: "VI-X",
    description: "Excellence achievers",
    focus: "Advanced literature, formal writing, competitive preparation",
  },
];

const nationalCompetitions = [
  {
    title: "Young Speakers Championship",
    description: "National oratory competition with live audience",
    prize: "₹2 Lakh + College Scholarship",
    participants: "10,000+ students annually",
  },
  {
    title: "Creative Writing Olympiad",
    description: "Express your imagination through powerful storytelling",
    prize: "₹1.5 Lakh + Publication opportunity",
    participants: "15,000+ budding writers",
  },
  {
    title: "Grammar Champions League",
    description: "Ultimate test of grammatical mastery",
    prize: "₹1 Lakh + Study abroad opportunity",
    participants: "8,000+ grammar enthusiasts",
  },
];

const successStories = [
  {
    name: "Arjun Sharma",
    achievement: "Won National Debate Championship",
    quote:
      "The pronunciation module helped me speak with confidence in front of 5000+ audience",
  },
  {
    name: "Priya Patel",
    achievement: "Published Young Author at age 14",
    quote:
      "The writing module taught me to express my thoughts in ways that touch people's hearts",
  },
  {
    name: "Rohit Kumar",
    achievement: "Secured admission to Oxford University",
    quote: "S.H.A.R.P module prepared me for international academic excellence",
  },
];

export default function EightInOneHub() {
  const [selectedGroup, setSelectedGroup] = useState("I-II");
  const [selectedModule, setSelectedModule] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 p-4 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 mb-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
                  8-In-1 English Hub
                </h1>
                <p className="text-2xl text-white/80 font-medium mb-2">
                  Master English • Win Hearts • Rule the World
                </p>
                <p className="text-lg text-white/70">
                  The only platform that transforms students into{" "}
                  <span className="text-yellow-400 font-bold">
                    Masters of Alphabet
                  </span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-6 h-6 text-cyan-400" />
                <span className="text-white font-semibold">
                  National Recognition
                </span>
              </div>
              <div className="text-sm text-white/70">
                Compete Nationally
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-semibold">
                  Master of Alphabet
                </span>
              </div>
              <p className="text-sm text-white/70">
                Complete mastery of English language through
                scientifically-designed 8-module system
              </p>
            </div>
            <div className="backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-5 h-5 text-pink-400" />
                <span className="text-white font-semibold">
                  Win Hearts of Crowd
                </span>
              </div>
              <p className="text-sm text-white/70">
                Build magnetic personality through eloquent speech, persuasive
                writing, and confident communication
              </p>
            </div>
            <div className="backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">
                  National Championships
                </span>
              </div>
              <p className="text-sm text-white/70">
                Compete in prestigious national competitions and win exciting prizes / gamified rewards.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {classGroups.map((group) => (
              <button
                key={group.value}
                onClick={() => setSelectedGroup(group.value)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  selectedGroup === group.value
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105"
                    : "backdrop-blur-sm bg-white/10 text-white/80 hover:bg-white/20 border border-white/20"
                }`}
              >
                <div className="text-center">
                  <div className="font-bold">{group.label}</div>
                  <div className="text-xs opacity-80">{group.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Class Focus */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 mb-8 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <Compass className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">
              {classGroups.find((g) => g.value === selectedGroup)?.label} Focus
              Areas
            </h3>
          </div>
          <p className="text-white/80 text-lg">
            {classGroups.find((g) => g.value === selectedGroup)?.focus}
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {modules.map((module, index) => (
            <div
              key={module.name}
              className="group backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
              onClick={() =>
                setSelectedModule(selectedModule === index ? null : index)
              }
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-r ${module.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  {module.icon}
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-white/60 transition-transform duration-300 ${
                    selectedModule === index ? "rotate-90" : ""
                  }`}
                />
              </div>

              <h3 className="text-xl font-bold text-white mb-1">
                {module.name}
              </h3>
              <p className="text-sm text-cyan-400 font-medium mb-3">
                {module.tagline}
              </p>
              <p className="text-sm text-white/70 mb-4">{module.description}</p>

              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-white/60">{module.funFact}</span>
              </div>

              {selectedModule === index && (
                <div className="mt-4 pt-4 border-t border-white/20 animate-in slide-in-from-top duration-300">
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Master These Skills:
                  </h4>
                  <ul className="space-y-1 mb-4">
                    {module.masterSkills.map((skill, i) => (
                      <li
                        key={i}
                        className="text-xs text-white/70 flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                        {skill}
                      </li>
                    ))}
                  </ul>
                  <div className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30 mb-3">
                    <p className="text-xs text-white/80">
                      <strong>Real Impact:</strong> {module.realWorldImpact}
                    </p>
                  </div>
                  <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
                    <Rocket className="w-4 h-4" />
                    Master This Module
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* National Competitions */}
        <div className="backdrop-blur-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl border border-yellow-500/30 p-6 mb-8 shadow-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Medal className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                National Championships
              </h3>
              <p className="text-white/80">
                Where Masters of Alphabet compete for glory
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nationalCompetitions.map((comp, index) => (
              <div
                key={index}
                className="backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/20"
              >
                <h4 className="font-semibold text-white mb-2">{comp.title}</h4>
                <p className="text-sm text-white/70 mb-3">{comp.description}</p>
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400 font-medium">
                    {comp.prize}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-white/60">
                    {comp.participants}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 p-6 mb-8 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Masters of Alphabet in Action
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {successStories.map((story, index) => (
              <div
                key={index}
                className="backdrop-blur-sm bg-white/10 rounded-xl p-4 border border-white/20"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {story.name[0]}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{story.name}</h4>
                    <p className="text-xs text-cyan-400">{story.achievement}</p>
                  </div>
                </div>
                <p className="text-sm text-white/70 italic">"{story.quote}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="backdrop-blur-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30 p-8 text-center shadow-xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-yellow-400" />
            <h3 className="text-3xl font-bold text-white">
              Ready to Become a Master of Alphabet?
            </h3>
          </div>
          <p className="text-xl text-white/80 mb-6 max-w-3xl mx-auto">
            Join the elite community of English masters who win hearts with
            their words, dominate national competitions, and open doors to
            unlimited opportunities worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 flex items-center gap-2 justify-center hover:scale-105">
              <Shield className="w-5 h-5" />
              Begin Your Mastery Journey
            </button>
            <button className="backdrop-blur-sm bg-white/10 text-white px-8 py-4 rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center gap-2 justify-center">
              <BookMarked className="w-5 h-5" />
              Explore All Modules
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
