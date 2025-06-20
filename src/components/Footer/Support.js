import { Headphones, MessageCircle, FileText, Mail } from "lucide-react";

export default function Support() {
  const supportLinks = [
    { icon: Headphones, text: "Help Center", href: "/help" },
    { icon: MessageCircle, text: "Live Chat", href: "/chat" },
    { icon: FileText, text: "Documentation", href: "/docs" },
    { icon: Mail, text: "Contact Support", href: "/support" }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
        Support
      </h3>
      <ul className="space-y-3">
        {supportLinks.map((link, index) => (
          <li key={index}>
            <a 
              href={link.href} 
              className="flex items-center gap-3 text-sm text-gray-200 hover:text-yellow-200 transition-colors"
            >
              <link.icon className="w-4 h-4 flex-shrink-0" />
              <span>{link.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}