import React, { useEffect } from 'react';

const TermsAndConditions = () => {
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms and Conditions</h1>
            <div className="w-20 h-1 bg-primary-600 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Please read these terms carefully before using our services. By accessing our platform, you agree to be bound by these terms.
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
                  <h2 className="text-2xl font-semibold text-gray-900">Acceptance of Terms</h2>
                </div>
                <div className="ml-14">
                  <p className="mb-4">By accessing and using Akshi Dairy's services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.</p>
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
                  <h2 className="text-2xl font-semibold text-gray-900">Service Description</h2>
                </div>
                <div className="ml-14">
                  <p className="mb-4">Akshi Dairy provides:</p>
                  <ul className="list-disc space-y-2 pl-5 text-gray-600">
                    <li>Daily delivery of fresh dairy products</li>
                    <li>Flexible subscription-based delivery services</li>
                    <li>User-friendly online ordering system</li>
                    <li>24/7 customer support services</li>
                  </ul>
                </div>
              </section>

              {/* Section 3 */}
              <section className="policy-section animate-slide-up">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Ordering and Delivery</h2>
                </div>
                <div className="ml-14">
                  <ul className="list-disc space-y-2 pl-5 text-gray-600">
                    <li>Orders must be placed before 9 PM for next-day delivery</li>
                    <li>Delivery times: 6 AM - 9 AM (may vary based on location)</li>
                    <li>Customers must ensure accurate delivery information</li>
                    <li>Service availability subject to delivery zone restrictions</li>
                  </ul>
                </div>
              </section>

              {/* Section 4 */}
              <section className="policy-section animate-slide-up">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Payment Terms</h2>
                </div>
                <div className="ml-14">
                  <ul className="list-disc space-y-2 pl-5 text-gray-600">
                    <li>All prices include applicable taxes</li>
                    <li>Secure payment processing at time of order</li>
                    <li>Multiple payment options available</li>
                    <li>Automated subscription billing</li>
                  </ul>
                </div>
              </section>

              {/* Section 5 */}
              <section className="policy-section animate-slide-up">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Quality Commitment</h2>
                </div>
                <div className="ml-14">
                  <p className="mb-4">We are committed to delivering the highest quality dairy products to your doorstep. Our quality assurance includes:</p>
                  <ul className="list-disc space-y-2 pl-5 text-gray-600">
                    <li>Stringent quality control measures</li>
                    <li>Temperature-controlled delivery</li>
                    <li>Fresh product guarantee</li>
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
                  <p className="mb-4">For any questions or concerns about these terms, please reach out to us:</p>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-center">
                      <span className="font-semibold mr-2">Email:</span>
                      <a href="mailto:support@akshidairy.com" className="text-primary-600 hover:text-primary-700 transition-colors">
                        support@akshidairy.com
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
                      123 Dairy Street, City, State 12345
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

export default TermsAndConditions; 