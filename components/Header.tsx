
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock Body Scroll when Mobile Menu is Open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent<HTMLElement>, href: string) => {
    setIsMobileMenuOpen(false); // Close mobile menu if open
    
    // Logic to reset view if on detail page
    if (onResetView) {
        onResetView();
        setTimeout(() => {
            scrollToSection(e, href);
        }, 300); // Wait for transition
    } else {
        scrollToSection(e, href);
    }
  };

  return (
    <>
      <header 
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-4 
          ${isScrolled ? 'pt-3' : 'pt-5 md:pt-8'}`}
      >
          <div className="container mx-auto flex justify-center">
            
            {/* Main Navigation Bar (The "Pill") */}
            <div className={`
              relative flex items-center justify-between w-full max-w-7xl
              transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
              ${isScrolled 
                ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-200/20 border border-white/50 rounded-full px-4 py-2 md:px-6 md:py-3' 
                : 'bg-transparent md:bg-black/20 md:backdrop-blur-sm md:border md:border-white/10 rounded-none md:rounded-full px-0 py-2 md:px-8 md:py-4'}
            `}>
              
              {/* --- LEFT: LOGO & IDENTITY --- */}
              <a 
                href="#beranda" 
                onClick={(e) => handleNavClick(e, '#beranda')}
                className="flex items-center gap-3 group shrink-0 relative z-50"
              >
                  {/* Logo Icon */}
                  <div className={`relative transition-all duration-500 ${isScrolled ? 'scale-90' : 'scale-100'}`}>
                      <div className={`absolute inset-0 bg-brand-primary blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-full`}></div>
                      <div className={`relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-500 border
                          ${isScrolled 
                            ? 'bg-white border-slate-100 shadow-sm' 
                            : 'bg-white/10 border-white/20 backdrop-blur-md shadow-inner'}`}>
                          
                          {schoolProfile.logo ? (
                              <img src={schoolProfile.logo} alt="Logo" className="w-full h-full object-contain p-1.5" />
                          ) : (
                              <span className="font-bold text-brand-primary text-sm">{schoolProfile.name.substring(0,2)}</span>
                          )}
                      </div>
                  </div>

                  {/* Text Identity */}
                  <div className={`flex flex-col justify-center transition-all duration-300 ${isScrolled ? 'opacity-100' : 'opacity-100 md:opacity-100'}`}>
                     <span className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-colors duration-300 
                        ${isScrolled ? 'text-brand-primary' : 'text-brand-accent drop-shadow-md'}`}>
                          SD Negeri
                     </span>
                     <span className={`font-display font-bold text-lg leading-none tracking-tight transition-colors duration-300 
                        ${isScrolled ? 'text-slate-800' : 'text-white drop-shadow-md'}`}>
                          Tempurejo 1
                     </span>
                  </div>
              </a>

              {/* --- MIDDLE: DESKTOP NAV --- */}
              <nav className="hidden lg:flex items-center gap-1 xl:gap-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  {NAV_ITEMS.filter(item => item.label !== 'Kontak' && item.label !== 'PPDB').map((item) => (
                      <a 
                          key={item.label}
                          href={item.href}
                          onClick={(e) => handleNavClick(e, item.href)}
                          className={`
                              px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative group
                              ${isScrolled ? 'text-slate-600 hover:text-brand-primary' : 'text-white/90 hover:text-white'}
                          `}
                      >
                          <span className="relative z-10">{item.label}</span>
                          <span className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0
                              ${isScrolled ? 'bg-slate-100' : 'bg-white/10'}`}></span>
                      </a>
                  ))}
              </nav>

              {/* --- RIGHT: CTA & MOBILE TOGGLE --- */}
              <div className="flex items-center gap-3 relative z-50">
                  
                  {/* PPDB Button (Desktop) - EXTERNAL LINK */}
                  <a 
                      href="https://spmb.sdntempurejo1kotakediri.my.id/#home" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`hidden md:flex px-5 py-2.5 rounded-full font-bold text-xs shadow-lg transition-all transform hover:scale-105 hover:shadow-xl items-center gap-2 border
                      ${isScrolled 
                          ? 'bg-gradient-to-r from-brand-primary to-emerald-600 text-white border-transparent shadow-brand-primary/20' 
                          : 'bg-white/10 backdrop-blur-md text-white border-white/30 hover:bg-white hover:text-brand-dark'}`}
                  >
                      <span>Daftar SPMB</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                  </a>

                  {/* Mobile Menu Button (Hamburger) */}
                  <button 
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      className={`lg:hidden w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                          ${isMobileMenuOpen 
                              ? 'bg-slate-100 text-slate-800 rotate-90' 
                              : isScrolled 
                                  ? 'bg-slate-100 text-slate-800 hover:bg-slate-200' 
                                  : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30'}`}
                      aria-label="Toggle Menu"
                  >
                      {isMobileMenuOpen ? (
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                           </svg>
                      ) : (
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                           </svg>
                      )}
                  </button>
              </div>

            </div>
          </div>
      </header>

      {/* --- MOBILE MENU OVERLAY --- */}
      <div 
          className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xl transition-all duration-500 lg:hidden flex justify-end
          ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
          onClick={() => setIsMobileMenuOpen(false)}
      >
          <div 
              className={`w-[85vw] max-w-sm h-full bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] flex flex-col
              ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
              onClick={(e) => e.stopPropagation()}
          >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <h3 className="font-bold text-slate-800 text-lg">Menu Navigasi</h3>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-slate-400 hover:text-red-500 shadow-sm border border-slate-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                  </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-2">
                  {NAV_ITEMS.map((item, idx) => (
                      <a 
                          key={item.label}
                          href={item.label === 'PPDB' ? "https://spmb.sdntempurejo1kotakediri.my.id/#home" : item.href}
                          target={item.label === 'PPDB' ? "_blank" : "_self"}
                          onClick={(e) => {
                             if(item.label !== 'PPDB') handleNavClick(e, item.href);
                             else setIsMobileMenuOpen(false);
                          }}
                          className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 border border-transparent
                              ${item.label === 'PPDB' 
                                  ? 'bg-brand-light text-brand-primary font-bold border-brand-primary/20' 
                                  : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900 hover:pl-6'}`}
                          style={{ transitionDelay: `${idx * 50}ms` }}
                      >
                          <span className="text-base font-medium">{item.label}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                      </a>
                  ))}
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                       <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                          <img src={schoolProfile.logo || ""} alt="Logo" className="w-6 h-6 object-contain" />
                       </div>
                       <div>
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">SD Negeri</p>
                           <p className="font-bold text-slate-800">Tempurejo 1</p>
                       </div>
                  </div>
                  <p className="text-xs text-slate-400 text-center">
                      &copy; {new Date().getFullYear()} Sekolah Adiwiyata
                  </p>
              </div>
          </div>
      </div>
    </>
  );
};

export default Header;
