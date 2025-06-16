export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
      <p className="text-gray-600 mb-8">Effective Date: {new Date().toLocaleDateString()}</p>
      
      <div className="prose prose-blue max-w-none">
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Master of Alphabet's ("we," "us," or "our") website, mobile application, 
            or services (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). 
            If you do not agree, you may not use the Service.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Eligibility</h2>
          <ul className="list-disc ml-5 space-y-2">
            <li>The Service is available only to students currently enrolled in Class I to X</li>
            <li>Users under 13 require parental consent and supervision</li>
            <li>Schools may register students through authorized representatives</li>
            <li>Each participant must maintain one individual account</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Account Registration</h2>
          <ul className="list-disc ml-5 space-y-2">
            <li>You must provide accurate and complete registration information</li>
            <li>You are responsible for maintaining account confidentiality</li>
            <li>You must immediately notify us of any unauthorized account use</li>
            <li>We reserve the right to refuse service or terminate accounts at our discretion</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Competition Rules</h2>
          <h3 className="text-xl font-medium text-gray-700 mb-2">4.1 General Conduct</h3>
          <ul className="list-disc ml-5 space-y-2 mb-4">
            <li>All challenges must be completed independently without assistance</li>
            <li>Use of external resources during timed challenges is prohibited</li>
            <li>Participants must respect all other users and competition officials</li>
          </ul>
          
          <h3 className="text-xl font-medium text-gray-700 mb-2">4.2 Scoring and Rankings</h3>
          <ul className="list-disc ml-5 space-y-2">
            <li>Scores are calculated based on accuracy and completion time</li>
            <li>All results are subject to verification and audit</li>
            <li>We reserve the right to adjust scores for technical errors or rule violations</li>
            <li>Monthly winners will be notified via registered email</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Intellectual Property</h2>
          <ul className="list-disc ml-5 space-y-2">
            <li>All content on the Service is our property or licensed to us</li>
            <li>Participants retain rights to their submissions but grant us a license to use them</li>
            <li>Unauthorized reproduction or distribution of competition materials is prohibited</li>
            <li>School and student names may be used in promotional materials</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Fees and Payments</h2>
          <ul className="list-disc ml-5 space-y-2">
            <li>All fees are non-refundable except as required by law</li>
            <li>We may change fees with 30 days' notice</li>
            <li>Schools may request invoices for bulk registrations</li>
            <li>Chargebacks will result in immediate account termination</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Privacy</h2>
          <p>
            Your privacy is important to us. Our Privacy Policy explains how we collect and use your information 
            and is incorporated into these Terms by reference.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Prohibited Conduct</h2>
          <p className="mb-2">You agree not to:</p>
          <ul className="list-disc ml-5 space-y-2">
            <li>Use the Service for any unlawful purpose</li>
            <li>Attempt to compromise the security or fairness of competitions</li>
            <li>Create multiple accounts or share accounts</li>
            <li>Harass other participants or staff</li>
            <li>Reverse engineer or interfere with the Service's functionality</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Termination</h2>
          <p>
            We may suspend or terminate your access to the Service for violation of these Terms or for any other 
            reason at our sole discretion. Terminated accounts may not re-register without written permission.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Disclaimers</h2>
          <ul className="list-disc ml-5 space-y-2">
            <li>The Service is provided "as is" without warranties of any kind</li>
            <li>We do not guarantee uninterrupted or error-free operation</li>
            <li>We are not responsible for internet connectivity issues during competitions</li>
            <li>Participation does not guarantee academic improvement or competition success</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, 
            or consequential damages resulting from your use of the Service.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Governing Law</h2>
          <p>
            These Terms shall be governed by the laws of India. Any disputes shall be resolved in the courts of [Your Jurisdiction].
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">13. Changes to Terms</h2>
          <p>
            We may modify these Terms at any time. Continued use after changes constitutes acceptance. Material changes 
            will be notified via email or Service notification.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">14. Contact Information</h2>
          <p>
            For questions about these Terms: <br />
            Email: <a href="mailto:legal@masterofalphabet.com" className="text-blue-600 underline">legal@masterofalphabet.com</a> <br />
            Postal: Legal Department, Master of Alphabet, [Your Company Address]
          </p>
        </section>
      </div>
    </div>
  );
}