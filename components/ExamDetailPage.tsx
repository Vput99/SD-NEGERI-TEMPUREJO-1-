
import React, { useState, useEffect } from 'react';

interface ExamDetailPageProps {
  onBack: () => void;
}

// Data Struktur mirip Pusmendik (Domain & Kompetensi)
const SUBJECT_DATA = [
  {
    id: 'bahasa-indonesia',
    name: 'Bahasa Indonesia',
    icon: '📖',
    description: 'Mengukur kemampuan memahami, menggunakan, mengevaluasi, merefleksikan berbagai jenis teks untuk menyelesaikan masalah.',
    domains: [
      {
        title: 'Membaca Teks Sastra',
        desc: 'Peserta didik mampu menyimpulkan perasaan tokoh, mengidentifikasi alur cerita, dan membandingkan ciri-ciri teks fiksi.',
        level: 'L3 (Penalaran)'
      },
      {
        title: 'Membaca Teks Informasi',
        desc: 'Peserta didik mampu membandingkan hal-hal utama (topik utama) dalam teks, menemukan informasi tersirat, dan menyimpulkan sebab-akibat.',
        level: 'L2 (Aplikasi)'
      },
      {
        title: 'Menulis Terbatas',
        desc: 'Melengkapi kalimat/paragraf dengan kata bentukan atau istilah yang tepat sesuai konteks.',
        level: 'L1 (Pemahaman)'
      }
    ]
  },
  {
    id: 'matematika',
    name: 'Matematika',
    icon: '📐',
    description: 'Mengukur kemampuan berpikir menggunakan konsep, prosedur, fakta, dan alat matematika untuk menyelesaikan masalah sehari-hari.',
    domains: [
      {
        title: 'Bilangan',
        desc: 'Operasi hitung bilangan bulat, pecahan, dan desimal. Menyelesaikan masalah penalaran yang melibatkan rasio dan persen.',
        level: 'L2 (Aplikasi)'
      },
      {
        title: 'Geometri & Pengukuran',
        desc: 'Menghitung luas permukaan dan volume bangun ruang gabungan (kubus, balok, tabung). Menentukan jaring-jaring bangun ruang.',
        level: 'L3 (Penalaran)'
      },
      {
        title: 'Data & Ketidakpastian',
        desc: 'Menganalisis data dalam bentuk tabel, diagram batang, atau diagram lingkaran. Menentukan rata-rata (mean), modus, dan median.',
        level: 'L2 (Aplikasi)'
      }
    ]
  },
  {
    id: 'ipa',
    name: 'Ilmu Pengetahuan Alam',
    icon: '🔬',
    description: 'Mengukur kompetensi ilmiah dalam menjelaskan fenomena dan merancang penyelidikan ilmiah.',
    domains: [
      {
        title: 'Makhluk Hidup & Lingkungannya',
        desc: 'Penyesuaian diri makhluk hidup, pelestarian lingkungan, dan hubungan antar makhluk hidup (rantai makanan).',
        level: 'L1 (Pengetahuan)'
      },
      {
        title: 'Struktur & Fungsi Makhluk Hidup',
        desc: 'Sistem pernapasan, pencernaan, dan peredaran darah manusia serta cara memelihara kesehatannya. Perkembangbiakan hewan dan tumbuhan.',
        level: 'L2 (Aplikasi)'
      },
      {
        title: 'Benda & Sifatnya',
        desc: 'Sifat benda, perubahan wujud benda, gaya dan gerak, serta energi dan perubahannya (listrik, panas, bunyi).',
        level: 'L3 (Penalaran)'
      },
      {
        title: 'Bumi & Alam Semesta',
        desc: 'Sistem tata surya, rotasi dan revolusi bumi/bulan serta dampaknya (gerhana, pasang surut air laut).',
        level: 'L2 (Aplikasi)'
      }
    ]
  },
  {
    id: 'pkn',
    name: 'Pendidikan Pancasila',
    icon: '🇮🇩',
    description: 'Mengukur pemahaman nilai-nilai Pancasila dan penerapannya dalam kehidupan berbangsa dan bernegara.',
    domains: [
      {
        title: 'Pancasila',
        desc: 'Penerapan nilai-nilai Pancasila sila ke-1 sampai ke-5 dalam kehidupan sehari-hari di lingkungan sekolah dan masyarakat.',
        level: 'L2 (Aplikasi)'
      },
      {
        title: 'UUD 1945',
        desc: 'Hak dan kewajiban sebagai warga negara serta keragaman sosial budaya masyarakat Indonesia.',
        level: 'L1 (Pemahaman)'
      },
      {
        title: 'NKRI',
        desc: 'Menjaga keutuhan wilayah NKRI dan peran Indonesia dalam lingkup ASEAN.',
        level: 'L3 (Penalaran)'
      }
    ]
  }
];

const ExamDetailPage: React.FC<ExamDetailPageProps> = ({ onBack }) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState(SUBJECT_DATA[0].id);

  // Scroll to top when mounted
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const activeSubject = SUBJECT_DATA.find(s => s.id === selectedSubjectId) || SUBJECT_DATA[0];

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-body text-slate-800 pt-20">
      
      {/* Top Navigation Bar (Breadcrumbs style) */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-[80px] z-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-500 overflow-x-auto whitespace-nowrap">
                <button onClick={onBack} className="hover:text-blue-600 font-medium">Beranda</button>
                <span>/</span>
                <span className="font-medium text-slate-800">Tes Kemampuan Akhir</span>
                <span>/</span>
                <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">{activeSubject.name}</span>
            </div>
            
            <button 
                onClick={onBack}
                className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-red-500 border border-slate-200 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Tutup
            </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* SIDEBAR: Subject List */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden sticky top-32">
                    <div className="p-4 bg-blue-600 text-white">
                        <h3 className="font-display font-bold text-lg">Mata Pelajaran</h3>
                        <p className="text-blue-100 text-xs">Pilih mapel untuk melihat detail</p>
                    </div>
                    <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible">
                        {SUBJECT_DATA.map((subject) => (
                            <button
                                key={subject.id}
                                onClick={() => setSelectedSubjectId(subject.id)}
                                className={`
                                    flex items-center gap-3 p-4 text-left transition-all border-b border-slate-50 last:border-0 min-w-[200px] lg:min-w-0
                                    ${selectedSubjectId === subject.id 
                                        ? 'bg-blue-50 text-blue-700 border-l-4 border-l-blue-600' 
                                        : 'text-slate-600 hover:bg-slate-50 border-l-4 border-l-transparent'}
                                `}
                            >
                                <span className="text-xl">{subject.icon}</span>
                                <span className="font-bold text-sm">{subject.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info Card Sidebar */}
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 hidden lg:block">
                    <div className="flex gap-3">
                         <div className="text-yellow-600 text-xl">💡</div>
                         <div>
                             <h4 className="font-bold text-yellow-800 text-sm mb-1">Tips Belajar</h4>
                             <p className="text-xs text-yellow-700 leading-relaxed">
                                 Pelajari materi berdasarkan domain yang tertera. Fokus pada pemahaman konsep (L2 & L3), bukan hanya hafalan.
                             </p>
                         </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="lg:col-span-3">
                
                {/* Header Content */}
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                                Jenjang SD/MI - Kelas 6
                            </span>
                            <h2 className="font-display text-3xl font-bold text-slate-800 mb-2">
                                {activeSubject.name}
                            </h2>
                        </div>
                        <div className="text-5xl opacity-10 hidden sm:block grayscale">
                            {activeSubject.icon}
                        </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-lg border-l-4 border-slate-300 pl-4 italic">
                        "{activeSubject.description}"
                    </p>
                </div>

                {/* Tabs Visual (Static for now to mimic the look) */}
                <div className="flex border-b border-slate-200 mb-6 gap-6 overflow-x-auto">
                    <button className="pb-3 border-b-2 border-blue-600 text-blue-600 font-bold text-sm whitespace-nowrap">
                        Capaian Pembelajaran
                    </button>
                    <button className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-700 font-medium text-sm whitespace-nowrap">
                        Distribusi Soal
                    </button>
                    <button className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-700 font-medium text-sm whitespace-nowrap">
                        Contoh Asesmen
                    </button>
                </div>

                {/* Content Cards (Domains) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                         <h3 className="font-bold text-slate-800 text-lg">Rincian Kompetensi Dasar</h3>
                         <span className="text-xs text-slate-500">Tahun Ajaran 2025/2026</span>
                    </div>

                    {activeSubject.domains.map((domain, idx) => (
                        <div key={idx} className="bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-colors shadow-sm overflow-hidden group">
                            <div className="p-5 flex flex-col md:flex-row gap-4 md:gap-6 md:items-start">
                                {/* Number Badge */}
                                <div className="shrink-0">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        {idx + 1}
                                    </div>
                                </div>
                                
                                <div className="flex-grow">
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                        <h4 className="font-bold text-slate-800 text-lg">{domain.title}</h4>
                                        <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold
                                            ${domain.level.includes('L3') ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                                              domain.level.includes('L2') ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-green-50 text-green-700 border-green-100'}
                                        `}>
                                            {domain.level}
                                        </span>
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                        {domain.desc}
                                    </p>
                                    
                                    {/* Action Links mimicking detail view */}
                                    <div className="flex gap-4 pt-4 border-t border-slate-50">
                                        <button className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                                            <span>📄</span> Lihat Indikator Soal
                                        </button>
                                        <button className="text-xs font-bold text-slate-500 hover:text-slate-800 hover:underline flex items-center gap-1">
                                            <span>📚</span> Materi Terkait
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetailPage;
