import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
  useEffect(() => {
    // Trigger animation for sections on mount
    const sections = document.querySelectorAll('.policy-section');
    sections.forEach((section, index) => {
      section.style.animationDelay = `${index * 0.1}s`;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section with animation */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <div className="w-20 h-1 bg-primary-600 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              At Ma Amma Ruchulu pickles, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal information.
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
            <div className="space-y-8 text-gray-600">
              {/* Section 1 */}
              <section className="policy-section animate-slide-up">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Information We Collect</h2>
                </div>
                <div className="ml-14">
                  <p className="mb-4">We collect information that you provide directly to us, including:</p>
                  <ul className="list-disc space-y-2 pl-5 text-gray-600">
                    <li>Personal identification information (Name, email address, phone number)</li>
                    <li>Delivery address and preferences for order fulfillment</li>
                    <li>Payment information for processing transactions</li>
                    <li>Order history and product preferences to improve our service</li>
                  </ul>
                </div>
              </section>

              {/* Section 2 */}
              <section className="policy-section animate-slide-up">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">How We Use Your Information</h2>
                </div>
                <div className="ml-14">
                  <p className="mb-4">We use the collected information for the following purposes:</p>
                  <ul className="list-disc space-y-2 pl-5 text-gray-600">
                    <li>Processing and delivering your orders efficiently</li>
                    <li>Sending important order updates and delivery notifications</li>
                    <li>Improving our products and services based on feedback</li>
                    <li>Communicating about promotions and updates (with your consent)</li>
                  </ul>
                </div>
              </section>

              {/* Section 3 */}
              <section className="policy-section animate-slide-up">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Data Security</h2>
                </div>
                <div className="ml-14">
                  <p className="mb-4">We implement robust security measures to protect your information:</p>
                  <ul className="list-disc space-y-2 pl-5 text-gray-600">
                    <li>End-to-end encryption for sensitive data transmission</li>
                    <li>Regular security audits and assessments</li>
                    <li>Strict access controls and authentication measures</li>
                    <li>Compliance with industry security standards</li>
                  </ul>
                </div>
              </section>

              {/* Section 4 */}
              <section className="policy-section animate-slide-up">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Your Rights</h2>
                </div>
                <div className="ml-14">
                  <p className="mb-4">You have the following rights regarding your personal information:</p>
                  <ul className="list-disc space-y-2 pl-5 text-gray-600">
                    <li>Access and review your personal information</li>
                    <li>Request corrections to inaccurate data</li>
                    <li>Request deletion of your information</li>
                    <li>Opt-out of marketing communications</li>
                  </ul>
                </div>
              </section>

              {/* Contact Section */}
              <section className="policy-section animate-slide-up bg-gray-50 rounded-lg p-6 mt-8">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Contact Us</h2>
                </div>
                <div className="ml-14">
                  <p className="mb-4">If you have any questions about our Privacy Policy, please contact us:</p>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-center">
                      <span className="font-semibold mr-2">Email:</span>
                      <a href="mailto:privacy@akshidairy.com" className="text-primary-600 hover:text-primary-700 transition-colors">
                        privacy@akshidairy.com
                      </a>
                    </p>
                    <p className="flex items-center">
                      <span className="font-semibold mr-2">Phone:</span>
                      <a href="tel:+1-123-456-7890" className="text-primary-600 hover:text-primary-700 transition-colors">
                        +1 (123) 456-7890
                      </a>
                    </p>
                    <p className="flex items-center">
                      <span className="font-semibold mr-2">Address:</span>
                      4-7-62/2, Shivaji nagar, Attapur, Hyderabad, 500048.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Last Updated */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 flex items-center justify-end">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

// Add these styles to your CSS/Tailwind config
/*
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

.animate-slide-up {
  opacity: 0;
  animation: slide-up 0.6s ease-out forwards;
}

.policy-section {
  opacity: 0;
  animation: slide-up 0.6s ease-out forwards;
}
*/