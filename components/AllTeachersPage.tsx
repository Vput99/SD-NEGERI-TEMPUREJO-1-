
import React, { useState } from 'react';
import { Teacher } from '../types';

interface AllTeachersPageProps {
  teachers: Teacher[];
  onBack: () => void;
}

const AllTeachersPage: React.FC<AllTeachersPageProps> = ({ teachers, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const filteredTeachers = teachers.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 font-body animate-in fade-in duration-500">
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div className="mb-10 text-center relative z-10">
          <button 
            onClick={onBack}
            className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-500 hover:text-brand-primary flex items-center gap-2 font-bold transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden md:inline">Kembali</span>
          </button>
          
          <h1 className="font-display text-3xl md:text-5xl font-bold text-slate-800 mb-4">
            Dewan Guru & Staf
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Berkenalan dengan para pendidik berdedikasi yang siap membimbing putra-putri Anda menuju masa depan yang cemerlang.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12 relative">
            <input 
                type="text" 
                placeholder="Cari nama guru atau jabatan..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 shadow-sm transition-all"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>

        {/* Grid Teachers */}
        {filteredTeachers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredTeachers.map((teacher) => (
                <div 
                    key={teacher.id} 
                    onClick={() => setSelectedTeacher(teacher)}
                    className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 flex flex-col cursor-pointer"
                >
                    <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                        <img 
                            src={teacher.image} 
                            alt={teacher.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Decorative Icon */}
                        <div className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-brand-primary shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
                             👨‍🏫
                        </div>
                    </div>
                    
                    <div className="p-6 text-center flex-grow flex flex-col justify-center relative">
                        {/* Blob Decoration */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-1 bg-brand-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <h3 className="font-display text-xl font-bold text-slate-800 mb-1 leading-tight">
                            {teacher.name}
                        </h3>
                        <p className="text-brand-primary font-bold text-sm bg-brand-light inline-block mx-auto px-3 py-1 rounded-full mb-3">
                            {teacher.role}
                        </p>
                        
                        <div className="mt-auto pt-4 border-t border-slate-50 flex justify-center gap-4 opacity-60 hover:opacity-100 transition-opacity">
                            <span className="text-xs text-slate-400 font-bold hover:text-brand-primary uppercase tracking-wider">Klik untuk Profil Lengkap</span>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        ) : (
            <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-slate-700">Guru tidak ditemukan</h3>
                <p className="text-slate-500">Coba kata kunci pencarian yang lain.</p>
            </div>
        )}

        {/* MODAL DETAIL GURU */}
        {selectedTeacher && (
             <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelectedTeacher(null)}>
                 <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative" onClick={e => e.stopPropagation()}>
                    
                    {/* Close Button */}
                    <button onClick={() => setSelectedTeacher(null)} className="absolute top-4 right-4 z-10 bg-white/50 hover:bg-white p-2 rounded-full transition-colors text-slate-600">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    {/* Image Side */}
                    <div className="md:w-2/5 h-64 md:h-auto relative bg-slate-100">
                         <img src={selectedTeacher.image} alt={selectedTeacher.name} className="w-full h-full object-cover" />
                         <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 md:hidden">
                             <h3 className="text-white font-bold text-xl">{selectedTeacher.name}</h3>
                         </div>
                    </div>

                    {/* Info Side */}
                    <div className="md:w-3/5 p-8 bg-white flex flex-col justify-center">
                        <div className="hidden md:block mb-6">
                            <span className="inline-block px-3 py-1 bg-brand-light text-brand-primary text-xs font-bold rounded-full mb-2 border border-brand-primary/20">
                                {selectedTeacher.role}
                            </span>
                            <h2 className="font-display text-3xl font-bold text-slate-800 leading-tight">
                                {selectedTeacher.name}
                            </h2>
                        </div>

                        {/* ID CARD STYLE INFO */}
                        <div className="space-y-4">
                            {selectedTeacher.nip && (
                                <div className="border-l-4 border-brand-primary pl-4 py-1">
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">NIP</p>
                                    <p className="font-mono text-slate-700 font-medium">{selectedTeacher.nip}</p>
                                </div>
                            )}
                            
                            <div className="border-l-4 border-blue-400 pl-4 py-1">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Jabatan</p>
                                <p className="text-slate-700 font-medium">{selectedTeacher.role}</p>
                            </div>

                            {selectedTeacher.education && (
                                <div className="border-l-4 border-yellow-400 pl-4 py-1">
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pendidikan Terakhir</p>
                                    <p className="text-slate-700 font-medium">{selectedTeacher.education}</p>
                                </div>
                            )}

                             {selectedTeacher.motto && (
                                <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-100 italic text-slate-600 text-sm relative">
                                    <span className="text-4xl text-slate-200 absolute top-0 left-2">“</span>
                                    <p className="relative z-10 text-center">{selectedTeacher.motto}</p>
                                    <span className="text-4xl text-slate-200 absolute bottom-[-10px] right-2">”</span>
                                </div>
                            )}
                        </div>
                    </div>

                 </div>
             </div>
        )}

      </div>
    </div>
  );
};

export default AllTeachersPage;
