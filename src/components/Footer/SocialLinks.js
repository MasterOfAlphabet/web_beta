// === components/Footer/SocialLinks.js ===
import { Twitter, Facebook, Instagram, Linkedin, Youtube, Github } from "lucide-react";

export default function SocialLinks() {
  const socialLinks = [
    //{ icon: Twitter, href: "https://twitter.com/masterofalphabet", label: "Twitter", handle: "@masterofalphabet" },
    //{ icon: Facebook, href: "https://facebook.com/masterofalphabet", label: "Facebook", handle: "Master Of Alphabet" },
    { icon: Instagram, href: "https://instagram.com/masterofalphabet", label: "Instagram", handle: "@masterofalphabet" },
    { icon: Linkedin, href: "https://linkedin.com/company/masterofalphabet", label: "LinkedIn", handle: "Master Of Alphabet" },
    { icon: Youtube, href: "https://youtube.com/@masterofalphabet", label: "YouTube", handle: "@masterofalphabet" },
    //{ icon: Github, href: "https://github.com/MasterOfAlphabet", label: "GitHub", handle: "MasterOfAlphabet" }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
        Follow Us
      </h3>
      <div className="space-y-3">
        {socialLinks.map((social, index) => (
          <a
            key={index}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm text-gray-200 hover:text-yellow-200 transition-colors group"
          >
            <social.icon className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
              <span className="font-medium">{social.label}</span>
              <span className="text-xs opacity-80">{social.handle}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}