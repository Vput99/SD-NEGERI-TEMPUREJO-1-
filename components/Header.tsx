
import React, { useState, useEffect } from 'react';
import { scrollToSection } from '../utils/scroll';
import { SchoolProfile } from '../types';

interface HeaderProps {
  schoolProfile: SchoolProfile;
}

const Header: React.FC<HeaderProps> = ({ schoolProfile }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLElement>, href: string) => {
    scrollToSection(e, href);
  };

  return (
    <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'pt-4' : 'pt-4 md:pt-8'}`}
    >
        <div className="container mx-auto px-4 flex justify-center">
          <div className={`
            rounded-full transition-all duration-300 flex items-center px-6 py-3 gap-4
            ${isScrolled 
              ? 'glass shadow-lg shadow-black/5 bg-white/80' 
              : 'bg-transparent md:bg-black/20 md:backdrop-blur-sm border border-transparent md:border-white/10'}
          `}>
            
            {/* Logo & Identity Area */}
            <a 
              href="#beranda" 
              onClick={(e) => handleNavClick(e, '#beranda')}
              className="flex items-center gap-4 group"
            >
                <div className="flex -space-x-3 items-center">
                    {/* Logo Sekolah */}
                    <div className="relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white p-1 shadow-md border border-slate-100 transition-transform group-hover:scale-110">
                        {schoolProfile.logo ? (
                            <img src={schoolProfile.logo} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                            <div className="w-full h-full bg-brand-primary rounded-full flex items-center justify-center text-white font-bold text-xs">
                                {schoolProfile.name.substring(0, 2)}
                            </div>
                        )}
                    </div>
                    {/* Logo Daerah */}
                    {schoolProfile.logoDaerah && (
                        <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-white p-1 shadow-sm border border-slate-100 hidden sm:block">
                            <img src={schoolProfile.logoDaerah} alt="Daerah" className="w-full h-full object-contain" />
                        </div>
                    )}
                    {/* Logo Mapan */}
                    {schoolProfile.logoMapan && (
                        <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-white p-1 shadow-sm border border-slate-100 hidden sm:block">
                            <img src={schoolProfile.logoMapan} alt="Mapan" className="w-full h-full object-contain" />
                        </div>
                    )}
                </div>

                <div className="flex flex-col">
                   <span className={`font-display font-bold text-base md:text-xl leading-none tracking-tight ${isScrolled ? 'text-brand-dark' : 'text-white md:drop-shadow-md'}`}>
                        {schoolProfile.name}
                   </span>
                   <span className={`text-[10px] md:text-xs font-medium uppercase tracking-wider ${isScrolled ? 'text-brand-primary' : 'text-slate-200'}`}>
                        Sekolah Penggerak
                   </span>
                </div>
            </a>
          </div>
        </div>
    </header>
  );
};

export default Header;
