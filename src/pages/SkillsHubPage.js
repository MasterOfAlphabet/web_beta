import React, { useRef, useState, useEffect } from "react";
import { FaPuzzlePiece, FaRocket, FaGamepad, FaBookOpen, FaStar, FaArrowRight, FaArrowUp } from "react-icons/fa";

export default function SkillsHubPage() {
  const assessmentRef = useRef(null);
  const improvementRef = useRef(null);
  const playRef = useRef(null);
  const seriesRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const sectionRefs = {
    assessment: assessmentRef,
    improvement: improvementRef,
    play: playRef,
    series: seriesRef
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    sectionRefs[sectionId].current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-red-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>
      
      <SkillsHubHero />
      <SkillsNavigation scrollToSection={scrollToSection} />
      <SkillsSections sectionRefs={sectionRefs} />
      <FooterCTA />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:-translate-y-1"
        >
          <FaArrowUp className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

// --- Typing Animation Hook ---
function useTypewriter(text, speed = 100) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return displayText;
}

function BlinkingCursor() {
  return (
    <span className="inline-block w-1 h-8 bg-gradient-to-b from-purple-400 to-pink-400 ml-1 animate-pulse"></span>
  );
}

// --- Hero Section ---
function SkillsHubHero() {
  const typedText = useTypewriter("Welcome to the Skills Hub!", 150);
  const [showSubtitle, setShowSubtitle] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSubtitle(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10 gap-12">
        {/* Left Column */}
        <div className="flex-1 text-center lg:text-left">
          <div className="relative mb-8">
            <h1 className="text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 leading-tight">
              {typedText}
              <BlinkingCursor />
            </h1>
            
            {showSubtitle && (
              <div className="animate-fade-in-up">
                <p className="text-3xl lg:text-4xl text-white font-bold mt-6 mb-8 animate-pulse">
                  Unlock Your English Superpowers! ⚡
                </p>
              </div>
            )}
          </div>

          {/* Enhanced Feature Card */}
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-2xl hover:bg-white/15 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-purple-500/25">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <h2 className="text-xl font-bold text-white">
                Your Gateway to Mastering English
              </h2>
            </div>
            
            <div className="space-y-4">
              {[
                { emoji: "🎯", text: "Personalized skill journeys for every student!", color: "from-blue-400 to-blue-600" },
                { emoji: "🎮", text: "Learn & play with fun games, quizzes, and challenges!", color: "from-purple-400 to-purple-600" },
                { emoji: "🏆", text: "Track your progress & celebrate every milestone!", color: "from-pink-400 to-pink-600" }
              ].map((item, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className={`text-2xl p-3 rounded-xl bg-gradient-to-r ${item.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {item.emoji}
                  </div>
                  <span className="text-white font-medium text-lg">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Student Image */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <div className="relative group">
            {/* Glowing ring effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-spin-slow"></div>
            
            <div className="relative w-80 h-96 lg:w-96 lg:h-[30rem] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm">
              <img
                src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=500&facepad=3&q=80"
                alt="Happy student engaged in learning activities"
                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                draggable={false}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 via-transparent to-transparent"></div>
              
              {/* Floating achievement badges */}
              <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-bounce">
                🌟 Level Up!
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Navigation ---
function SkillsNavigation({ scrollToSection }) {
  const [activeButton, setActiveButton] = useState(null);

  const navButtons = [
    {
      id: "assessment",
      label: "Assessment",
      icon: <FaPuzzlePiece className="w-5 h-5" />,
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      id: "improvement",
      label: "Improvement",
      icon: <FaRocket className="w-5 h-5" />,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: "play",
      label: "Play & Learn",
      icon: <FaGamepad className="w-5 h-5" />,
      gradient: "from-red-500 to-orange-500"
    },
    {
      id: "series",
      label: "Skill Series",
      icon: <FaBookOpen className="w-5 h-5" />,
      gradient: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-black/20 backdrop-blur-2xl border-b border-white/10 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-4">
          {navButtons.map((btn, i) => (
            <button
              key={btn.id}
              onClick={() => {
                scrollToSection(btn.id);
                setActiveButton(btn.id);
              }}
              onMouseEnter={() => setActiveButton(btn.id)}
              onMouseLeave={() => setActiveButton(null)}
              className={`group relative flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r ${
                activeButton === btn.id ? btn.gradient : btn.gradient
              } text-white font-bold shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="relative z-10 transform group-hover:scale-110 transition-transform duration-200">
                {btn.icon}
              </span>
              <span className="relative z-10 text-lg">{btn.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

// --- Sections ---
function SkillsSections({ sectionRefs }) {
  // Gradient for each nav section
  const gradients = [
    "from-blue-500 to-indigo-500",
    "from-purple-500 to-pink-500",
    "from-red-500 to-orange-500",
    "from-emerald-500 to-teal-500"
  ];

  const sections = [
    {
      id: 'assessment',
      title: 'Assessment Center',
      icon: <FaPuzzlePiece className="w-8 h-8" />,
      gradient: gradients[0],
      description: 'Discover your current English proficiency level with our comprehensive assessment tools.',
      features: [
        'Accurate skill evaluation in 20 minutes',
        'Detailed breakdown of strengths and weaknesses', 
        'Personalized learning recommendations',
        'Progress tracking over time'
      ],
      cta: 'Take Assessment',
      image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=facearea&w=400&h=400&facepad=2&q=80"
    },
    {
      id: 'improvement',
      title: 'Improvement Lab',
      icon: <FaRocket className="w-8 h-8" />,
      gradient: gradients[1],
      description: 'Targeted exercises to strengthen your specific weak areas and build confidence.',
      features: [
        'Customized practice plans',
        'Grammar and vocabulary builders',
        'Pronunciation guides',
        'Writing improvement tools'
      ],
      cta: 'Start Improving',
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=facearea&w=400&h=400&facepad=2&q=80"
    },
    {
      id: 'play',
      title: 'Play & Learn Arena',
      icon: <FaGamepad className="w-8 h-8" />,
      gradient: gradients[2],
      description: 'Engaging games and interactive activities that make learning English fun.',
      features: [
        'Vocabulary challenge games',
        'Grammar puzzle quests',
        'Listening comprehension adventures',
        'Speaking practice with AI'
      ],
      cta: 'Start Playing',
      image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=facearea&w=400&h=400&facepad=2&q=80"
    },
    {
      id: 'series',
      title: 'Skills Series',
      icon: <FaBookOpen className="w-8 h-8" />,
      gradient: gradients[3],
      description: 'Structured courses that take you from beginner to advanced levels.',
      features: [
        'Progressive learning paths',
        'Thematic skill bundles',
        'Real-world application tasks',
        'Milestone certifications'
      ],
      cta: 'Explore Series',
      image: "https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=facearea&w=400&h=400&facepad=2&q=80"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 space-y-32">
      {sections.map((section, i) => {
        const isEven = i % 2 === 0;
        return (
          <section
            key={section.id}
            id={section.id}
            ref={sectionRefs[section.id]}
            className="scroll-mt-20"
          >
            <div className={`flex flex-col lg:flex-row ${isEven ? "" : "lg:flex-row-reverse"} shadow-2xl rounded-3xl overflow-hidden group`}>
              {/* Vibrant BG for Image half */}
              <div className={`lg:w-1/2 w-full flex items-center justify-center py-12 px-6 bg-gradient-to-br ${section.gradient} relative`}>
                <div className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 group-hover:scale-105 transition-transform duration-700">
                  <img
                    src={section.image}
                    alt={`${section.title} illustration`}
                    className="object-cover w-full h-full"
                    draggable={false}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                </div>
                <div className="absolute top-6 right-6 bg-white/20 p-4 rounded-full shadow-lg">
                  {section.icon}
                </div>
              </div>

              {/* Text Block */}
              <div className="lg:w-1/2 w-full flex flex-col justify-center p-8 lg:p-14 bg-white/10 backdrop-blur-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-2xl bg-gradient-to-r ${section.gradient} shadow-lg`}>
                    <span className="text-white">{section.icon}</span>
                  </div>
                  <h2 className={`text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${section.gradient}`}>
                    {section.title}
                  </h2>
                </div>
                
                <p className="text-white/90 text-xl mb-8 leading-relaxed">{section.description}</p>
                
                <div className="space-y-4 mb-10">
                  {section.features.map((feature, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 group/item"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform duration-200">
                        <FaStar className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-white font-medium text-lg">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button className={`group/btn relative flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r ${section.gradient} text-white font-bold shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 max-w-fit overflow-hidden`}>
                  <span className="relative z-10">{section.cta}</span>
                  <FaArrowRight className="w-5 h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500 transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full"></div>
                </button>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

// --- Footer CTA ---
function FooterCTA() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-12 shadow-2xl">
          <h2 className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6">
            Ready to Transform Your English Skills?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
            Join thousands of students who've already unlocked their English superpowers with our Skills Hub.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-lg shadow-xl hover:shadow-blue-500/30 transform hover:-translate-y-1 transition-all duration-300">
              Get Started Now
            </button>
            <button className="px-10 py-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-lg shadow-xl hover:shadow-purple-500/30 transform hover:-translate-y-1 transition-all duration-300">
              Take a Tour
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Custom Styles ---
const styles = `
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg);}
    to { transform: rotate(360deg);}
  }
  .animate-fade-in-up {animation: fade-in-up 0.8s ease-out forwards;}
  .animate-spin-slow {animation: spin-slow 8s linear infinite;}
  .animation-delay-2000 {animation-delay: 2s;}
  .animation-delay-4000 {animation-delay: 4s;}
`;
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}