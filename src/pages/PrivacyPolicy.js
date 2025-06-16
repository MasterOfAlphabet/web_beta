export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      <p className="text-gray-600 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
      
      <div className="prose prose-blue max-w-none">
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
          <p className="mb-4">
            Master of Alphabet ("we," "our," or "us") is committed to protecting the privacy of all users ("you" or "your") 
            of our educational platform and competition services. This Privacy Policy explains how we collect, use, disclose, 
            and safeguard your information when you use our services.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-medium text-gray-700 mb-2">2.1 Personal Information</h3>
          <ul className="list-disc ml-5 space-y-2 mb-4">
            <li><strong>Student Data:</strong> Name, age, grade/class, school name, parent/guardian contact information</li>
            <li><strong>Account Information:</strong> Email address, username, password (hashed)</li>
            <li><strong>Payment Details:</strong> Transaction history, payment method (processed via secure third-party processors)</li>
          </ul>
          
          <h3 className="text-xl font-medium text-gray-700 mb-2">2.2 Usage Data</h3>
          <ul className="list-disc ml-5 space-y-2">
            <li>Challenge participation history and scores</li>
            <li>Skill assessment results and progress</li>
            <li>Device information (browser type, IP address for security purposes)</li>
            <li>Cookies and similar tracking technologies (essential and analytics)</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. How We Use Information</h2>
          <ul className="list-disc ml-5 space-y-2">
            <li>To provide and personalize our educational services</li>
            <li>To administer competitions and display leaderboards</li>
            <li>To communicate important updates and competition results</li>
            <li>To improve our platform and develop new features</li>
            <li>To ensure compliance with our Terms of Service</li>
            <li>For security and fraud prevention</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Data Sharing and Disclosure</h2>
          <p className="mb-2">We may share information in these limited circumstances:</p>
          <ul className="list-disc ml-5 space-y-2">
            <li><strong>With Schools:</strong> For school-sponsored accounts, progress reports may be shared with designated school administrators</li>
            <li><strong>For Competition Results:</strong> Winner names and schools may be published on our platform</li>
            <li><strong>Service Providers:</strong> Trusted vendors who assist with payment processing, hosting, and analytics (under strict confidentiality agreements)</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
          </ul>
          <p className="mt-4">We <strong>never</strong> sell student data to third parties.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Data Security</h2>
          <p>
            We implement industry-standard security measures including encryption (SSL/TLS), regular security audits, 
            and access controls. All payment transactions are processed through PCI-DSS compliant payment processors.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Children's Privacy</h2>
          <p className="mb-2">
            We comply with the Children's Online Privacy Protection Act (COPPA) and similar regulations:
          </p>
          <ul className="list-disc ml-5 space-y-2">
            <li>Parental consent is required for students under 13</li>
            <li>Parents can review, edit, or request deletion of their child's information</li>
            <li>We collect only minimal required information from children</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Your Rights</h2>
          <ul className="list-disc ml-5 space-y-2">
            <li>Access and update your personal information</li>
            <li>Request deletion of your account and data</li>
            <li>Opt-out of marketing communications</li>
            <li>Withdraw consent (where applicable)</li>
          </ul>
          <p className="mt-4">Contact us at privacy@masterofalphabet.com to exercise these rights.</p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Policy Updates</h2>
          <p>
            We may update this policy periodically. Significant changes will be notified via email or platform notice. 
            Continued use after changes constitutes acceptance of the revised policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Contact Us</h2>
          <p>
            For privacy-related inquiries: <br />
            Email: <a href="mailto:privacy@masterofalphabet.com" className="text-blue-600 underline">privacy@masterofalphabet.com</a> <br />
            Postal: Data Protection Officer, Master of Alphabet, [Your Company Address]
          </p>
        </section>
      </div>
    </div>
  );
}