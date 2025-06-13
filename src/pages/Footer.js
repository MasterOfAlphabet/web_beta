import { Github, Mail, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-pink-600 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-extrabold text-xl text-blue-600 shadow">
              MOA
            </div>
            <span className="font-extrabold text-lg tracking-wide">Master Of Alphabet</span>
          </div>
          <span className="text-sm opacity-80">Empowering English learners, every day.</span>
        </div>
        {/* Navigation */}
        <nav className="flex gap-5 text-white font-semibold flex-wrap text-base">
          <a href="/modules/spelling" className="hover:text-yellow-200 transition">Spelling</a>
          <a href="/modules/reading" className="hover:text-yellow-200 transition">Reading</a>
          <a href="/modules/grammar" className="hover:text-yellow-200 transition">Grammar</a>
          <a href="/modules/writing" className="hover:text-yellow-200 transition">Writing</a>
          <a href="/challenges" className="hover:text-yellow-200 transition">Challenges</a>
          <a href="/word-of-the-day" className="hover:text-yellow-200 transition">Word of the Day</a>
        </nav>
        {/* Social/Contact */}
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="mailto:hello@masterofalphabet.com" className="hover:text-yellow-200 transition" aria-label="Email">
            <Mail className="w-5 h-5" />
          </a>
          <a href="https://twitter.com/yourprofile" className="hover:text-yellow-200 transition" aria-label="Twitter">
            <Twitter className="w-5 h-5" />
          </a>
          <a href="https://github.com/MasterOfAlphabet" className="hover:text-yellow-200 transition" aria-label="GitHub">
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
      <div className="text-center text-xs py-2 bg-blue-900 bg-opacity-30 text-white opacity-80">
        &copy; {new Date().getFullYear()} Master Of Alphabet. All rights reserved.
      </div>
    </footer>
  );
}