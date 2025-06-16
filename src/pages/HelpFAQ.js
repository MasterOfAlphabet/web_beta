import { useState } from 'react';

export default function HelpFAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "1. What is Master of Alphabet?",
      answer: "Master of Alphabet is a national-level English language skills competition and learning platform designed for students from Class I to X. We offer daily challenges, skill assessments, and comprehensive modules to enhance spelling, grammar, reading, writing, pronunciation, and vocabulary skills through gamified learning."
    },
    {
      question: "2. Who can participate in the competition?",
      answer: "The competition is open to all students enrolled in Class I to X in any recognized school across the country. Both individual participants and school-sponsored groups are welcome."
    },
    {
      question: "3. How does the registration process work?",
      answer: "Click on the 'Sign Up' button on our homepage. Students under 13 will need parent/guardian consent. You'll need to provide basic information including name, email, class/grade, and school name. After payment verification, you'll get immediate access."
    },
    {
      question: "4. What are the participation fees?",
      answer: "We charge a nominal one-time registration fee of ₹499 (early bird discounts available). This includes access to all competition challenges, practice modules, and learning resources for the entire academic year."
    },
    {
      question: "5. What technology requirements are needed?",
      answer: "You'll need a smartphone, tablet, or computer with internet access. We recommend Chrome or Safari browsers. No special hardware is required, though headphones are suggested for listening exercises."
    },
    {
      question: "6. How does the scoring system work?",
      answer: "Scores are based on accuracy and speed. Daily challenges give 10-50 points, weekly tournaments up to 100 points, and monthly assessments up to 200 points. Bonus points are awarded for streaks and perfect scores."
    },
    {
      question: "7. Can I practice before competing?",
      answer: "Absolutely! Our Skills Hub offers unlimited practice modules across all language skills. These don't affect your competition scores but help you prepare effectively."
    },
    {
      question: "8. How often are challenges updated?",
      answer: "New daily challenges appear at 8 AM IST. Weekly tournaments refresh every Monday, and monthly assessments are available from the 1st of each month. Special holiday challenges are also offered."
    },
    {
      question: "9. What happens if I miss a daily challenge?",
      answer: "While you can't attempt missed daily challenges, they become available as practice material after 48 hours. Your lowest 3 daily challenge scores are automatically dropped each month."
    },
    {
      question: "10. How are winners selected?",
      answer: "Winners are determined by cumulative scores across categories (by class/grade). Top performers each month qualify for our national finals. We also recognize most improved students and school champions."
    },
    {
      question: "11. What safety measures are in place for children?",
      answer: "We are COPPA compliant. All child accounts require parental consent. Our platform has no external chat features, and all content is educationally appropriate. Parents have dashboard access to monitor activity."
    },
    {
      question: "12. Can schools register multiple students?",
      answer: "Yes! Schools can register unlimited students through our bulk registration portal. School coordinators get special dashboards to track student progress and compare performance across classes."
    },
    {
      question: "13. How do I reset my password?",
      answer: "Click 'Forgot Password' on the login page. You'll receive an email with reset instructions. For child accounts, the registered parent email will receive the reset link."
    },
    {
      question: "14. What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, net banking, and wallet payments through our secure Razorpay integration. Schools can request invoice payments."
    },
    {
      question: "15. How can I contact customer support?",
      answer: "Reach us at support@masterofalphabet.com or +91-9876543210 (9 AM-6 PM, Mon-Sat). For urgent issues during competitions, use the in-app support chat available 8 AM-8 PM daily."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Help Center</h1>
      <p className="text-lg text-gray-600 mb-8">Frequently Asked Questions</p>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              className="w-full px-4 py-4 text-left font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100 transition-all duration-200 flex justify-between items-center"
              onClick={() => toggleAccordion(index)}
            >
              <span>{faq.question}</span>
              <svg
                className={`w-5 h-5 transform transition-transform duration-200 ${activeIndex === index ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {activeIndex === index && (
              <div className="px-4 py-3 bg-white text-gray-700">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-12 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">Still need help?</h2>
        <p className="text-gray-700 mb-4">Our support team is ready to assist you with any questions.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="mailto:support@masterofalphabet.com"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
          >
            Email Us
          </a>
          <a
            href="tel:+919876543210"
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-center"
          >
            Call Support
          </a>
        </div>
      </div>
    </div>
  );
}