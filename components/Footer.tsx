
import React from 'react';
import { scrollToSection } from '../utils/scroll';
import { SchoolProfile } from '../types';

interface FooterProps {
    onOpenAdmin: () => void;
    schoolProfile: SchoolProfile;
}

const Footer: React.FC<FooterProps> = ({ onOpenAdmin, schoolProfile }) => {
  return (
    <footer id="kontak" className="bg-[#022c22] text-slate-300 pt-24 pb-10 relative overflow-hidden font-body">
       {/* Background pattern opacity */}
       <div className="absolute inset-0 bg-nature-pattern opacity-5 mix-blend-overlay"></div>
       {/* Gradient Overlay for depth */}
       <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/20 to-transparent pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-12 gap-x-8 lg:gap-16">
            
            {/* Column 1: Identity */}
            {/* Full width on Tablet (md), 5 cols on Desktop (lg) */}
            <div className="md:col-span-12 lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Main School Logo with Glow Effect */}
                    <div className="relative group shrink-0">
                        <div className="absolute inset-0 bg-brand-primary blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full"></div>
                        <div className="relative w-20 h-20 md:w-24 md:h-24 bg-white/5 p-4 rounded-full border border-white/10 backdrop-blur-md shadow-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                            {schoolProfile.logo ? (
                                <img src={schoolProfile.logo} alt="Logo Sekolah" className="w-full h-full object-contain drop-shadow-md" />
                            ) : (
                                <div className="w-full h-full rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-2xl">
                                    {schoolProfile.name.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Typography Redesign */}
                    <div className="space-y-1">
                        <span className="block text-brand-secondary font-bold tracking-[0.25em] text-xs md:text-sm uppercase mb-1">
                            SD Negeri
                        </span>
                        <h3 className="font-display font-black text-3xl md:text-5xl text-white leading-none tracking-tight">
                            Tempurejo 1
                        </h3>
                        <p className="text-white/50 text-sm font-medium tracking-wide">Kota Kediri, Jawa Timur</p>

                        {/* Secondary Logos Row */}
                        {(schoolProfile.logoDaerah || schoolProfile.logoMapan) && (
                           <div className="flex items-center justify-center lg:justify-start gap-4 pt-3">
                                {schoolProfile.logoDaerah && (
                                    <div className="bg-white/5 p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer" title="Pemerintah Kota Kediri">
                                         <img src={schoolProfile.logoDaerah} alt="Logo Daerah" className="h-8 w-auto object-contain opacity-90 hover:opacity-100" />
                                    </div>
                                )}
                                {schoolProfile.logoMapan && (
                                    <div className="bg-white/5 p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer" title="Kurikulum Merdeka">
                                        <img src={schoolProfile.logoMapan} alt="Logo Mapan" className="h-8 w-auto object-contain opacity-90 hover:opacity-100" />
                                    </div>
                                )}
                           </div>
                        )}
                    </div>
                </div>

                <p className="text-slate-400 leading-relaxed max-w-md mx-auto lg:mx-0 border-l-2 border-brand-primary/30 pl-4">
                    Menjadi pelopor sekolah ramah lingkungan yang mengintegrasikan teknologi dan alam untuk membentuk karakter siswa yang unggul, kreatif, dan peduli terhadap kelestarian bumi.
                </p>

                {/* Social Icons - Centered on mobile, Left on Desktop */}
                <div className="flex items-center gap-3 pt-2">
                    <a href={schoolProfile.socialMedia.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                    </a>
                    <a href={schoolProfile.socialMedia.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#E4405F] hover:border-[#E4405F] hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                    <a href={schoolProfile.socialMedia.youtube} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                    </a>
                </div>
            </div>

            {/* Column 2: Navigation */}
            {/* 5 cols on Tablet, 3 on Desktop */}
            <div className="md:col-span-5 lg:col-span-3 lg:pl-8 flex flex-col items-center md:items-start text-center md:text-left">
                <h3 className="font-display text-white font-bold text-lg mb-6 relative inline-block">
                    Menu Utama
                    <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-0 w-8 h-1 bg-brand-primary rounded-full"></span>
                </h3>
                <ul className="space-y-3 text-sm w-full max-w-xs md:max-w-none">
                    <li><a href="#beranda" onClick={(e) => scrollToSection(e, '#beranda')} className="hover:text-brand-primary transition-colors flex items-center justify-center md:justify-start gap-2 group"><span className="text-brand-primary opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300">›</span> Beranda</a></li>
                    <li><a href="#profil" onClick={(e) => scrollToSection(e, '#profil')} className="hover:text-brand-primary transition-colors flex items-center justify-center md:justify-start gap-2 group"><span className="text-brand-primary opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300">›</span> Profil Sekolah</a></li>
                    <li><a href="#informasi" onClick={(e) => scrollToSection(e, '#informasi')} className="hover:text-brand-primary transition-colors flex items-center justify-center md:justify-start gap-2 group"><span className="text-brand-primary opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300">›</span> Berita & Pengumuman</a></li>
                    <li><a href="#jadwal" onClick={(e) => scrollToSection(e, '#jadwal')} className="hover:text-brand-primary transition-colors flex items-center justify-center md:justify-start gap-2 group"><span className="text-brand-primary opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300">›</span> Jadwal Pelajaran</a></li>
                    <li><a href="#ujian" onClick={(e) => scrollToSection(e, '#ujian')} className="hover:text-brand-primary transition-colors flex items-center justify-center md:justify-start gap-2 group"><span className="text-brand-primary opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300">›</span> Info Ujian Akhir</a></li>
                    <li><a href="#galeri" onClick={(e) => scrollToSection(e, '#galeri')} className="hover:text-brand-primary transition-colors flex items-center justify-center md:justify-start gap-2 group"><span className="text-brand-primary opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300">›</span> Galeri Aktivitas</a></li>
                </ul>
            </div>

            {/* Column 3: Contact */}
            {/* 7 cols on Tablet, 4 on Desktop */}
            <div className="md:col-span-7 lg:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
                <h3 className="font-display text-white font-bold text-lg mb-6 relative inline-block">
                    Hubungi Kami
                    <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-0 w-8 h-1 bg-brand-accent rounded-full"></span>
                </h3>
                <ul className="space-y-5 text-sm w-full max-w-sm md:max-w-none">
                    <li className="flex items-start justify-center md:justify-start gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-primary shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-colors border border-white/5 shadow-sm mt-0.5">📍</div>
                        <span className="leading-relaxed py-1 group-hover:text-white transition-colors">{schoolProfile.address}</span>
                    </li>
                    <li className="flex items-center justify-center md:justify-start gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-primary shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-colors border border-white/5 shadow-sm">📞</div>
                        <span className="group-hover:text-white transition-colors">{schoolProfile.phone}</span>
                    </li>
                    <li className="flex items-center justify-center md:justify-start gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-primary shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-colors border border-white/5 shadow-sm">✉️</div>
                        <span className="group-hover:text-white transition-colors">{schoolProfile.email}</span>
                    </li>
                </ul>
            </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 bg-black/20 backdrop-blur-md border-t border-white/5">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
            <p className="order-2 md:order-1 text-center md:text-left">
                &copy; {new Date().getFullYear()} {schoolProfile.name}. 
                <span className="hidden sm:inline"> | </span> 
                <br className="sm:hidden" /> 
                All rights reserved.
            </p>
            <button 
                onClick={onOpenAdmin}
                className="order-1 md:order-2 flex items-center gap-2 text-slate-400 hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-white/10 border border-transparent hover:border-white/10 group"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:text-brand-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
