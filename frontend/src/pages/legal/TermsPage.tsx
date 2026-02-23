import { Helmet } from 'react-helmet-async';

export default function TermsPage() {
  return (
    <>
      <Helmet><title>Terms & Conditions — KNOVO</title></Helmet>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-[#C6A75E] text-xs tracking-[0.3em] uppercase mb-3">Legal</p>
        <h1 className="font-serif text-4xl text-[#0B1F3B] mb-2">Terms & Conditions</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: January 1, 2025</p>

        <div className="space-y-8 text-gray-600">
          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">By accessing and using the KNOVO website and purchasing our products, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.</p>
          </section>
          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">2. Products & Pricing</h2>
            <p className="leading-relaxed">All prices are listed in Canadian Dollars (CAD) and are subject to applicable taxes. We reserve the right to modify prices at any time. Product descriptions and images are provided for reference; minor variations may occur.</p>
          </section>
          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">3. Orders & Payment</h2>
            <p className="leading-relaxed">By placing an order, you represent that you are authorized to use the payment method provided. Orders are subject to acceptance and availability. We reserve the right to cancel any order at our discretion, with a full refund issued.</p>
          </section>
          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">4. Shipping</h2>
            <p className="leading-relaxed">We ship within Canada only. Delivery times are estimates and not guaranteed. Risk of loss passes to you upon delivery to the carrier. Free shipping applies to orders over CAD $150 before taxes.</p>
          </section>
          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">5. Returns & Refunds</h2>
            <p className="leading-relaxed">Please refer to our Shipping & Returns Policy for full details. Items must be returned within 30 days in original, unworn condition with all tags attached.</p>
          </section>
          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">6. Intellectual Property</h2>
            <p className="leading-relaxed">All content on this website — including text, images, logos, and design — is the property of KNOVO and protected by Canadian copyright law. Unauthorized use is prohibited.</p>
          </section>
          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">7. Limitation of Liability</h2>
            <p className="leading-relaxed">To the maximum extent permitted by law, KNOVO shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or products.</p>
          </section>
          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">8. Governing Law</h2>
            <p className="leading-relaxed">These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein.</p>
          </section>
          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">9. Contact</h2>
            <p className="leading-relaxed">For questions about these Terms, contact us at <a href="mailto:legal@knovo.ca" className="text-[#C6A75E] hover:underline">legal@knovo.ca</a>.</p>
          </section>
        </div>
      </div>
    </>
  );
}
