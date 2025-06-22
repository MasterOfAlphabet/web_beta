import Features from './Features';
import Support from './Support';
import SocialLinks from './SocialLinks';
import Contact from './Contact';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white mt-12">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Brand Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white text-blue-600 flex items-center justify-center font-extrabold rounded-full shadow-lg text-lg">
              MOA
            </div>
            <span className="font-bold text-2xl tracking-wide">Master Of Alphabet</span>
          </div>
          <p className="text-gray-200 max-w-md mx-auto">
            Empowering English learners worldwide with innovative tools and comprehensive resources for language mastery.
          </p>
        </div>

        {/* Footer Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <Features />
          <Support />
          <SocialLinks />
          <Contact />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black/20 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-4">
              <span>&copy; {new Date().getFullYear()} Master Of Alphabet. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="/privacy-policy" className="hover:text-yellow-200 transition-colors">Privacy Policy</a>
              <a href="/terms-of-service" className="hover:text-yellow-200 transition-colors">Terms of Service</a>
              <a href="/cookie-policy" className="hover:text-yellow-200 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}