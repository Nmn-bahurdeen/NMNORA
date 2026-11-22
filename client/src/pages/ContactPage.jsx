import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            Contact & Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            We're Here to Help
          </h1>
          <p className="text-slate-400 text-sm mt-3">
            Have questions about genuine Apple iPhones, 9H tempered glass, MagSafe accessories, or express delivery in Chennai? Contact our support team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-xl space-y-6">
            <h3 className="text-xl font-bold text-white">Store Information</h3>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center flex-shrink-0 border border-blue-500/30">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Phone / WhatsApp</h4>
                  <a href="tel:9943881393" className="text-base font-bold text-white hover:text-blue-400 transition-colors">
                    +91 9943881393
                  </a>
                  <p className="text-xs text-slate-400 mt-0.5">Mon - Sat: 9:30 AM to 9:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center flex-shrink-0 border border-indigo-500/30">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Store Address</h4>
                  <p className="text-base font-semibold text-white">123 Commerce Street</p>
                  <p className="text-sm text-slate-300">Chennai - 600048, Tamil Nadu, India</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center flex-shrink-0 border border-purple-500/30">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xs uppercase font-semibold text-slate-400 tracking-wider">Email Inquiry</h4>
                  <p className="text-base font-semibold text-white">support@nmnora.com</p>
                  <p className="text-xs text-slate-400 mt-0.5">Quick response within 2 hours</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <a
                href="https://wa.me/919943881393"
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/20 text-sm"
              >
                <span>Chat Directly on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-2">Send us a Message</h3>
            <p className="text-slate-400 text-xs mb-6">Leave your query and our Chennai executive will get in touch with you.</p>

            {submitted ? (
              <div className="p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-white">Message Received!</h4>
                <p className="text-slate-400 text-xs mt-1">Thank you for reaching out. We will call you at {formData.phone || 'your phone number'} shortly.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-lg hover:bg-slate-700"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="9943881393"
                      className="w-full px-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Message / Product Inquiry *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what device or accessory you are looking for..."
                    className="w-full px-4 py-3 bg-slate-800/90 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all text-sm"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
