
import React from 'react';
import { scrollToSection } from '../utils/scroll';
import { SchoolProfile } from '../types';

interface FooterProps {
    onOpenAdmin: () => void;
    schoolProfile: SchoolProfile;
}

const Footer: React.FC<FooterProps> = ({ onOpenAdmin, schoolProfile }) => {
  return (
    <footer id="kontak" className="bg-[#022c22] text-slate-300 pt-20 pb-10 relative overflow-hidden">
       {/* Background pattern opacity */}
       <div className="absolute inset-0 bg-nature-pattern opacity-5 mix-blend-overlay"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-10 mb-16">
            {/* About */}
            <div className="md:col-span-2 pr-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-2 p-1 bg-white/10 rounded-full border border-white/10 backdrop-blur-sm">
                        {/* Logo Sekolah */}
                        {schoolProfile.logo ? (
                            <img src={schoolProfile.logo} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold text-xl">
                                {schoolProfile.name.substring(0, 2).toUpperCase()}
                            </div>
                        )}
                         {/* Logo Daerah & Mapan */}
                        {(schoolProfile.logoDaerah || schoolProfile.logoMapan) && (
                           <div className="flex gap-1 pl-1 border-l border-white/20">
                                {schoolProfile.logoDaerah && <img src={schoolProfile.logoDaerah} alt="Daerah" className="w-8 h-8 object-contain" />}
                                {schoolProfile.logoMapan && <img src={schoolProfile.logoMapan} alt="Mapan" className="w-8 h-8 object-contain" />}
                           </div>
                        )}
                    </div>
                    
                    <span className="font-display font-bold text-2xl text-white">
                        {schoolProfile.name}
                    </span>
                </div>
                <p className="text-sm leading-relaxed mb-8 text-slate-400">
                    Menjadi pelopor sekolah ramah lingkungan yang mengintegrasikan teknologi dan alam untuk membentuk karakter siswa yang unggul, kreatif, dan peduli terhadap kelestarian bumi.
                </p>
                <div className="flex gap-4">
                    <a href={schoolProfile.socialMedia.facebook} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-primary hover:border-brand-primary transition-all text-white">
                        <span className="font-bold text-xs">FB</span>
                    </a>
                    <a href={schoolProfile.socialMedia.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-pink-600 hover:border-pink-600 transition-all text-white">
                        <span className="font-bold text-xs">IG</span>
                    </a>
                    <a href={schoolProfile.socialMedia.youtube} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-600 hover:border-red-600 transition-all text-white">
                        <span className="font-bold text-xs">YT</span>
                    </a>
                </div>
            </div>

            {/* Links */}
            <div>
                <h3 className="font-display text-white font-bold text-lg mb-6">Menu Utama</h3>
                <ul className="space-y-3 text-sm">
                    <li><a href="#beranda" onClick={(e) => scrollToSection(e, '#beranda')} className="hover:text-brand-accent transition-colors flex items-center gap-2"><span className="text-brand-primary">›</span> Beranda</a></li>
                    <li><a href="#profil" onClick={(e) => scrollToSection(e, '#profil')} className="hover:text-brand-accent transition-colors flex items-center gap-2"><span className="text-brand-primary">›</span> Profil Sekolah</a></li>
                    <li><a href="#informasi" onClick={(e) => scrollToSection(e, '#informasi')} className="hover:text-brand-accent transition-colors flex items-center gap-2"><span className="text-brand-primary">›</span> Berita</a></li>
                    <li><a href="#jadwal" onClick={(e) => scrollToSection(e, '#jadwal')} className="hover:text-brand-accent transition-colors flex items-center gap-2"><span className="text-brand-primary">›</span> Jadwal</a></li>
                    <li><a href="#galeri" onClick={(e) => scrollToSection(e, '#galeri')} className="hover:text-brand-accent transition-colors flex items-center gap-2"><span className="text-brand-primary">›</span> Galeri</a></li>
                </ul>
            </div>

            {/* Contact */}
            <div>
                <h3 className="font-display text-white font-bold text-lg mb-6">Hubungi Kami</h3>
                <ul className="space-y-4 text-sm">
                    <li className="flex items-start gap-3">
                        <span className="text-xl text-brand-primary">📍</span>
                        <span>{schoolProfile.address}</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="text-xl text-brand-primary">📞</span>
                        <span>{schoolProfile.phone}</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <span className="text-xl text-brand-primary">✉️</span>
                        <span>{schoolProfile.email}</span>
                    </li>
                </ul>
            </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} {schoolProfile.name}. Sekolah Adiwiyata.</p>
            <button 
                onClick={onOpenAdmin}
                className="mt-4 md:mt-0 flex items-center gap-2 hover:text-white transition-colors opacity-50 hover:opacity-100"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Akses Admin
            </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
