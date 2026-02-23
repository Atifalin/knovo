import { Helmet } from 'react-helmet-async';

export default function ShippingPage() {
  return (
    <>
      <Helmet><title>Shipping & Returns — KNOVO</title></Helmet>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-[#C6A75E] text-xs tracking-[0.3em] uppercase mb-3">Policies</p>
        <h1 className="font-serif text-4xl text-[#0B1F3B] mb-2">Shipping & Returns</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: January 1, 2025</p>
        <div className="space-y-8 text-gray-600">
          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">Shipping</h2>
            <ul className="space-y-3 text-sm leading-relaxed">
              <li><strong className="text-[#0B1F3B]">Free Shipping:</strong> On all orders over CAD $150 before taxes.</li>
              <li><strong className="text-[#0B1F3B]">Standard Shipping:</strong> CAD $12.99 — 3 to 7 business days.</li>
              <li><strong className="text-[#0B1F3B]">Processing Time:</strong> Orders are processed within 1–2 business days.</li>
              <li><strong className="text-[#0B1F3B]">Shipping Region:</strong> Canada only at this time.</li>
              <li><strong className="text-[#0B1F3B]">Tracking:</strong> A tracking number will be emailed once your order ships.</li>
            </ul>
          </section>
          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">Returns</h2>
            <p className="text-sm leading-relaxed mb-3">We want you to be completely satisfied with your KNOVO purchase. If for any reason you are not, we accept returns under the following conditions:</p>
            <ul className="space-y-2 text-sm leading-relaxed list-disc pl-5">
              <li>Items must be returned within <strong className="text-[#0B1F3B]">30 days</strong> of delivery.</li>
              <li>Items must be <strong className="text-[#0B1F3B]">unworn, unwashed</strong>, and in original packaging with all tags attached.</li>
              <li>Sale items and gift cards are <strong className="text-[#0B1F3B]">final sale</strong> and cannot be returned.</li>
              <li>Items showing signs of wear, damage, or alteration will not be accepted.</li>
            </ul>
          </section>
          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">How to Return</h2>
            <ol className="space-y-2 text-sm leading-relaxed list-decimal pl-5">
              <li>Email <a href="mailto:returns@knovo.ca" className="text-[#C6A75E] hover:underline">returns@knovo.ca</a> with your order number and reason for return.</li>
              <li>We will provide a prepaid Canada Post return label within 1 business day.</li>
              <li>Pack items securely and drop off at any Canada Post location.</li>
              <li>Refunds are processed within 5–7 business days of receiving the return.</li>
            </ol>
          </section>
          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">Exchanges</h2>
            <p className="text-sm leading-relaxed">We do not process direct exchanges. To exchange an item, please return the original and place a new order.</p>
          </section>
        </div>
      </div>
    </>
  );
}
