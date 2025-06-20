import { BookOpen, Users, Award } from "lucide-react";

export default function Features() {
  const features = [
    { icon: BookOpen, text: "Interactive Learning" },
    { icon: Users, text: "Community Support" },
    { icon: Award, text: "Certified Courses" }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
        Features
      </h3>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3 text-sm text-gray-200 hover:text-yellow-200 transition-colors cursor-pointer">
            <feature.icon className="w-4 h-4 flex-shrink-0" />
            <span>{feature.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}