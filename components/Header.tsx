
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
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'pt-4' : 'pt-4 md:pt-8'}`}
      >
        <div className="container mx-auto px-4">
          <div className={`
            mx-auto max-w-6xl rounded-full transition-all duration-300 flex justify-between items-center px-4 py-3 md:px-6 md:py-3
            ${isScrolled || isMobileMenuOpen 
              ? 'glass shadow-lg shadow-black/5 bg-white/80' 
              : 'bg-transparent md:bg-black/20 md:backdrop-blur-sm border border-transparent md:border-white/10'}
          `}>
            
            {/* Logo Area */}
            <a 
              href="#beranda" 
              onClick={(e) => handleNavClick(e, '#beranda')}
              className="flex items-center gap-3 group"
            >
                <div className="flex -space-x-3 items-center">
                    {/* Logo Sekolah */}
                    <div className="relative z-10 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white p-1 shadow-md border border-slate-100 transition-transform group-hover:scale-110">
                        {schoolProfile.logo ? (
                            <img src={schoolProfile.logo} alt="Logo" className="w-full h-full object-contain" />
                        ) : (
                            <div className="w-full h-full bg-brand-primary rounded-full flex items-center justify-center text-white font-bold text-xs">
                                {schoolProfile.name.substring(0, 2)}
                            </div>
                        )}
                    </div>
                    {/* Logo Daerah (Optional) */}
                    {schoolProfile.logoDaerah && (
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white p-1 shadow-sm border border-slate-100 hidden sm:block">
                            <img src={schoolProfile.logoDaerah} alt="Daerah" className="w-full h-full object-contain" />
                        </div>
                    )}
                </div>

                <div className="flex flex-col">
                   <span className={`font-display font-bold text-sm md:text-lg leading-none tracking-tight ${isScrolled || isMobileMenuOpen ? 'text-brand-dark' : 'text-white md:drop-shadow-sm'}`}>
                        {schoolProfile.name}
                   </span>
                   <span className={`text-[10px] md:text-xs font-medium uppercase tracking-wider ${isScrolled || isMobileMenuOpen ? 'text-brand-primary' : 'text-slate-200'}`}>
                        Sekolah Penggerak
                   </span>
                </div>
            </a>

            {/* Desktop Nav - Floating Pill Style */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`
                    px-4 py-2 rounded-full font-bold text-sm transition-all duration-300
                    ${isScrolled 
                        ? 'text-slate-600 hover:text-brand-dark hover:bg-slate-100' 
                        : 'text-white/90 hover:text-white hover:bg-white/20'}
                  `}
                >
                  {item.label}
                </a>
              ))}
              <a 
                href="#ppdb" 
                onClick={(e) => handleNavClick(e, '#ppdb')}
                className={`ml-2 px-5 py-2 rounded-full font-bold text-sm transition-all shadow-lg transform hover:-translate-y-0.5
                    ${isScrolled 
                    ? 'bg-brand-primary text-white hover:bg-brand-dark hover:shadow-brand-primary/30' 
                    : 'bg-white text-brand-dark hover:bg-brand-light'}
                `}
              >
                Daftar
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-full transition-colors ${isScrolled || isMobileMenuOpen ? 'bg-slate-100 text-slate-800' : 'bg-white/20 text-white'}`}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center gap-1.5">
                  <span className={`block w-5 h-0.5 rounded-full transition-all duration-300 bg-current ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                  <span className={`block w-5 h-0.5 rounded-full transition-all duration-300 bg-current ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block w-5 h-0.5 rounded-full transition-all duration-300 bg-current ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-white/95 backdrop-blur-xl transition-transform duration-500 ease-in-out md:hidden flex flex-col items-center justify-center space-y-6 ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
            {NAV_ITEMS.map((item) => (
                <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="text-2xl font-display font-bold text-slate-800 hover:text-brand-primary transition-colors"
                >
                    {item.label}
                </a>
            ))}
             <a
                href="#ppdb"
                onClick={(e) => handleNavClick(e, '#ppdb')}
                className="px-8 py-3 bg-brand-primary text-white text-xl font-bold rounded-full shadow-xl shadow-brand-primary/30 mt-4"
            >
                Daftar Sekarang
            </a>
      </div>
    </>
  );
};

export default Header;
