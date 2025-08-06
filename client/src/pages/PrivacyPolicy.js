import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-green-200">
        <h1 className="text-4xl font-extrabold text-center text-green-950 mb-8">Privacy Policy</h1>

        <div className="prose prose-green max-w-none text-green-800 leading-relaxed">
          <p className="mb-4">
            Your privacy is important to us. This Privacy Policy explains what information
            we collect, how we use it, and what choices you have regarding your information
            when you use "The Good Soil Co." website and services.
          </p>

          <h2 className="text-2xl font-bold text-green-900 mt-8 mb-4">1. Information We Collect</h2>
          <h3 className="text-xl font-semibold text-green-800 mt-6 mb-3">1.1. Personal Information You Provide</h3>
          <p className="mb-4">
            We collect personal information that you voluntarily provide to us when
            you register on the website, place an order, subscribe to our newsletter,
            respond to a survey, or fill out a form. This information may include:
          </p>
          <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
            <li>Name</li>
            <li>Email address</li>
            <li>Shipping address</li>
            <li>Billing address</li>
            <li>Phone number</li>
            <li>Payment information (e.g., credit card details, processed securely by third-party payment gateways)</li>
            <li>Any other information you choose to provide (e.g., garden preferences in our planner)</li>
          </ul>

          <h3 className="text-xl font-semibold text-green-800 mt-6 mb-3">1.2. Information Collected Automatically</h3>
          <p className="mb-4">
            When you visit our website, we may automatically collect certain
            information about your device and usage, including:
          </p>
          <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Referring URLs</li>
            <li>Pages viewed and navigation paths on the site</li>
            <li>Dates and times of access</li>
            <li>Cookie data</li>
          </ul>

          <h2 className="text-2xl font-bold text-green-900 mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">
            We use the information we collect for various purposes, including:
          </p>
          <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
            <li>To process your orders and manage your account.</li>
            <li>To provide, operate, and maintain our website.</li>
            <li>To improve, personalize, and expand our website.</li>
            <li>To understand and analyze how you use our website.</li>
            <li>To develop new products, services, features, and functionality.</li>
            <li>To communicate with you, either directly or through one of our partners,
              including for customer service, to provide you with updates and other
              information relating to the website, and for marketing and promotional purposes.</li>
            <li>To send you emails (if you subscribe to our newsletter).</li>
            <li>To prevent fraud and protect the security of our website.</li>
            <li>To comply with legal obligations.</li>
          </ul>

          <h2 className="text-2xl font-bold text-green-900 mt-8 mb-4">3. Sharing Your Information</h2>
          <p className="mb-4">
            We do not sell, trade, or otherwise transfer your personally identifiable
            information to outside parties without your consent, except in the
            following circumstances:
          </p>
          <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
            <li><strong>Service Providers:</strong> We may share your information with
              third-party service providers who perform services on our behalf,
              such as payment processing, order fulfillment, website hosting, data
              analysis, email delivery, and customer service.</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition,
              or asset sale, your personal information may be transferred.</li>
            <li><strong>Legal Requirements:</strong> We may disclose your information if
              required to do so by law or in response to valid requests by public
              authorities (e.g., a court order or government agency).</li>
            <li><strong>With Your Consent:</strong> We may share your information with
              third parties when we have your explicit consent to do so.</li>
          </ul>

          <h2 className="text-2xl font-bold text-green-900 mt-8 mb-4">4. Data Security</h2>
          <p className="mb-4">
            We implement a variety of security measures to maintain the safety of
            your personal information when you place an order or enter, submit,
            or access your personal information. We offer the use of a secure
            server. All supplied sensitive/credit information is transmitted via
            Secure Socket Layer (SSL) technology and then encrypted into our
            Payment gateway providers' database only to be accessible by those
            authorized with special access rights to such systems, and are
            required to keep the information confidential.
          </p>

          <h2 className="text-2xl font-bold text-green-900 mt-8 mb-4">5. Your Data Protection Rights</h2>
          <p className="mb-4">
            Depending on your location, you may have the following data protection rights:
          </p>
          <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
            <li>The right to access, update, or delete the information we have on you.</li>
            <li>The right to rectify any inaccurate or incomplete information.</li>
            <li>The right to object to our processing of your personal information.</li>
            <li>The right to request that we restrict the processing of your personal information.</li>
            <li>The right to data portability.</li>
            <li>The right to withdraw consent at any time where we rely on your consent to process your personal information.</li>
          </ul>
          <p className="mb-4">
            If you wish to exercise any of these rights, please contact us using the details below.
          </p>

          <h2 className="text-2xl font-bold text-green-900 mt-8 mb-4">6. Cookies</h2>
          <p className="mb-4">
            We use cookies and similar tracking technologies to track the activity
            on our website and hold certain information. Cookies are files with a
            small amount of data which may include an anonymous unique identifier.
            You can instruct your browser to refuse all cookies or to indicate when
            a cookie is being sent. However, if you do not accept cookies, you may
            not be able to use some portions of our website.
          </p>

          <h2 className="text-2xl font-bold text-green-900 mt-8 mb-4">7. Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update our Privacy Policy from time to time. We will notify you
            of any changes by posting the new Privacy Policy on this page. You are
            advised to review this Privacy Policy periodically for any changes.
          </p>

          <h2 className="text-2xl font-bold text-green-900 mt-8 mb-4">8. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
            <li>By email: support@thegoodsoilco.com</li>
            <li>By visiting this page on our website: <Link to="/contact" className="text-green-600 hover:underline">Contact Us</Link></li>
          </ul>
        </div>

        <div className="text-center mt-12">
          <Link to="/">
            <Button className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicyPage;
