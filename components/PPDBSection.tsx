
import React from 'react';

const PPDBSection: React.FC = () => {
  return (
    <section id="ppdb" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        
        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-brand-primary/20 bg-brand-dark">
            {/* Background Art */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-blue rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            </div>

            <div className="relative z-10 px-8 py-20 md:px-20 text-center">
                <span className="inline-block px-4 py-1 rounded-full border border-white/20 bg-white/10 text-brand-accent font-bold text-sm mb-6 backdrop-blur-sm animate-pulse">
                    🟢 Penerimaan Peserta Didik Baru
                </span>
                
                <h2 className="font-display text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                    PENDAFTARAN DIBUKA <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-yellow">2025 / 2026</span>
                </h2>
                
                <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                    Siapkan masa depan buah hati Anda bersama kami. Pendidikan berkarakter, lingkungan asri, dan teknologi terkini. Segera daftar sebelum kuota terpenuhi.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <a 
                        href="https://spmb.sdntempurejo1kotakediri.my.id/#register"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 bg-white text-brand-dark rounded-full font-bold text-lg hover:bg-slate-100 transition-transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 group"
                    >
                        <span>📝 Daftar Sekarang</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                    <a href="#kontak" className="px-8 py-4 bg-transparent border border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors">
                        Hubungi Kami
                    </a>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
};

export default PPDBSection;
