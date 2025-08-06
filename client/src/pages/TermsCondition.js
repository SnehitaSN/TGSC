import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-green-200">
        <h1 className="text-4xl font-extrabold text-center text-green-950 mb-8">Terms and Conditions</h1>

        <div className="prose prose-green max-w-none text-green-800 leading-relaxed">
          <p className="mb-4">
            Welcome to "The Good Soil Co."! These terms and conditions outline the
            rules and regulations for the use of our website, located at
            [Your Website URL Here].
          </p>

          <p className="mb-4">
            By accessing this website, we assume you accept these terms and conditions.
            Do not continue to use The Good Soil Co. if you do not agree to take all
            of the terms and conditions stated on this page.
          </p>

          <h2 className="text-2xl font-bold text-green-900 mt-8 mb-4">1. Definitions</h2>
          <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
            <li><strong>"Company," "We," "Us," "Our"</strong> refers to "The Good Soil Co.".</li>
            <li><strong>"Website"</strong> refers to the website accessible at [Your Website URL Here].</li>
            <li><strong>"User," "You," "Your"</strong> refers to the person accessing or using the Website.</li>
            <li><strong>"Services"</strong> refers to all products, services, content, and features provided by us through the Website.</li>
          </ul>

          <h2 className="text-2xl font-bold text-green-900 mt-8 mb-4">2. Intellectual Property Rights</h2>
          <p className="mb-4">
            Unless otherwise stated, The Good Soil Co. and/or its licensors own the
            intellectual property rights for all material on The Good Soil Co. All
            intellectual property rights are reserved. You may access this from
            The Good Soil Co. for your own personal use subjected to restrictions
            set in these terms and conditions.
          </p>
          <h3 className="text-xl font-semibold text-green-800 mt-6 mb-3">You must not:</h3>
          <ul className="list-disc list-inside mb-4 ml-4 space-y-2">
            <li>Republish material from The Good Soil Co.</li>
            <li>Sell, rent, or sub-license material from The Good Soil Co.</li>
            <li>Reproduce, duplicate, or copy material from The Good Soil Co.</li>
            <li>Redistribute content from The Good Soil Co.</li>
          </ul>

          <h2 className="text-2xl font-bold text-green-900 mt-8 mb-4">3. User Accounts</h2>
          <p className="mb-4">
            When you create an account with us, you must provide us information
            that is accurate, complete, and current at all times. Failure to do
            so constitutes a breach of the Terms, which may result in immediate
            termination of your account on our Service. You are responsible for
            safeguarding the password that you use to access the Service and for
            any activities or actions under your password.
          </p>

          <h2 className="text-2xl font-bold text-green-900 mt-8 mb-4">4. Products and Services</h2>
          <p className="mb-4">
            All products and services listed on the Website are subject to availability.
            We reserve the right to discontinue any product at any time. Prices for
            our products are subject to change without notice. We have made every
            effort to display as accurately as possible the colors and images of our
            products that appear at the store. We cannot guarantee that your computer
            monitor's display of any color will be accurate.
          </p>

          <h2 className="text-2xl font-bold text-green-900 mt-8 mb-4">5. Payment Terms</h2>
          <p className="mb-4">
            All payments made through the Website are processed securely via third-party
            payment gateways. We do not store your full credit card details. By
            submitting an order, you agree to pay the total amount specified in the order.
          </p>

          <h2 className="text-2xl font-bold text-green-900 mt-8 mb-4">6. Limitation of Liability</h2>
          <p className="mb-4">
            In no event shall The Good Soil Co., nor its directors, employees,
            partners, agents, suppliers, or affiliates, be liable for any indirect,
            incidental, special, consequential, or punitive damages, including without
            limitation, loss of profits, data, use, goodwill, or other intangible losses,
            resulting from (i) your access to or use of or inability to access or use
            the Service; (ii) any conduct or content of any third party on the Service;
            (iii) any content obtained from the Service; and (iv) unauthorized access,
            use, or alteration of your transmissions or content, whether based on
            warranty, contract, tort (including negligence), or any other legal theory,
            whether or not we have been informed of the possibility of such damage,
            and even if a remedy set forth herein is found to have failed of its
            essential purpose.
          </p>

          <h2 className="text-2xl font-bold text-green-900 mt-8 mb-4">7. Governing Law</h2>
          <p className="mb-4">
            These Terms shall be governed and construed in accordance with the laws
            of [Your Country/State], without regard to its conflict of law provisions.
          </p>

          <h2 className="text-2xl font-bold text-green-900 mt-8 mb-4">8. Changes to Terms and Conditions</h2>
          <p className="mb-4">
            We reserve the right, at our sole discretion, to modify or replace these
            Terms at any time. If a revision is material, we will provide at least
            30 days' notice prior to any new terms taking effect. What constitutes
            a material change will be determined at our sole discretion.
          </p>

          <h2 className="text-2xl font-bold text-green-900 mt-8 mb-4">9. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us:
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

export default TermsAndConditionsPage;
