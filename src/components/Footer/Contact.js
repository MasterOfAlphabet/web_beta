// === components/Footer/Contact.js ===
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  const contactInfo = [
    { icon: Mail, text: "hello@masterofalphabet.com", href: "mailto:hello@masterofalphabet.com" },
    { icon: Phone, text: "+1 (555) 123-4567", href: "tel:+15551234567" },
    { icon: MapPin, text: "123 Learning Street, Education City, EC 12345", href: null }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-2">
        Contact Us
      </h3>
      <div className="space-y-3">
        {contactInfo.map((contact, index) => (
          <div key={index} className="flex items-start gap-3 text-sm text-gray-200">
            <contact.icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {contact.href ? (
              <a 
                href={contact.href} 
                className="hover:text-yellow-200 transition-colors break-all"
              >
                {contact.text}
              </a>
            ) : (
              <span className="leading-relaxed">{contact.text}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}