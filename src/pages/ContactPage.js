import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  Loader2, 
  CheckCircle, 
  X, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Youtube, 
  MessageCircle 
} from 'lucide-react';

const SOCIALS = [
  {
    href: 'https://x.com/MasterOfAlphabet',
    label: 'X',
    icon: X,
    color: 'from-gray-700 to-gray-900',
    hoverColor: 'hover:from-gray-800 hover:to-black'
  },
  {
    href: 'https://facebook.com/MasterOfAlphabet',
    label: 'Facebook',
    icon: Facebook,
    color: 'from-blue-500 to-blue-700',
    hoverColor: 'hover:from-blue-600 hover:to-blue-800'
  },
  {
    href: 'https://instagram.com/MasterOfAlphabet',
    label: 'Instagram',
    icon: Instagram,
    color: 'from-pink-500 to-purple-600',
    hoverColor: 'hover:from-pink-600 hover:to-purple-700'
  },
  {
    href: 'https://linkedin.com/company/MasterOfAlphabet',
    label: 'LinkedIn',
    icon: Linkedin,
    color: 'from-blue-600 to-blue-800',
    hoverColor: 'hover:from-blue-700 hover:to-blue-900'
  },
  {
    href: 'https://youtube.com/@MasterOfAlphabet',
    label: 'YouTube',
    icon: Youtube,
    color: 'from-red-500 to-red-700',
    hoverColor: 'hover:from-red-600 hover:to-red-800'
  },
  {
    href: 'https://wa.me/18005551234',
    label: 'WhatsApp',
    icon: MessageCircle,
    color: 'from-green-500 to-green-700',
    hoverColor: 'hover:from-green-600 hover:to-green-800'
  }
];

const FloatingShape = ({ className, delay = 0 }) => (
  <div 
    className={`absolute rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 blur-xl animate-pulse ${className}`}
    style={{ 
      animationDelay: `${delay}s`,
      animation: `float 6s ease-in-out infinite ${delay}s, pulse 4s ease-in-out infinite ${delay}s`
    }}
  />
);

const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    {/* Animated gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 opacity-80" />
    
    {/* Floating shapes */}
    <FloatingShape className="w-72 h-72 top-10 left-10" delay={0} />
    <FloatingShape className="w-96 h-96 top-1/4 right-20" delay={2} />
    <FloatingShape className="w-80 h-80 bottom-20 left-1/4" delay={4} />
    <FloatingShape className="w-64 h-64 bottom-10 right-10" delay={1} />
    
    {/* Animated mesh gradient */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
    
    {/* Grid pattern */}
    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />
  </div>
);

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Add floating animation keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-20px) rotate(1deg); }
        66% { transform: translateY(-10px) rotate(-1deg); }
      }
      
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
        50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); }
      }
    `;
    document.head.appendChild(style);
    
    return () => document.head.removeChild(style);
  }, []);

  const subjectOptions = [
    { value: 'support', label: 'Support' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'inquiry', label: 'General Inquiry' },
    { value: 'partnership', label: 'Partnership' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    if (success) setSuccess(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.subject) newErrors.subject = 'Please select a subject';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1300);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="relative z-10 px-4 py-8 md:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-block">
              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6 leading-tight">
                Get in Touch
              </h1>
              <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-8 transform scale-x-0 animate-pulse" 
                   style={{ animation: 'scaleX 2s ease-out 0.5s forwards, pulse 2s ease-in-out infinite' }} />
            </div>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              Have a question, feedback, or partnership idea? We're always excited to connect with you. 
              <span className="block mt-2 text-purple-300 font-medium">Reach out and let's start a conversation!</span>
            </p>
            
            {/* Social Media Links */}
            <div className="flex justify-center gap-4 flex-wrap">
              {SOCIALS.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative p-4 rounded-2xl bg-gradient-to-r ${social.color} 
                               transform hover:scale-110 transition-all duration-300 ${social.hoverColor}
                               shadow-lg hover:shadow-2xl border border-white/10 backdrop-blur-sm`}
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      animation: `fadeInUp 0.8s ease-out ${index * 0.1}s both`
                    }}
                  >
                    <Icon size={24} className="text-white group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      {social.label}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl h-full
                             hover:bg-white/15 transition-all duration-500 transform hover:scale-105">
                <div className="space-y-8">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Contact Information</h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto" />
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4 group">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <MapPin size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-lg mb-1">Master of Alphabet HQ</h3>
                        <p className="text-gray-300 leading-relaxed">
                          123 Alphabet Avenue<br />
                          Education City, EC 12345
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 group">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Phone size={24} className="text-white" />
                      </div>
                      <div>
                        <a href="tel:+18005551234" 
                           className="text-white font-semibold text-lg hover:text-purple-300 transition-colors duration-300">
                          +1 (800) 555-1234
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 group">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                        <Mail size={24} className="text-white" />
                      </div>
                      <div>
                        <a href="mailto:support@masterofalphabet.com" 
                           className="text-white font-semibold text-lg hover:text-purple-300 transition-colors duration-300 break-all">
                          support@masterofalphabet.com
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  {/* Interactive Map */}
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-4 border border-white/10">
                    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-inner">
                      <iframe
                        title="Master of Alphabet HQ Location"
                        width="100%"
                        height="200"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src="https://www.google.com/maps?q=123+Alphabet+Avenue+Education+City+EC+12345&output=embed"
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-gray-300 italic">
                      ✨ We usually respond within 1-2 business days
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl
                             hover:bg-white/15 transition-all duration-500">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Send Us a Message</h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4" />
                  <p className="text-gray-300">Fill out the form below and we'll get back to you soon.</p>
                </div>
                
                {success && (
                  <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-2xl backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                      <CheckCircle size={24} className="text-green-400" />
                      <span className="text-green-100 font-medium">Your message has been sent successfully!</span>
                    </div>
                  </div>
                )}
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-white font-medium">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm
                                 transition-all duration-300 hover:bg-white/15"
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-white font-medium">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 
                                 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm
                                 transition-all duration-300 hover:bg-white/15"
                        placeholder="Enter your email address"
                      />
                      {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-white font-medium">Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white 
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm
                               transition-all duration-300 hover:bg-white/15"
                    >
                      <option value="" className="bg-gray-800 text-white">Select a subject</option>
                      {subjectOptions.map(option => (
                        <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.subject && <p className="text-red-400 text-sm">{errors.subject}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-white font-medium">Your Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 
                               focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm
                               transition-all duration-300 hover:bg-white/15 resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                    {errors.message && <p className="text-red-400 text-sm">{errors.message}</p>}
                  </div>
                  
                  <div className="text-center pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="group relative px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl 
                               text-white font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 
                               transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                               hover:from-purple-700 hover:to-pink-700 border border-white/10"
                    >
                      <span className="flex items-center justify-center space-x-3">
                        {submitting ? (
                          <>
                            <Loader2 size={20} className="animate-spin" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
                            <span>Send Message</span>
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300 -z-10" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Additional CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleX {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </div>
  );
}