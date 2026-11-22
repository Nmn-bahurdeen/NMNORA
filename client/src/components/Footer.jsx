import { Link } from 'react-router-dom';
import { Smartphone, Phone, MapPin, Mail, Share2, MessageCircle, Camera, Shield, Truck, RefreshCw } from 'lucide-react';

const Footer = () => (
  <footer className="bg-gray-950 text-gray-300">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="bg-indigo-600 rounded-xl p-1.5">
              <Smartphone className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-black text-white">NMN<span className="text-indigo-400">ORA</span></span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed mb-5">
            Chennai's #1 destination for authentic Apple iPhones and premium accessories. Every product guaranteed genuine.
          </p>
          <div className="flex gap-3">
            {[Share2, MessageCircle, Camera].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-xl bg-gray-800 hover:bg-indigo-600 flex items-center justify-center transition-colors duration-200">
                <Icon size={16} />
              </a>
            ))}
          </div>
          {/* Trust badges */}
          <div className="mt-6 space-y-2">
            {[
              { icon: Shield, text: '1 Year Warranty on all iPhones' },
              { icon: Truck, text: 'Free Delivery above ₹5,000' },
              { icon: RefreshCw, text: '7-Day Easy Returns' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs text-gray-400">
                <Icon size={13} className="text-indigo-400 flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2.5 text-sm">
            {[
              { to: '/', label: 'Home' },
              { to: '/shop', label: 'All Products' },
              { to: '/shop?category=iPhone', label: 'iPhones' },
              { to: '/shop?category=Cases & Covers', label: 'Cases & Covers' },
              { to: '/shop?category=Temper Glass', label: 'Temper Glass' },
              { to: '/admin', label: 'Admin Panel' },
            ].map(link => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-indigo-400 transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-white font-semibold mb-4">iPhone Series</h3>
          <ul className="space-y-2.5 text-sm">
            {['iPhone 17 Pro / Pro Max', 'iPhone 16 Pro / Pro Max', 'iPhone 15 / Pro / Pro Max', 'iPhone 14 / Pro / Pro Max', 'iPhone 13 / Pro / Pro Max', 'iPhone 12 / Pro / Pro Max', 'iPhone 11 / Pro / Pro Max'].map(item => (
              <li key={item}>
                <Link to={`/shop?search=${encodeURIComponent(item.split(' ')[1])}&category=iPhone`} className="hover:text-indigo-400 transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <Phone size={15} className="text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-200 font-medium">+91 99438 81393</p>
                <p className="text-gray-500 text-xs">Mon–Sat, 9am–8pm</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={15} className="text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-200">support@nmnora.com</p>
                <p className="text-gray-500 text-xs">We reply within 2 hours</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={15} className="text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-200">123 Commerce Street</p>
                <p className="text-gray-200">Chennai – 600 048</p>
                <p className="text-gray-500 text-xs">Tamil Nadu, India</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} NMNORA. All rights reserved. Authentic Apple Products Only.</p>
        <div className="flex gap-4">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Shipping Policy</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
