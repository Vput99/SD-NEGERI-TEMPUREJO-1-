
import React, { useState, useEffect } from 'react';
import { NAV_ITEMS } from '../constants';
import { scrollToSection } from '../utils/scroll';
import { SchoolProfile } from '../types';

interface HeaderProps {
  schoolProfile: SchoolProfile;
}

const Header: React.FC<HeaderProps> = ({ schoolProfile }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLElement>, href: string) => {
    scrollToSection(e, href);
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
        ? 'glass shadow-lg py-3' 
        : 'bg-transparent py-4 md:py-6'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        {/* Logo Area */}
        <a 
          href="#beranda" 
          onClick={(e) => handleNavClick(e, '#beranda')}
          className="flex items-center gap-2 md:gap-3 group relative max-w-[75%]"
        >
            <div className="flex items-center gap-1.5 p-1 bg-white/30 backdrop-blur-sm rounded-full border border-white/50 transition-transform group-hover:scale-105 shrink-0">
                {/* Logo Sekolah */}
                {schoolProfile.logo ? (
                    <img src={schoolProfile.logo} alt="Logo Sekolah" className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover" />
                ) : (
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-brand-secondary to-brand-primary flex items-center justify-center text-white font-bold text-sm md:text-lg shadow-inner">
                        {schoolProfile.name.substring(0, 2).toUpperCase()}
                    </div>
                )}
                
                {/* Logo Daerah - Hidden on Mobile */}
                {schoolProfile.logoDaerah && (
                    <img src={schoolProfile.logoDaerah} alt="Logo Daerah" className="hidden md:block w-10 h-10 object-contain" />
                )}

                {/* Logo Mapan - Hidden on Mobile */}
                {schoolProfile.logoMapan && (
                    <img src={schoolProfile.logoMapan} alt="Logo Mapan Kota Kediri" className="hidden md:block w-10 h-10 object-contain" />
                )}
            </div>

            <span className={`font-display font-bold text-sm md:text-xl tracking-wide leading-tight ${isScrolled ? 'text-brand-dark' : 'text-white drop-shadow-md'}`}>
                {schoolProfile.name}
            </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all duration-300 ${
                isScrolled 
                ? 'text-brand-dark hover:bg-brand-primary hover:text-white' 
                : 'text-white hover:bg-white hover:text-brand-primary'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-white/20 backdrop-blur-sm focus:outline-none hover:bg-white/40 transition-colors shrink-0"
        >
          <div className={`w-5 h-0.5 mb-1.5 rounded-full transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2 bg-brand-dark' : (isScrolled ? 'bg-brand-dark' : 'bg-white')}`}></div>
          <div className={`w-5 h-0.5 mb-1.5 rounded-full transition-all ${isMobileMenuOpen ? 'opacity-0' : (isScrolled ? 'bg-brand-dark' : 'bg-white')}`}></div>
          <div className={`w-5 h-0.5 rounded-full transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2 bg-brand-dark' : (isScrolled ? 'bg-brand-dark' : 'bg-white')}`}></div>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-4 right-4 mt-2 glass rounded-2xl shadow-xl p-4 flex flex-col gap-2 border border-white/60 animate-in slide-in-from-top-5 max-h-[80vh] overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="block px-4 py-3 rounded-xl hover:bg-brand-light text-brand-dark font-bold text-center transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
