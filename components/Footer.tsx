
import React from 'react';
import { View } from '../types';
import { TrendingUp, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: View) => void;
  logo?: string;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, logo }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 sm:pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-12 sm:mb-16">
          <div className="space-y-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start text-white cursor-pointer" onClick={() => onNavigate('home')}>
              <img 
                src={logo || "/Grow Milkat - White.png"} 
                alt="Grow Milkat Logo" 
                className="h-14 w-auto object-contain max-w-[200px]"
              />
            </div>
            <p className="text-sm leading-relaxed max-w-xs mx-auto sm:mx-0">
              Global investment platform providing access to curated opportunities in technology, hospitality, and real estate.
            </p>
            <div className="flex justify-center sm:justify-start space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <button key={i} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-white transition">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-center sm:text-left">
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><button onClick={() => onNavigate('home')} className="hover:text-primary transition">Home</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-primary transition">About Us</button></li>
              <li><button onClick={() => onNavigate('our-team')} className="hover:text-primary transition">Our Team</button></li>
              <li><button onClick={() => onNavigate('why')} className="hover:text-primary transition">Why Choose Us</button></li>
              <li><button onClick={() => onNavigate('portfolio')} className="hover:text-primary transition">Portfolio</button></li>
              <li><button onClick={() => onNavigate('faq')} className="hover:text-primary transition">FAQ</button></li>
            </ul>
          </div>
          
          <div className="text-center sm:text-left">
            <h4 className="text-white font-bold mb-6">Investment Sectors</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-primary transition">Startup Equity</a></li>
              <li><a href="#" className="hover:text-primary transition">Hotel Dividends</a></li>
              <li><a href="#" className="hover:text-primary transition">Commercial Property</a></li>
              <li><a href="#" className="hover:text-primary transition">Residential Portfolios</a></li>
            </ul>
          </div>
          
          <div className="text-center sm:text-left">
            <h4 className="text-white font-bold mb-6">Newsletter</h4>
            <p className="text-sm mb-4">Get the latest investment opportunities in your inbox.</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Email address"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full outline-none focus:border-primary transition"
              />
              <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold hover:opacity-90 transition whitespace-nowrap">
                Join
              </button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 text-[10px] sm:text-xs text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2025 Grow Milkat Platform. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <button onClick={() => onNavigate('security-trust')} className="hover:text-white transition">Security & Trust</button>
              <button onClick={() => onNavigate('privacy-policy')} className="hover:text-white transition">Privacy Policy</button>
              <button onClick={() => onNavigate('terms-conditions')} className="hover:text-white transition">Terms of Service</button>
              <a href="#" className="hover:text-white transition">Risk Disclosure</a>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
