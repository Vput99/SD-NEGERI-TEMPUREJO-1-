
import React, { useState, useEffect } from 'react';
import { scrollToSection } from '../utils/scroll';
import { SchoolProfile } from '../types';

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
            rounded-full transition-all duration-300 flex items-center px-6 md:px-8 py-3 md:py-4 gap-4 md:gap-8
            ${isScrolled 
              ? 'glass shadow-lg shadow-black/5 bg-white/90 scale-90 md:scale-95' 
              : 'bg-black/30 backdrop-blur-md border border-white/10 shadow-2xl'}
          `}>
            
            {/* Logo & Identity Area */}
            <a 
              href="#beranda" 
              onClick={(e) => handleNavClick(e, '#beranda')}
              className="flex items-center gap-4 md:gap-6 group"
            >
                <div className="flex items-center gap-3 md:gap-4">
                    {/* Logo Daerah - Diperbesar */}
                    {schoolProfile.logoDaerah && (
                        <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/95 p-1 shadow-sm border border-slate-100 hidden sm:block hover:scale-110 transition-transform duration-300">
                            <img src={schoolProfile.logoDaerah} alt="Daerah" className="w-full h-full object-contain" />
                        </div>
                    )}

                    {/* Logo Sekolah (Main) - Diperbesar Signifikan */}
                    <div className="relative z-10 w-14 h-14 md:w-20 md:h-20 rounded-full bg-white p-1.5 shadow-md border border-slate-100 transition-transform duration-300 group-hover:scale-110">
                        {schoolProfile.logo ? (
                            <img src={schoolProfile.logo} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                            <div className="w-full h-full bg-brand-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {schoolProfile.name.substring(0, 2)}
                            </div>
                        )}
                    </div>
                    
                    {/* Logo Mapan - Diperbesar */}
                    {schoolProfile.logoMapan && (
                        <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/95 p-1 shadow-sm border border-slate-100 hidden sm:block hover:scale-110 transition-transform duration-300">
                            <img src={schoolProfile.logoMapan} alt="Mapan" className="w-full h-full object-contain" />
                        </div>
                    )}
                </div>

                <div className="flex flex-col border-l border-white/20 pl-4 md:pl-6">
                   {/* Nama Sekolah - Font lebih besar */}
                   <span className={`font-display font-bold text-lg md:text-3xl leading-none tracking-tight ${isScrolled ? 'text-brand-dark' : 'text-white drop-shadow-md'}`}>
                        {schoolProfile.name}
                   </span>
                   {/* Subtitle - Font lebih besar */}
                   <span className={`text-xs md:text-sm font-bold uppercase tracking-wider mt-1 ${isScrolled ? 'text-brand-primary' : 'text-brand-yellow drop-shadow-sm'}`}>
                        Sekolah Adiwiyata
                   </span>
                </div>
            </a>
          </div>
        </div>
    </header>
  );
};

export default Header;
