import { Helmet } from 'react-helmet-async';

export default function RefundPage() {
  return (
    <>
      <Helmet><title>Refund Policy — KNOVO</title></Helmet>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-[#C6A75E] text-xs tracking-[0.3em] uppercase mb-3">Policies</p>
        <h1 className="font-serif text-4xl text-[#0B1F3B] mb-2">Refund Policy</h1>
        <p className="text-gray-400 text-sm mb-10">Last updated: January 1, 2025</p>
        <div className="space-y-8 text-gray-600 text-sm leading-relaxed">
          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">Eligibility</h2>
            <p>Refunds are available on eligible items returned within 30 days of delivery. Items must be unworn, in original condition with all tags attached. Sale items are final sale and not eligible for refunds.</p>
          </section>
          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">Refund Process</h2>
            <p>Once we receive and inspect your return, we will notify you by email. Approved refunds are processed to your original payment method within 5–7 business days. Please allow additional time for your bank to post the credit.</p>
          </section>
          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">Damaged or Incorrect Items</h2>
            <p>If you receive a damaged or incorrect item, please contact us at <a href="mailto:hello@knovo.ca" className="text-[#C6A75E] hover:underline">hello@knovo.ca</a> within 48 hours of delivery with photos. We will arrange a replacement or full refund at no cost to you.</p>
          </section>
          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">Non-Refundable Items</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Sale and discounted items</li>
              <li>Gift cards</li>
              <li>Items showing signs of wear, damage, or alteration</li>
              <li>Items returned after 30 days</li>
            </ul>
          </section>
          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">Shipping Costs</h2>
            <p>Original shipping charges are non-refundable unless the return is due to our error. Return shipping is covered by KNOVO via a prepaid label.</p>
          </section>
          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-3">Contact</h2>
            <p>For refund inquiries: <a href="mailto:returns@knovo.ca" className="text-[#C6A75E] hover:underline">returns@knovo.ca</a></p>
          </section>
        </div>
      </div>
    </>
  );
}
