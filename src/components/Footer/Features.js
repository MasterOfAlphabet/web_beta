import { BookOpen, Users, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Features() {
  const navigate = useNavigate();

  const features = [
    { icon: BookOpen, text: "Challenges", path: "/challenges" },
    { icon: Users, text: "Modules Intro", path: "/modules-intro" },
    { icon: Award, text: "Gamification Levels", path: "/gamification-levels" },
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
