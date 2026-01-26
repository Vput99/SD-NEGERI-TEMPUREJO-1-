
import React from 'react';
import { scrollToSection } from '../utils/scroll';
import { SchoolProfile } from '../types';

interface FooterProps {
    onOpenAdmin: () => void;
    schoolProfile: SchoolProfile;
}

const Footer: React.FC<FooterProps> = ({ onOpenAdmin, schoolProfile }) => {
  return (
    <footer id="kontak" className="bg-[#022c22] text-slate-300 pt-20 relative overflow-hidden font-body">
       {/* Background pattern opacity */}
       <div className="absolute inset-0 bg-nature-pattern opacity-5 mix-blend-overlay"></div>

      <div className="container mx-auto px-4 relative z-10 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-16">
            
            {/* Column 1: Identity (Span 5 on LG) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="flex items-start gap-4">
                    {/* Main School Logo */}
                    <div className="shrink-0 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-sm">
                        {schoolProfile.logo ? (
                            <img src={schoolProfile.logo} alt="Logo Sekolah" className="w-16 h-16 object-contain" />
                        ) : (
                            <div className="w-16 h-16 rounded-xl bg-brand-primary flex items-center justify-center text-white font-bold text-2xl">
                                {schoolProfile.name.substring(0, 2).toUpperCase()}
                            </div>
                        )}
                    </div>
                    
                    <div className="pt-1">
                        <h3 className="font-display font-bold text-2xl text-white leading-tight mb-3">
                            {schoolProfile.name}
                        </h3>
                        {/* Secondary Logos Row */}
                        {(schoolProfile.logoDaerah || schoolProfile.logoMapan) && (
                           <div className="flex items-center gap-4">
                                {schoolProfile.logoDaerah && (
                                    <img src={schoolProfile.logoDaerah} alt="Logo Daerah" className="h-10 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" />
                                )}
                                {schoolProfile.logoMapan && (
                                    <img src={schoolProfile.logoMapan} alt="Logo Mapan" className="h-10 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" />
                                )}
                           </div>
                        )}
                    </div>
                </div>

                <p className="text-sm leading-relaxed text-slate-400">
                    Menjadi pelopor sekolah ramah lingkungan yang mengintegrasikan teknologi dan alam untuk membentuk karakter siswa yang unggul, kreatif, dan peduli terhadap kelestarian bumi.
                </p>

                <div className="flex gap-3">
                    <a href={schoolProfile.socialMedia.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white transition-all transform hover:scale-110">
                        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                    </a>
                    <a href={schoolProfile.socialMedia.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#E4405F] hover:border-[#E4405F] hover:text-white transition-all transform hover:scale-110">
                        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                    <a href={schoolProfile.socialMedia.youtube} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white transition-all transform hover:scale-110">
                        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                    </a>
                </div>
            </div>

            {/* Column 2: Navigation (Span 3 on LG) */}
            <div className="lg:col-span-3 lg:pl-10">
                <h3 className="font-display text-white font-bold text-lg mb-6 relative inline-block">
                    Menu Utama
                    <span className="absolute -bottom-2 left-0 w-8 h-1 bg-brand-primary rounded-full"></span>
                </h3>
                <ul className="space-y-3 text-sm">
                    <li><a href="#beranda" onClick={(e) => scrollToSection(e, '#beranda')} className="hover:text-brand-accent transition-colors flex items-center gap-2 group"><span className="text-brand-primary group-hover:translate-x-1 transition-transform">›</span> Beranda</a></li>
                    <li><a href="#profil" onClick={(e) => scrollToSection(e, '#profil')} className="hover:text-brand-accent transition-colors flex items-center gap-2 group"><span className="text-brand-primary group-hover:translate-x-1 transition-transform">›</span> Profil Sekolah</a></li>
                    <li><a href="#informasi" onClick={(e) => scrollToSection(e, '#informasi')} className="hover:text-brand-accent transition-colors flex items-center gap-2 group"><span className="text-brand-primary group-hover:translate-x-1 transition-transform">›</span> Berita</a></li>
                    <li><a href="#jadwal" onClick={(e) => scrollToSection(e, '#jadwal')} className="hover:text-brand-accent transition-colors flex items-center gap-2 group"><span className="text-brand-primary group-hover:translate-x-1 transition-transform">›</span> Jadwal</a></li>
                    <li><a href="#ujian" onClick={(e) => scrollToSection(e, '#ujian')} className="hover:text-brand-accent transition-colors flex items-center gap-2 group"><span className="text-brand-primary group-hover:translate-x-1 transition-transform">›</span> Ujian Akhir</a></li>
                    <li><a href="#galeri" onClick={(e) => scrollToSection(e, '#galeri')} className="hover:text-brand-accent transition-colors flex items-center gap-2 group"><span className="text-brand-primary group-hover:translate-x-1 transition-transform">›</span> Galeri</a></li>
                </ul>
            </div>

            {/* Column 3: Contact (Span 4 on LG) */}
            <div className="lg:col-span-4">
                <h3 className="font-display text-white font-bold text-lg mb-6 relative inline-block">
                    Hubungi Kami
                    <span className="absolute -bottom-2 left-0 w-8 h-1 bg-brand-accent rounded-full"></span>
                </h3>
                <ul className="space-y-4 text-sm">
                    <li className="flex items-start gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-primary shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-colors border border-white/5">📍</div>
                        <span className="leading-relaxed py-2">{schoolProfile.address}</span>
                    </li>
                    <li className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-primary shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-colors border border-white/5">📞</div>
                        <span className="py-2">{schoolProfile.phone}</span>
                    </li>
                    <li className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-primary shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-colors border border-white/5">✉️</div>
                        <span className="py-2">{schoolProfile.email}</span>
                    </li>
                </ul>
            </div>
        </div>
      </div>

      {/* Bottom Bar - Full Width with different shade */}
      <div className="relative z-10 bg-black/20 backdrop-blur-sm border-t border-white/5">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
            <p className="order-2 md:order-1 text-center md:text-left">
                &copy; {new Date().getFullYear()} {schoolProfile.name}. 
                <span className="hidden sm:inline"> | </span> 
                <br className="sm:hidden" /> 
                All rights reserved.
            </p>
            <button 
                onClick={onOpenAdmin}
                className="order-1 md:order-2 flex items-center gap-2 text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/10 border border-transparent hover:border-white/10"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Login Pengelola</span>
            </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
