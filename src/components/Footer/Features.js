import { BookOpen, Users, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Features() {
  const navigate = useNavigate();

  const features = [

    { icon: BookOpen, text: "Word Of The Day Series", path: "/word-of-the-day" },

    { icon: BookOpen, text: "Challenges", path: "/challenges" },
    { icon: Users, text: "Modules Intro", path: "/modules-intro" },
    { icon: Award, text: "Gamification Levels", path: "/gamification-levels" },

    { icon: Award, text: "Test Listening Skills", path: "/test-listening-skills" },
    { icon: Award, text: "Test Spelling Skills", path: "/test-spelling-skills" },
    { icon: Award, text: "Test Reading Skills", path: "/test-reading-skills" },

    { icon: Award, text: "Dictation Master", path: "/dictation-master" },
    { icon: Award, text: "Audio Assignment", path: "/audio-assignment" },

    { icon: Award, text: "Tense Time Travel", path: "/english-skills-building-games/tense-time-travel" },

    { icon: Award, text: "Master Of Alphabetr", path: "/english-skills-building-games/master-of-alphabet" },   

        { icon: Award, text: "Reading Rock Star", path: "/english-skills-building-games/reading-rockstar" },        
        { icon: Award, text: "Pronunciation Power Star", path: "/english-skills-building-games/pronunciation-powerstar" },      
        { icon: Award, text: "Grammar Global Star", path: "/english-skills-building-games/grammar-globalstar" },
        { icon: Award, text: "Vocabulary Variety Star", path: "/english-skills-building-games/vocabulary-varietystar" },
        { icon: Award, text: "SHARP Stylish Starr", path: "/english-skills-building-games/sharp-stylishstar" },

    { icon: Award, text: "Tongue Twister Showdow", path: "/english-skills-building-games/tongue-twister-showdown" },
    { icon: Award, text: "Shadow Reading Race", path: "/english-skills-building-games/shadow-reading-race" },

  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
        Features
      </h3>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li
            key={index}
            onClick={() => navigate(feature.path)}
            className="flex items-center gap-3 text-sm text-gray-200 hover:text-yellow-200 transition-colors cursor-pointer"
          >
            <feature.icon className="w-4 h-4 flex-shrink-0" />
            <span>{feature.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
