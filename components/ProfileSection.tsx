
import React from 'react';
import { Teacher } from '../types';

interface ProfileSectionProps {
  teachers: Teacher[];
  schoolName: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ teachers, schoolName }) => {
  // Asumsi guru pertama di list adalah Kepala Sekolah
  const principal = teachers[0];
  const otherTeachers = teachers.slice(1);

  return (
    <section id="profil" className="py-24 container mx-auto px-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-1/4 -right-64 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* 1. SECTION: VISI MISI (Why Choose Us) */}
      <div className="mb-32 relative z-10">
        <div className="text-center mb-16">
            <span className="text-brand-accent font-bold tracking-widest uppercase text-sm mb-2 block">Filosofi Kami</span>
            <h2 className="font-display text-4xl font-bold text-brand-dark">
                Pendidikan Berbasis <span className="text-brand-primary underline decoration-wavy decoration-brand-accent/50 underline-offset-4">Lingkungan</span>
            </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            {/* Vision Card */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-brand-primary/5 border border-slate-100 hover:border-brand-primary/30 transition-all duration-300 group">
                <div className="w-14 h-14 bg-brand-light rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform text-brand-primary">
                    🌱
                </div>
                <h3 className="font-display text-2xl font-bold mb-3 text-brand-dark">Visi Adiwiyata</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                    Mewujudkan insan yang peduli lingkungan, cerdas, dan siap menghadapi tantangan global dengan landasan iman dan taqwa.
                </p>
            </div>

            {/* Mission Card */}
            <div className="bg-gradient-to-br from-brand-primary to-brand-secondary p-8 rounded-[2.5rem] shadow-xl shadow-brand-primary/20 text-white transform md:-translate-y-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 text-2xl">
                    🚀
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">Misi Unggulan</h3>
                <ul className="space-y-3 text-sm font-medium opacity-90">
                    <li className="flex items-center gap-3"><span className="bg-white/20 p-1 rounded-full text-xs">✓</span> Pembelajaran berbasis alam</li>
                    <li className="flex items-center gap-3"><span className="bg-white/20 p-1 rounded-full text-xs">✓</span> Digitalisasi pendidikan</li>
                    <li className="flex items-center gap-3"><span className="bg-white/20 p-1 rounded-full text-xs">✓</span> Pengembangan bakat siswa</li>
                </ul>
            </div>

            {/* Values Card */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-brand-primary/5 border border-slate-100 hover:border-brand-blue/30 transition-all duration-300 group">
                 <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform text-brand-blue">
                    💎
                </div>
                <h3 className="font-display text-2xl font-bold mb-3 text-brand-dark">Nilai Karakter</h3>
                <div className="flex flex-wrap gap-2">
                    {['Religius', 'Integritas', 'Gotong Royong', 'Mandiri'].map(val => (
                        <span key={val} className="px-3 py-1 bg-slate-50 border border-slate-100 text-slate-600 rounded-full text-xs font-bold">
                            {val}
                        </span>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* 2. SECTION: SAMBUTAN KEPALA SEKOLAH (Spotlight) */}
      <div className="mb-32">
        <div className="glass bg-white/60 rounded-[3rem] p-8 md:p-12 border border-white shadow-2xl relative overflow-hidden">
            {/* Decorative Quotes */}
            <div className="absolute top-4 right-8 text-9xl font-serif text-brand-primary/5 select-none">"</div>
            
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 relative z-10">
                {/* Principal Image */}
                <div className="relative shrink-0">
                    <div className="w-48 h-48 md:w-64 md:h-64 rounded-full p-2 border-2 border-dashed border-brand-accent relative z-10">
                        <img 
                            src={principal?.image} 
                            alt={principal?.name}
                            className="w-full h-full object-cover rounded-full shadow-lg" 
                        />
                    </div>
                    {/* Circle Decor */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-brand-primary rounded-full blur-xl opacity-30 -z-10"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-brand-accent rounded-full blur-xl opacity-30 -z-10"></div>
                </div>

                {/* Text Content */}
                <div className="text-center md:text-left flex-1">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wider mb-4">
                        Sambutan Kepala Sekolah
                    </span>
                    <h3 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-4">
                        Selamat Datang di <br/> {schoolName}
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-6 italic text-lg">
                        "Kami berkomitmen mencetak generasi emas yang tidak hanya cerdas secara akademis, 
                        tetapi juga memiliki kepedulian tinggi terhadap kelestarian lingkungan. 
                        Mari bersinergi membangun masa depan yang hijau dan bermartabat."
                    </p>
                    <div className="border-l-4 border-brand-accent pl-4">
                        <p className="font-bold text-brand-dark text-lg">{principal?.name}</p>
                        <p className="text-slate-500 text-sm">{principal?.role}</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 3. SECTION: GURU & STAF (Grid) */}
      <div className="relative">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
                <h3 className="font-display text-3xl font-bold text-brand-dark">Tim Pendidik</h3>
                <p className="text-slate-500 mt-2">Guru-guru profesional yang siap membimbing siswa.</p>
            </div>
            <a href="#" className="text-brand-primary font-bold hover:underline decoration-brand-accent decoration-2 underline-offset-4 mt-4 md:mt-0">
                Lihat Seluruh Guru &rarr;
            </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {otherTeachers.map((teacher) => (
                <div key={teacher.id} className="group bg-white p-4 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1">
                    <div className="aspect-square rounded-2xl overflow-hidden mb-4 relative">
                        <img 
                            src={teacher.image} 
                            alt={teacher.name} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-brand-dark/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="text-center">
                        <h4 className="font-bold text-slate-800 text-sm group-hover:text-brand-primary transition-colors truncate">{teacher.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">{teacher.role}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
