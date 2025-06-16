// === components/Footer/Footer.js ===
import FooterLinks from './FooterLinks';
import SocialLinks from './SocialLinks';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-pink-600 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white text-blue-600 flex items-center justify-center font-extrabold rounded-full shadow">MOA</div>
            <span className="font-bold text-lg tracking-wide">Master Of Alphabet</span>
          </div>
          <p className="text-sm opacity-80">Empowering English learners, every day.</p>
        </div>

        {/* Links */}
        <FooterLinks />

        {/* Social */}
        <SocialLinks />
      </div>

      <div className="text-center text-xs py-2 bg-blue-900 bg-opacity-30">
        &copy; {new Date().getFullYear()} Master Of Alphabet. All rights reserved.
      </div>
    </footer>
  );
}