
import React from 'react';

interface ExamSectionProps {
  onOpenDetail: () => void;
}

const ExamSection: React.FC<ExamSectionProps> = ({ onOpenDetail }) => {
  return (
    <section id="ujian" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        
        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl shadow-blue-900/10 bg-gradient-to-br from-slate-900 to-slate-800">
            {/* Background Art */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10"></div>
            </div>

            <div className="relative z-10 px-8 py-16 md:px-20 text-center flex flex-col items-center">
                <span className="inline-block px-4 py-1 rounded-full border border-white/20 bg-white/10 text-blue-300 font-bold text-sm mb-6 backdrop-blur-sm uppercase tracking-wider">
                    Info Kelas 6
                </span>
                
                <h2 className="font-display text-4xl md:text-6xl font-black text-white mb-2 tracking-tight">
                    SIAP HADAPI <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">TKA</span>
                </h2>
                
                <div className="text-xl md:text-2xl text-blue-200 font-bold mb-8 tracking-wide font-display">
                    ( Tes Kemampuan Akademik )
                </div>
                
                <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                    Dapatkan informasi lengkap mengenai jadwal Try Out, Ujian Praktek, dan persiapan TKA tahun ini.
                </p>

                <button 
                    onClick={onOpenDetail}
                    className="group relative px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-500/50 flex items-center gap-3"
                >
                    <span>Lihat Jadwal & Materi</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </button>
            </div>
        </div>

      </div>
    </section>
  );
};

export default ExamSection;
