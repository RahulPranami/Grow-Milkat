
import React, { useState } from 'react';
import { View } from '../types';
import { Language } from '../translations';
import { Menu, X, TrendingUp, User, ShieldCheck, Globe, ChevronDown } from 'lucide-react';

interface NavbarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  onLogout: () => void;
  t: (key: string) => string;
  language: Language;
  setLanguage: (lang: Language) => void;
  logo?: string;
}

const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  onNavigate, 
  isLoggedIn, 
  isAdmin, 
  onLogout, 
  t,
  language,
  setLanguage,
  logo
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);

  const languages: Language[] = ['English', 'French', 'German'];

  const mainLinks = [
    { label: t('home'), view: 'home' as View },
    { label: t('portfolio'), view: 'portfolio' as View },
    { label: t('testimonials'), view: 'testimonials' as View },
    { label: t('blog'), view: 'blog' as View },
    { label: t('faq'), view: 'faq' as View },
    { label: t('contact'), view: 'contact' as View },
  ];

  const companyLinks = [
    { label: t('about'), view: 'about' as View },
    { label: t('howItWorks'), view: 'how-it-works' as View },
    { label: t('ourTeam'), view: 'our-team' as View },
    { label: t('ourPartners'), view: 'our-partners' as View },
    { label: t('securityTrust'), view: 'security-trust' as View },
    { label: t('why'), view: 'why' as View },
  ];

  const handleNavClick = (view: View) => {
    onNavigate(view);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => handleNavClick('home')}>
            <img 
              src={logo || "https://storage.googleapis.com/full-stack-assets/grow-milkat-logo.png"} 
              alt="Grow Milkat Logo" 
              className="h-16 w-auto object-contain max-w-[240px]"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-sm font-medium transition-colors ${
                currentView === 'home' ? 'text-primary' : 'text-slate-600 hover:text-primary'
              }`}
            >
              {t('home')}
            </button>

            {/* Company Dropdown */}
            <div className="relative group">
              <button
                onMouseEnter={() => setShowCompanyMenu(true)}
                onClick={() => setShowCompanyMenu(!showCompanyMenu)}
                className={`flex items-center text-sm font-medium transition-colors ${
                  ['about', 'our-team', 'why', 'our-partners', 'security-trust', 'how-it-works'].includes(currentView) ? 'text-primary' : 'text-slate-600 hover:text-primary'
                }`}
              >
                {t('ourCompany')}
                <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${showCompanyMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showCompanyMenu && (
                <div 
                  onMouseLeave={() => setShowCompanyMenu(false)}
                  className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in duration-200 z-50"
                >
                  {companyLinks.map((link) => (
                    <button
                      key={link.view}
                      onClick={() => {
                        handleNavClick(link.view);
                        setShowCompanyMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${
                        currentView === link.view ? 'text-primary font-semibold' : 'text-slate-600'
                      }`}
                    >
                      {link.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {mainLinks.slice(1).map((link) => (
              <button
                key={link.view}
                onClick={() => handleNavClick(link.view)}
                className={`text-sm font-medium transition-colors ${
                  currentView === link.view ? 'text-primary' : 'text-slate-600 hover:text-primary'
                }`}
              >
                {link.label}
              </button>
            ))}

            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center text-sm font-medium text-slate-600 hover:text-primary transition-colors"
              >
                <Globe className="w-4 h-4 mr-1" />
                {language}
              </button>
              {showLangMenu && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-slate-200 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in duration-200">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${
                        language === lang ? 'text-primary font-semibold' : 'text-slate-600'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-4 border-l pl-8 ml-4">
                <button 
                  onClick={() => onNavigate(isAdmin ? 'admin' : 'dashboard')}
                  className="flex items-center text-sm font-semibold text-primary hover:bg-blue-50 px-4 py-2 rounded-full transition"
                >
                  {isAdmin ? <ShieldCheck className="w-4 h-4 mr-2" /> : <User className="w-4 h-4 mr-2" />}
                  {isAdmin ? t('adminPanel') : t('dashboard')}
                </button>
                <button onClick={onLogout} className="text-sm text-slate-500 hover:text-red-500">{t('logout')}</button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => onNavigate('login')}
                  className="text-sm font-medium text-slate-600 hover:text-primary"
                >
                  {t('login')}
                </button>
                <button 
                  onClick={() => onNavigate('register')}
                  className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition shadow-lg shadow-primary/20"
                >
                  {t('getStarted')}
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="text-slate-600 p-2"
              >
                <Globe className="w-5 h-5" />
              </button>
              {showLangMenu && (
                <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        language === lang ? 'text-primary font-semibold' : 'text-slate-600'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <button
              onClick={() => handleNavClick('home')}
              className="block w-full text-left px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-primary rounded-xl"
            >
              {t('home')}
            </button>

            {/* Mobile Company Section */}
            <div className="px-4 py-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t('ourCompany')}</p>
              <div className="space-y-1 pl-2 border-l-2 border-slate-100">
                {companyLinks.map((link) => (
                  <button
                    key={link.view}
                    onClick={() => handleNavClick(link.view)}
                    className={`block w-full text-left px-2 py-2 text-sm font-medium transition-colors ${
                      currentView === link.view || (link.view === 'about' && ['about', 'our-team', 'why', 'our-partners', 'security-trust', 'how-it-works'].includes(currentView)) ? 'text-primary' : 'text-slate-600 hover:text-primary'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            {mainLinks.slice(1).map((link) => (
              <button
                key={link.view}
                onClick={() => handleNavClick(link.view)}
                className="block w-full text-left px-4 py-3 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-primary rounded-xl"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-4 border-t border-slate-100">
              {isLoggedIn ? (
                <button 
                  onClick={() => { onNavigate(isAdmin ? 'admin' : 'dashboard'); setIsOpen(false); }}
                  className="w-full text-center bg-primary text-white py-3 rounded-xl font-semibold"
                >
                  {isAdmin ? t('adminPanel') : t('dashboard')}
                </button>
              ) : (
                <div className="space-y-2">
                  <button onClick={() => { onNavigate('login'); setIsOpen(false); }} className="w-full text-center py-3 font-medium text-slate-600">{t('login')}</button>
                  <button onClick={() => { onNavigate('register'); setIsOpen(false); }} className="w-full text-center bg-primary text-white py-3 rounded-xl font-semibold">{t('getStarted')}</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
