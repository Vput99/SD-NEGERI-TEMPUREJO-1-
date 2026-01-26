
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
            
            {/* Card 1: Visi (Large Square) */}
            <div className="md:col-span-2 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-brand-primary/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="relative z-10">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl mb-6">🎯</div>
                    <h3 className="font-display text-3xl font-bold mb-4">Visi Sekolah</h3>
                    <p className="text-emerald-50 text-lg leading-relaxed max-w-lg">
                        "Terwujudnya peserta didik yang beriman, cerdas, terampil, mandiri, dan berwawasan lingkungan."
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        {['Beriman', 'Cerdas', 'Terampil', 'Adiwiyata'].map((tag) => (
                            <span key={tag} className="px-4 py-2 bg-white/10 rounded-full text-sm font-semibold backdrop-blur-sm border border-white/20">
                                ✨ {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Card 2: Misi (Tall Card) */}
            <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl mb-6 text-brand-blue group-hover:scale-110 transition-transform">🚀</div>
                <h3 className="font-display text-2xl font-bold text-slate-800 mb-4">Misi Utama</h3>
                <ul className="space-y-4">
                    <li className="flex items-start gap-3 text-slate-600 text-sm">
                        <span className="w-5 h-5 rounded-full bg-brand-blue/20 text-brand-blue flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                        <span>Pembelajaran aktif & inovatif.</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-600 text-sm">
                        <span className="w-5 h-5 rounded-full bg-brand-blue/20 text-brand-blue flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                        <span>Pengembangan bakat & minat.</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-600 text-sm">
                        <span className="w-5 h-5 rounded-full bg-brand-blue/20 text-brand-blue flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                        <span>Budaya peduli lingkungan.</span>
                    </li>
                </ul>
            </div>

            {/* Card 3: Principal (Wide) */}
            <div className="md:col-span-3 bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary via-brand-yellow to-brand-blue"></div>
                 
                 <div className="shrink-0 relative">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-br from-slate-100 to-slate-200">
                        <img 
                            src={principal?.image} 
                            alt={principal?.name}
                            className="w-full h-full object-cover rounded-full border-4 border-white shadow-inner"
                        />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-brand-accent text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                        Kepala Sekolah
                    </div>
                 </div>

                 <div className="text-center md:text-left">
                    <h3 className="font-display text-2xl font-bold text-slate-800">Sambutan Kepala Sekolah</h3>
                    <p className="text-slate-500 italic mt-3 mb-4 text-lg">
                        "{schoolName} berkomitmen mencetak generasi yang tidak hanya pintar, tapi juga memiliki hati untuk menjaga bumi."
                    </p>
                    <p className="font-bold text-brand-dark">{principal?.name}</p>
                 </div>
            </div>
        </div>

        {/* TEAM SECTION */}
        <div className="mt-24">
            <div className="flex justify-between items-end mb-10 px-2">
                <h3 className="font-display text-3xl font-bold text-slate-800">Guru Kami</h3>
                <button 
                  onClick={onSeeAllClick}
                  className="text-sm font-bold text-brand-primary hover:text-brand-dark transition-colors flex items-center gap-1"
                >
                  Lihat Semua <span className="text-lg">→</span>
                </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {otherTeachers.map((teacher) => (
                    <div key={teacher.id} className="group relative bg-white rounded-3xl p-3 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:scale-[1.03] transition-all duration-300 border border-slate-50">
                        <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-3 bg-slate-100">
                            <img 
                                src={teacher.image} 
                                alt={teacher.name} 
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
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
