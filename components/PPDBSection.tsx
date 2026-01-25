
import React from 'react';

const PPDBSection: React.FC = () => {
  return (
    <section id="ppdb" className="py-24 bg-gradient-to-b from-brand-light to-white relative overflow-hidden">
       {/* Background Elements */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-3xl animate-float"></div>
       <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-accent/10 rounded-full blur-3xl animate-float delay-1000"></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="font-display text-4xl font-bold text-brand-dark mb-10">Penerimaan Peserta Didik Baru</h2>
        
        <div className="relative inline-block group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative glass bg-white/60 px-8 py-16 md:px-20 rounded-3xl border border-white/60 shadow-xl backdrop-blur-xl">
                <div className="text-6xl mb-6 animate-bounce">📢</div>
                <h3 className="font-display text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-dark to-brand-primary tracking-tight mb-4">
                    COMING SOON
                </h3>
                <p className="text-xl md:text-2xl text-slate-600 font-bold mb-8">
                    Tahun Ajaran 2024/2025
                </p>
                <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                    <span className="px-6 py-2 bg-brand-primary/10 text-brand-dark rounded-full text-sm font-bold border border-brand-primary/20 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
                        Segera Dibuka
                    </span>
                    <span className="text-slate-400 text-sm">Pantau terus informasi terbaru di website kami!</span>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default PPDBSection;
