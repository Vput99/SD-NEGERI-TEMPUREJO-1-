
import React, { useState, useEffect } from 'react';
import { scrollToSection } from '../utils/scroll';
import { SchoolProfile } from '../types';
import { NAV_ITEMS } from '../constants';

interface HeaderProps {
  schoolProfile: SchoolProfile;
  onResetView?: () => void;
}

const Header: React.FC<HeaderProps> = ({ schoolProfile, onResetView }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLElement>, href: string) => {
    // If we are on a sub-page (like All Teachers), reset to main view first
    if (onResetView) {
        onResetView();
        // Small delay to allow view to render before scrolling
        setTimeout(() => {
            scrollToSection(e, href);
        }, 100);
    } else {
        scrollToSection(e, href);
    }
  };

  return (
    <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'pt-2' : 'pt-4 md:pt-6'}`}
    >
        <div className="container mx-auto px-4 flex justify-center">
          <div className={`
            rounded-full transition-all duration-300 flex items-center px-4 md:px-6 py-2.5 md:py-3 gap-4 md:gap-8
            ${isScrolled 
              ? 'glass shadow-lg shadow-black/5 bg-white/95 scale-95 md:scale-100' 
              : 'bg-black/30 backdrop-blur-md border border-white/10 shadow-2xl'}
          `}>
            
            {/* Logo & Identity Area */}
            <a 
              href="#beranda" 
              onClick={(e) => handleNavClick(e, '#beranda')}
              className="flex items-center gap-3 md:gap-4 group shrink-0"
            >
                <div className="flex items-center gap-2 md:gap-3">
                    {/* Logo Sekolah (Main) */}
                    <div className="relative z-10 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white p-1 shadow-md border border-slate-100 transition-transform duration-300 group-hover:scale-110">
                        {schoolProfile.logo ? (
                            <img src={schoolProfile.logo} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                            <div className="w-full h-full bg-brand-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {schoolProfile.name.substring(0, 2)}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col border-l border-white/20 pl-3 md:pl-4">
                   <span className={`font-display font-bold text-sm md:text-xl leading-none tracking-tight ${isScrolled ? 'text-brand-dark' : 'text-white drop-shadow-md'}`}>
                        {schoolProfile.name}
                   </span>
                </div>
            </a>

            {/* Desktop Navigation Links - Hidden on Mobile */}
            <nav className="hidden lg:flex items-center gap-1 border-l border-white/20 pl-6 ml-2">
                {NAV_ITEMS.filter(item => item.label !== 'Kontak' && item.label !== 'Beranda').map((item) => (
                    <a 
                        key={item.label}
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href)}
                        className={`
                            px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 relative group overflow-hidden
                            ${isScrolled ? 'text-slate-600 hover:text-brand-primary' : 'text-white/90 hover:text-white'}
                        `}
                    >
                        <span className="relative z-10">{item.label}</span>
                        {/* Hover Effect: Smooth Pill Transition */}
                        <span className={`absolute inset-0 scale-0 group-hover:scale-100 rounded-full transition-transform duration-300 ease-out origin-center ${isScrolled ? 'bg-brand-light' : 'bg-white/20'}`}></span>
                    </a>
                ))}
                
                {/* CTA Button */}
                <a 
                    href="#ppdb" 
                    onClick={(e) => handleNavClick(e, '#ppdb')}
                    className={`ml-2 px-5 py-2 rounded-full font-bold text-sm shadow-lg transition-all transform hover:scale-105 hover:shadow-xl ${isScrolled ? 'bg-brand-primary text-white hover:bg-brand-dark' : 'bg-brand-accent text-brand-dark hover:bg-white'}`}
                >
                    PPDB
                </a>
            </nav>

          </div>
        </div>
    </header>
  );
};

export default Header;
