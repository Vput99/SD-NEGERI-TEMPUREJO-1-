
import React, { useState, useEffect } from 'react';
import { scrollToSection } from '../utils/scroll';
import { SchoolProfile } from '../types';

interface HeroProps {
  schoolProfile: SchoolProfile;
}

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=2072&auto=format&fit=crop", // School exterior/Greenery
  "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2070&auto=format&fit=crop", // Nature/Leaves close up
  "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop", // Kids in green environment
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"  // Classroom/Learning
];

const Hero: React.FC<HeroProps> = ({ schoolProfile }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    // CHANGE: justify-center (agar konten di tengah vertikal)
    // CHANGE: padding disesuaikan (pt-20 md:pt-28) agar pas di bawah header tapi tidak terlalu turun
    // CHANGE: pb-32 (memberi ruang untuk ombak di bawah)
    <div id="beranda" className="relative w-full min-h-screen flex flex-col items-center justify-center pt-20 md:pt-28 pb-20 md:pb-24 overflow-hidden">
      {/* Background Slideshow */}
      {HERO_IMAGES.map((img, index) => (
        <div 
          key={index}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          <img 
            src={img} 
            alt={`Slide ${index + 1}`} 
            className="w-full h-full object-cover transform scale-105 animate-[pulse_10s_ease-in-out_infinite]"
          />
          {/* Modern Gradient Overlay attached to slide to fade with it */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/80 via-brand-primary/60 to-brand-accent/30 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
      ))}

      {/* Futuristic Organic Shapes Overlay (Static on top) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 md:w-32 md:h-32 bg-brand-accent/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-40 right-10 w-32 h-32 md:w-48 md:h-48 bg-brand-blue/20 rounded-full blur-3xl animate-float delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto text-white flex flex-col items-center">
        
        {/* Logos Display - Compact Version */}
        {/* UPDATE: Margin bawah dikurangi (mb-4 md:mb-6) agar tidak terlalu boros tempat */}
        <div className="flex items-center justify-center gap-3 md:gap-6 mb-4 md:mb-6 animate-in fade-in zoom-in duration-1000">
            {/* Logo Daerah (Kiri) */}
            {schoolProfile.logoDaerah && (
                <div className="w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-white/10 backdrop-blur-md rounded-full p-2 md:p-3 border border-white/20 shadow-2xl transform hover:scale-110 transition-all duration-500 hover:bg-white/20">
                    <img 
                        src={schoolProfile.logoDaerah} 
                        alt="Logo Daerah" 
                        className="w-full h-full object-contain drop-shadow-md" 
                    />
                </div>
            )}
            
            {/* Logo Sekolah (Tengah - Besar) */}
            {schoolProfile.logo && (
                <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 bg-white/20 backdrop-blur-xl rounded-full p-3 md:p-5 border-2 border-white/30 shadow-2xl shadow-brand-primary/20 transform hover:scale-105 transition-all duration-500 relative z-10 hover:bg-white/25">
                     <img 
                        src={schoolProfile.logo} 
                        alt="Logo Sekolah" 
                        className="w-full h-full object-contain drop-shadow-xl" 
                    />
                </div>
            )}

            {/* Logo Mapan (Kanan) */}
            {schoolProfile.logoMapan && (
                <div className="w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-white/10 backdrop-blur-md rounded-full p-2 md:p-3 border border-white/20 shadow-2xl transform hover:scale-110 transition-all duration-500 hover:bg-white/20">
                    <img 
                        src={schoolProfile.logoMapan} 
                        alt="Logo Mapan" 
                        className="w-full h-full object-contain drop-shadow-md" 
                    />
                </div>
            )}
        </div>

        {/* Badge - Margin dikurangi */}
        <div className="mb-3 md:mb-5 inline-flex items-center gap-2 glass px-3 py-1 md:px-5 md:py-1.5 rounded-full animate-float shadow-lg border-brand-accent/30">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-brand-accent animate-pulse"></span>
            <span className="text-brand-light font-bold text-[10px] md:text-xs uppercase tracking-wider">
                Sekolah Adiwiyata
            </span>
        </div>
        
        {/* Title - Ukuran font disesuaikan agar tidak pecah baris terlalu banyak */}
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 drop-shadow-xl leading-tight">
          Mewujudkan Generasi <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-yellow-200">
            Cerdas & Berbudaya
          </span>
        </h1>
        
        {/* Description - Margin bawah dikurangi */}
        <p className="font-body text-sm sm:text-base md:text-lg mb-6 md:mb-8 font-light drop-shadow-md text-slate-100 max-w-2xl mx-auto px-4 leading-relaxed">
          {schoolProfile.name} hadir dengan konsep pendidikan modern yang menyatu dengan alam.
        </p>
        
        {/* Buttons - Padding tombol sedikit diperkecil untuk tampilan laptop */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full max-w-xs sm:max-w-none mx-auto pb-4">
          <a 
            href="#profil" 
            onClick={(e) => scrollToSection(e, '#profil')}
            className="w-full sm:w-auto group relative px-6 py-2.5 md:px-8 md:py-3 rounded-full bg-brand-accent text-brand-dark font-bold text-sm md:text-base shadow-[0_0_20px_rgba(132,204,22,0.5)] hover:shadow-[0_0_30px_rgba(132,204,22,0.8)] transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Jelajahi Profil</span>
            <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
          </a>
          
          <a 
            href="#jadwal" 
            onClick={(e) => scrollToSection(e, '#jadwal')}
            className="w-full sm:w-auto group px-6 py-2.5 md:px-8 md:py-3 rounded-full glass text-white font-bold text-sm md:text-base hover:bg-white/20 transition-all duration-300 border border-white/30 flex items-center gap-2 justify-center"
          >
            <span>Lihat Jadwal</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Modern Curvy Divider - Ensure it stays at bottom and STRETCHES */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none leading-none">
        <svg 
            viewBox="0 0 1440 320" 
            className="w-full h-[60px] md:h-[120px] lg:h-[160px] block drop-shadow-sm" 
            preserveAspectRatio="none"
        >
          <path fill="#ECFDF5" fillOpacity="1" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,149.3C672,139,768,149,864,170.7C960,192,1056,224,1152,224C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero;
