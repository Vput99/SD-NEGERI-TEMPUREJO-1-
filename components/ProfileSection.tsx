
import React from 'react';
import { Teacher } from '../types';

interface ProfileSectionProps {
  teachers: Teacher[];
  schoolName: string;
  onSeeAllClick: () => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ teachers, schoolName, onSeeAllClick }) => {
  // Find Headmaster specifically, fallback to first item if not found
  const principal = teachers.find(t => t.role.includes("Kepala")) || teachers[0];
  
  // Exclude Principal from the "Other Teachers" list to avoid duplication
  const otherTeachers = teachers
    .filter(t => t.id !== principal?.id)
    .slice(0, 5); 

  return (
    <section id="profil" className="py-24 container mx-auto px-4 relative overflow-hidden bg-white">
      
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] left-[-5%] w-[500px] h-[500px] bg-brand-light rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-brand-yellow/10 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-light text-brand-primary text-xs font-bold uppercase tracking-wider mb-3 border border-brand-primary/20">
                Tentang Kami
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Membangun Karakter, <br/>
                <span className="text-brand-primary">Mencerdaskan Bangsa</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
                Kami menggabungkan kurikulum nasional dengan nilai-nilai Adiwiyata untuk menciptakan lingkungan belajar yang holistik.
            </p>
        </div>

        {/* BENTO GRID: Visi, Misi, Principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            
            {/* Card 1: Visi (Large Square - ENHANCED) */}
            <div className="md:col-span-2 bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-emerald-500/30 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 border border-white/10">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-300/20 rounded-full blur-2xl transform -translate-x-1/4 translate-y-1/4"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/20">🎯</div>
                        <div>
                            <span className="text-emerald-200 text-xs font-bold uppercase tracking-widest">Cita-cita Kami</span>
                            <h3 className="font-display text-3xl md:text-4xl font-black">Visi Sekolah</h3>
                        </div>
                    </div>
                    
                    <p className="text-emerald-50 text-xl md:text-2xl font-serifbody leading-relaxed max-w-lg mb-8 italic">
                        "Terwujudnya peserta didik yang beriman, cerdas, terampil, mandiri, dan berwawasan lingkungan."
                    </p>
                    
                    <div className="flex flex-wrap gap-3">
                        {['Beriman & Bertakwa', 'Cerdas Intelektual', 'Terampil & Kreatif', 'Berbudaya Lingkungan'].map((tag) => (
                            <span key={tag} className="px-4 py-2 bg-white/10 rounded-full text-sm font-bold backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors cursor-default">
                                ✨ {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Card 2: Misi (Tall Card) */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl transition-all duration-300 group flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-2xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="w-14 h-14 bg-blue-50 text-brand-blue rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">🚀</div>
                <h3 className="font-display text-2xl font-bold text-slate-800 mb-6">Misi Utama</h3>
                
                <ul className="space-y-5 flex-grow">
                    <li className="flex gap-4 group/item">
                        <span className="w-8 h-8 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 group-hover/item:bg-brand-blue group-hover/item:text-white transition-colors">1</span>
                        <span className="text-slate-600 text-sm font-medium leading-relaxed">Menanamkan nilai keagamaan dan budi pekerti luhur dalam setiap aktivitas.</span>
                    </li>
                    <li className="flex gap-4 group/item">
                        <span className="w-8 h-8 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 group-hover/item:bg-brand-blue group-hover/item:text-white transition-colors">2</span>
                        <span className="text-slate-600 text-sm font-medium leading-relaxed">Menciptakan pembelajaran yang aktif, inovatif, kreatif, dan menyenangkan.</span>
                    </li>
                    <li className="flex gap-4 group/item">
                        <span className="w-8 h-8 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 group-hover/item:bg-brand-blue group-hover/item:text-white transition-colors">3</span>
                        <span className="text-slate-600 text-sm font-medium leading-relaxed">Mengembangkan minat bakat melalui kegiatan ekstrakurikuler yang beragam.</span>
                    </li>
                </ul>
            </div>

            {/* Card 3: Principal (Wide) */}
            <div className="md:col-span-3 bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
                 <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-primary via-brand-yellow to-brand-blue"></div>
                 <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                 
                 <div className="shrink-0 relative z-10">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1.5 bg-gradient-to-br from-slate-100 to-slate-200 shadow-md">
                        <img 
                            src={principal?.image} 
                            alt={principal?.name}
                            className="w-full h-full object-cover rounded-full border-4 border-white shadow-sm"
                        />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-brand-accent text-brand-dark px-4 py-1.5 rounded-full text-xs font-bold shadow-lg border-2 border-white">
                        Kepala Sekolah
                    </div>
                 </div>

                 <div className="text-center md:text-left relative z-10 max-w-2xl">
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-slate-800 mb-2">Sambutan Kepala Sekolah</h3>
                    <p className="text-slate-500 italic mt-2 mb-6 text-lg leading-relaxed font-serifbody">
                        "{schoolName} berkomitmen mencetak generasi yang tidak hanya pintar secara akademik, tetapi juga memiliki hati yang tulus untuk menjaga bumi pertiwi."
                    </p>
                    <div>
                        <p className="font-bold text-slate-900 text-lg">{principal?.name}</p>
                        <p className="text-sm text-slate-500">NIP. 19750101 200012 1 001</p>
                    </div>
                 </div>
            </div>
        </div>

        {/* TEAM SECTION */}
        <div className="mt-24">
            <div className="flex justify-between items-end mb-10 px-2">
                <h3 className="font-display text-3xl font-bold text-slate-800">Guru Kami</h3>
                <button 
                  onClick={onSeeAllClick}
                  className="text-sm font-bold text-brand-primary hover:text-brand-dark transition-colors flex items-center gap-1 group"
                >
                  Lihat Semua <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
                </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {otherTeachers.map((teacher) => (
                    <div key={teacher.id} className="group relative bg-white rounded-3xl p-3 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:scale-[1.03] transition-all duration-300 border border-slate-50">
                        <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-3 bg-slate-100 relative">
                            <img 
                                src={teacher.image} 
                                alt={teacher.name} 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-2">
                                <span className="text-white text-[10px] font-bold">Lihat Profil</span>
                            </div>
                        </div>
                        <div className="px-1 text-center pb-2">
                            <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1">{teacher.name}</h4>
                            <p className="text-xs text-brand-primary font-medium bg-brand-light inline-block px-2 py-0.5 rounded-md">{teacher.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </section>
  );
};

export default ProfileSection;
