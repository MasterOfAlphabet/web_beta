// === components/Footer/FooterLinks.js ===
export default function FooterLinks() {
  return (
    <nav className="flex flex-col gap-2 text-sm">
      <a href="/offers-promotions" className="hover:text-yellow-200">Offers & Promotions</a>
      <a href="/help-faq" className="hover:text-yellow-200">Help & FAQ</a>
      <a href="/terms-of-service" className="hover:text-yellow-200">Terms of Service</a>
      <a href="/privacy-policy" className="hover:text-yellow-200">Privacy Policy</a>
    </nav>
  );
}