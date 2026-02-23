import { Helmet } from 'react-helmet-async';

export default function PrivacyPage() {
  return (
    <>
      <Helmet><title>Privacy Policy — KNOVO</title></Helmet>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-[#C6A75E] text-xs tracking-[0.3em] uppercase mb-3">Legal</p>
        <h1 className="font-serif text-4xl text-[#0B1F3B] mb-2">Privacy Policy</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: January 1, 2025</p>

        <div className="prose prose-sm max-w-none space-y-8 text-gray-600">
          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">1. Introduction</h2>
            <p className="leading-relaxed">KNOVO ("we," "our," or "us") is committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and make purchases. This policy complies with Canada's <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA).</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">2. Information We Collect</h2>
            <p className="leading-relaxed mb-3">We collect information you provide directly to us, including:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Name, email address, and password when you create an account</li>
              <li>Billing and shipping address when you place an order</li>
              <li>Payment information (processed securely by Stripe — we do not store card details)</li>
              <li>Email address when you subscribe to our newsletter</li>
              <li>Communications you send us</li>
            </ul>
            <p className="leading-relaxed mt-3">We also automatically collect certain information when you visit our site, including IP address, browser type, pages visited, and referring URLs.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To process and fulfill your orders</li>
              <li>To send order confirmations and shipping updates</li>
              <li>To send marketing communications (with your consent)</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
              <li>To prevent fraud and ensure security</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">4. Sharing Your Information</h2>
            <p className="leading-relaxed">We do not sell your personal information. We may share it with trusted third-party service providers (such as Stripe for payments, shipping carriers for delivery) solely to provide our services. These providers are contractually obligated to protect your information.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">5. Your Rights Under PIPEDA</h2>
            <p className="leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Withdraw consent for marketing communications at any time</li>
              <li>Request deletion of your account and associated data</li>
            </ul>
            <p className="leading-relaxed mt-3">To exercise these rights, contact us at privacy@knovo.ca.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">6. Data Retention</h2>
            <p className="leading-relaxed">We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, or as required by law. Order records are retained for 7 years for tax purposes.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">7. Cookies</h2>
            <p className="leading-relaxed">We use essential cookies to maintain your session and cart. We do not use tracking or advertising cookies without your consent.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">8. Contact</h2>
            <p className="leading-relaxed">For privacy inquiries, contact our Privacy Officer at: <a href="mailto:privacy@knovo.ca" className="text-[#C6A75E] hover:underline">privacy@knovo.ca</a></p>
          </section>
        </div>
      </div>
    </>
  );
}
