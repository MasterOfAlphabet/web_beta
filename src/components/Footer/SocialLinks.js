// === components/Footer/SocialLinks.js ===
import { Mail, Twitter, Github } from "lucide-react";

export default function SocialLinks() {
  return (
    <div className="flex gap-4 items-start">
      <a href="mailto:hello@masterofalphabet.com" aria-label="Email" className="hover:text-yellow-200">
        <Mail className="w-5 h-5" />
      </a>
      <a href="https://twitter.com/yourprofile" aria-label="Twitter" className="hover:text-yellow-200">
        <Twitter className="w-5 h-5" />
      </a>
      <a href="https://github.com/MasterOfAlphabet" aria-label="GitHub" className="hover:text-yellow-200">
        <Github className="w-5 h-5" />
      </a>
    </div>
  );
}
