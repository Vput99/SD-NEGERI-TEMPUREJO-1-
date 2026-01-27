
import React, { useState, useEffect } from 'react';

interface ExamDetailPageProps {
  onBack: () => void;
}

const GENERAL_INFO = {
  id: 'info-umum',
  name: 'Jadwal & Tata Tertib',
  icon: '📅',
  description: 'Informasi pelaksanaan TKA (Tes Kemampuan Akademik) Jenjang SD/MI Tahun 2026. Pelaksanaan Utama dijadwalkan pada rentang 20 - 30 April 2026.',
  schedule: [
    { day: "Senin, 20 April 2026", time: "07.30 - 09.30 WIB", mapel: "Literasi (Bahasa Indonesia)" },
    { day: "Selasa, 21 April 2026", time: "07.30 - 09.30 WIB", mapel: "Numerasi (Matematika)" },
  ],
  timeline: [
      { phase: "Simulasi", date: "2 - 8 Maret 2026" },
      { phase: "Gladi Bersih", date: "9 - 17 Maret 2026" },
      { phase: "Pelaksanaan Utama", date: "20 - 30 April 2026" },
      { phase: "Pengumuman Hasil", date: "24 Mei 2026" }
  ],
  requirements: [
      "Membawa Kartu Peserta Ujian (Wajib).",
      "Mengenakan seragam sekolah lengkap dan rapi (sesuai hari).",
      "Membawa alat tulis sendiri (Pensil 2B, Penghapus, Rautan, Penggaris).",
      "Hadir di lokasi ujian 30 menit sebelum ujian dimulai."
  ],
  rules: [
      "Dilarang membawa alat komunikasi (HP/Smartwatch) ke dalam ruang ujian.",
      "Dilarang meminjam alat tulis kepada peserta lain selama ujian berlangsung.",
      "Tas dan buku pelajaran diletakkan di depan kelas saat ujian."
  ]
};

// Data Struktur diperkaya dengan Materi Terpetakan & Bank Soal Lengkap (AKM Google Sources)
// UPDATE: Sesuai arahan Pusmendik, TKA SD Fokus pada Literasi & Numerasi
const SUBJECT_DATA = [
  {
    id: 'bahasa-indonesia',
    name: 'Literasi (Bahasa Indonesia)',
    icon: '📖',
    description: 'Materi Literasi SD/MI: Menemukan informasi, menginterpretasi, serta mengevaluasi teks sastra dan informasi sesuai level kognitif siswa kelas 6.',
    studyGuides: [
        "Menentukan Ide Pokok & Kalimat Utama dalam Paragraf",
        "Menyimpulkan Isi Teks (Laporan, Berita, Pidato)",
        "Menggali Informasi Tersirat (Mengapa & Bagaimana)",
        "Memprediksi Kejadian Berdasarkan Isi Cerita",
        "Menentukan Nilai Moral / Amanat dalam Cerita Fiksi/Pantun",
        "Memperbaiki Tata Kalimat & Ejaan (PUEBI)",
        "Melengkapi Formulir & Daftar Riwayat Hidup"
    ],
    domains: [
      {
        title: 'Membaca Teks Sastra (Fiksi)',
        desc: 'Memahami teks narasi, puisi, atau cerita rakyat. Siswa diminta menganalisis unsur intrinsik (tokoh, watak, latar, alur) dan nilai moral.',
        level: 'L3 (Penalaran)'
      },
      {
        title: 'Membaca Teks Informasi',
        desc: 'Memahami teks eksplanasi, prosedur, atau laporan. Siswa diminta menemukan fakta, data, dan menyimpulkan sebab-akibat fenomena.',
        level: 'L2 (Aplikasi)'
      },
      {
        title: 'Menulis & Menyunting',
        desc: 'Melengkapi paragraf rumpang, memperbaiki kesalahan penggunaan tanda baca/huruf kapital, dan menyusun kalimat efektif.',
        level: 'L1 (Pemahaman)'
      }
    ],
    distributions: [
        { topic: 'Membaca Sastra (Cerpen/Fabel)', count: 15, percent: '30%' },
        { topic: 'Membaca Informasi (Berita/Artikel)', count: 20, percent: '40%' },
        { topic: 'Tata Bahasa & Ejaan', count: 10, percent: '20%' },
        { topic: 'Menulis Terbatas', count: 5, percent: '10%' },
    ],
    examples: [
        {
            type: "Pilihan Ganda",
            q: "STIMULUS: Teks Laporan Hasil Observasi\n\n'Hutan mangrove memiliki peran penting dalam mencegah abrasi pantai. Akar-akar pohon bakau yang kuat mampu menahan hantam ombak sehingga tanah tidak mudah terkikis. Selain itu, hutan mangrove juga menjadi habitat bagi berbagai biota laut seperti kepiting, udang, dan ikan kecil.'\n\nIde pokok paragraf di atas adalah...",
            options: ["A. Hutan mangrove sebagai habitat biota laut.", "B. Fungsi hutan mangrove mencegah abrasi.", "C. Akar pohon bakau yang sangat kuat.", "D. Jenis-jenis hewan di hutan mangrove."],
            ans: "B. Fungsi hutan mangrove mencegah abrasi. (Ide pokok biasanya terletak di awal/akhir kalimat yang menjadi inti pembahasan)."
        },
        {
            type: "Pilihan Ganda Kompleks",
            q: "STIMULUS: Cerita Fabel 'Semut dan Belalang'.\n\nPada musim panas, Belalang menari dan menyanyi seharian, sementara Semut sibuk mengumpulkan makanan untuk musim dingin. Belalang mengejek Semut yang bekerja keras. Saat musim dingin tiba, Belalang kelaparan dan kedinginan, sedangkan Semut nyaman di sarangnya yang penuh makanan.\n\nBerdasarkan cerita di atas, manakah pernyataan yang BENAR? (Pilih 2)",
            options: ["1. Belalang adalah tokoh yang rajin bekerja.", "2. Semut memiliki watak antisipatif dan pekerja keras.", "3. Belalang menyesal karena tidak mengumpulkan makanan.", "4. Musim dingin adalah waktu yang tepat untuk menari."],
            ans: "2 dan 3. (Pernyataan 1 salah karena Belalang malas, Pernyataan 4 salah karena musim dingin bukan waktu menari bagi serangga di cerita)."
        },
        {
            type: "Isian Singkat (Tata Bahasa)",
            q: "Perhatikan kalimat berikut:\n'Para hadirin dimohon untuk (duduk) kembali ke tempat masing-masing.'\n\nKata berimbuhan yang tepat untuk melengkapi kalimat tersebut agar menjadi efektif adalah...",
            options: [],
            ans: "menduduki / duduk. (Namun dalam konteks kalimat efektif, cukup 'duduk' atau 'kembali duduk'. Jika harus berimbuhan: 'menduduki kursi' tapi di sini konteksnya tempat)."
        },
        {
            type: "Pilihan Ganda (Pantun)",
            q: "STIMULUS: Pantun Nasihat\n\nPergi ke pasar membeli batik,\nJangan lupa membeli durian.\nWahai muridlah berakhlak baik,\nAgar disayang teman dan kawan.\n\nAmanat yang terkandung dalam pantun di atas adalah...",
            options: ["A. Kita harus sering ke pasar membeli batik.", "B. Kita harus membelikan durian untuk teman.", "C. Akhlak yang baik membuat kita disukai banyak orang.", "D. Murid yang baik adalah yang suka jajan."],
            ans: "C. Akhlak yang baik membuat kita disukai banyak orang. (Amanat pantun terdapat pada baris 3 dan 4)."
        },
        {
            type: "Uraian (Teks Prosedur)",
            q: "STIMULUS: Cara Mencuci Tangan\n1. Basahi tangan dengan air mengalir.\n2. Tuang sabun secukupnya.\n3. Gosok telapak tangan, punggung tangan, dan sela-sela jari.\n4. (...)\n5. Keringkan tangan dengan handuk bersih.\n\nKalimat yang tepat untuk melengkapi langkah nomor 4 adalah...",
            options: [],
            ans: "Bilas tangan dengan air bersih/mengalir sampai busa hilang."
        },
        {
            type: "Menjodohkan",
            q: "Pasangkanlah pernyataan sebab-akibat berikut berdasarkan teks 'Pemanasan Global':\n\nA. Es di kutub mencair\nB. Penggunaan kendaraan bermotor berlebih\n\n1. Meningkatnya gas karbon dioksida\n2. Naiknya permukaan air laut",
            options: [],
            ans: "A -> 2 (Akibat), B -> 1 (Sebab)"
        }
    ]
  },
  {
    id: 'matematika',
    name: 'Numerasi (Matematika)',
    icon: '📐',
    description: 'Numerasi Level SD/MI: Mengukur kemampuan berpikir menggunakan konsep bilangan, geometri, dan data untuk masalah kontekstual sehari-hari.',
    studyGuides: [
        "Operasi Hitung Campuran Bilangan Cacah & Bulat",
        "Menghitung FPB & KPK (Soal Cerita)",
        "Operasi Hitung Pecahan (Desimal, Persen, Campuran)",
        "Perbandingan Senilai & Skala Peta",
        "Luas & Keliling Bangun Datar (Lingkaran, Gabungan)",
        "Volume & Luas Permukaan Bangun Ruang (Kubus, Balok, Tabung)",
        "Analisis Data (Mean, Median, Modus) dari Tabel/Diagram"
    ],
    domains: [
      {
        title: 'Bilangan & Aljabar',
        desc: 'Menyelesaikan masalah yang berkaitan dengan operasi hitung campuran, pecahan, serta pola bilangan dan rasio.',
        level: 'L2 (Aplikasi)'
      },
      {
        title: 'Geometri & Pengukuran',
        desc: 'Menghitung luas permukaan dan volume bangun ruang, serta menyelesaikan masalah yang melibatkan satuan waktu, jarak, dan kecepatan.',
        level: 'L3 (Penalaran)'
      },
      {
        title: 'Data & Ketidakpastian',
        desc: 'Membaca data dari diagram batang/lingkaran, serta menentukan rata-rata (mean) dan nilai yang paling sering muncul (modus).',
        level: 'L2 (Aplikasi)'
      }
    ],
    distributions: [
        { topic: 'Bilangan (Cacah, Bulat, Pecahan)', count: 12, percent: '30%' },
        { topic: 'Geometri & Pengukuran', count: 14, percent: '35%' },
        { topic: 'Pengolahan Data (Statistika)', count: 10, percent: '25%' },
        { topic: 'Logika & Penalaran', count: 4, percent: '10%' },
    ],
    examples: [
        {
            type: "Pilihan Ganda (HOTS - Geometri)",
            q: "STIMULUS: Renovasi Kamar.\n\nAyah ingin memasang keramik di lantai kamar tidur berukuran 4 m x 5 m. Ukuran keramik yang akan dipasang adalah 40 cm x 40 cm. Satu dus berisi 6 keping keramik.\n\nBerapa banyak dus keramik MINIMAL yang harus dibeli Ayah agar cukup?",
            options: ["A. 20 dus", "B. 21 dus", "C. 22 dus", "D. 25 dus"],
            ans: "B. 21 dus. \n(Luas Lantai = 400x500 = 200.000 cm². Luas 1 Keramik = 40x40 = 1.600 cm². Butuh 125 keramik. 125 ÷ 6 = 20,8. Dibulatkan ke atas jadi 21)."
        },
        {
            type: "Uraian (Statistika)",
            q: "STIMULUS: Data Berat Badan.\n\nData berat badan (kg) siswa kelas 6 adalah sebagai berikut: 32, 34, 32, 35, 36, 32, 35, 33, 34, 35, 32.\n\nTentukan Modus dan Median dari data tersebut!",
            options: [],
            ans: "Modus = 32 (muncul paling sering, 4 kali). \nMedian = 34 (Urutkan data: 32,32,32,32,33,[34],34,35,35,35,36)."
        },
        {
            type: "Pilihan Ganda (Diskon - Bilangan)",
            q: "STIMULUS: Toko Buku Murah\n\nBudi membeli tas sekolah seharga Rp200.000,00. Toko memberikan diskon sebesar 15%. Berapakah uang yang harus dibayarkan Budi?",
            options: ["A. Rp170.000,00", "B. Rp175.000,00", "C. Rp180.000,00", "D. Rp185.000,00"],
            ans: "A. Rp170.000,00. \n(Diskon = 15/100 x 200.000 = 30.000. Bayar = 200.000 - 30.000 = 170.000)."
        },
        {
            type: "Isian Singkat (Debit & Volume)",
            q: "Sebuah akuarium berbentuk balok dengan panjang 80 cm, lebar 50 cm, dan tinggi 60 cm. Akuarium tersebut akan diisi air menggunakan selang dengan debit 12 liter/menit.\n\nWaktu yang diperlukan untuk mengisi akuarium sampai penuh adalah ... menit.",
            options: [],
            ans: "20 menit. \n(Volume = 80x50x60 = 240.000 cm³ = 240 liter. Waktu = Volume/Debit = 240/12 = 20 menit)."
        },
        {
            type: "Pilihan Ganda (Rata-rata)",
            q: "Rata-rata nilai ulangan matematika dari 8 siswa adalah 75. Jika nilai Andi dimasukkan, rata-ratanya menjadi 76. Berapakah nilai ulangan Andi?",
            options: ["A. 80", "B. 82", "C. 84", "D. 85"],
            ans: "C. 84. \n(Total awal = 8 x 75 = 600. Total baru = 9 x 76 = 684. Nilai Andi = 684 - 600 = 84)."
        }
    ]
  }
];

type TabType = 'capaian' | 'distribusi' | 'asesmen';

const ExamDetailPage: React.FC<ExamDetailPageProps> = ({ onBack }) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState('info-umum'); // Default to General Info
  const [activeTab, setActiveTab] = useState<TabType>('capaian');

  // Scroll to top when mounted
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const activeSubject = SUBJECT_DATA.find(s => s.id === selectedSubjectId);
  const isGeneralInfo = selectedSubjectId === 'info-umum';

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-body text-slate-800 pt-20">
      
      {/* Top Navigation Bar (Breadcrumbs style) */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-[70px] md:top-[80px] z-30 transition-all">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <button onClick={onBack} className="hover:text-blue-600 font-medium flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Beranda
                </button>
                <span>/</span>
                <span className="font-medium text-slate-800">Info TKA</span>
                <span>/</span>
                <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">
                  {isGeneralInfo ? GENERAL_INFO.name : activeSubject?.name}
                </span>
            </div>
            
            <button 
                onClick={onBack}
                className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-red-500 border border-slate-200 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali
            </button>
        </div>
      </div>

       {/* Floating Back Button (Mobile/Tablet Friendly) */}
       <button 
            onClick={onBack}
            className="fixed bottom-6 left-6 z-50 bg-white/90 backdrop-blur border border-slate-200 text-slate-700 hover:text-blue-600 shadow-lg p-4 rounded-full transition-all hover:scale-110 hover:shadow-xl group"
            title="Kembali ke Beranda"
            aria-label="Kembali"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
       </button>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* SIDEBAR: Subject List */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden sticky top-32">
                    <div className="p-4 bg-blue-600 text-white">
                        <h3 className="font-display font-bold text-lg">Menu Informasi</h3>
                        <p className="text-blue-100 text-xs">Pilih untuk melihat detail</p>
                    </div>
                    <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible">
                        {/* GENERAL INFO BUTTON */}
                        <button
                            onClick={() => setSelectedSubjectId(GENERAL_INFO.id)}
                            className={`
                                flex items-center gap-3 p-4 text-left transition-all border-b border-slate-50 min-w-[200px] lg:min-w-0
                                ${selectedSubjectId === GENERAL_INFO.id
                                    ? 'bg-blue-50 text-blue-700 border-l-4 border-l-blue-600' 
                                    : 'text-slate-600 hover:bg-slate-50 border-l-4 border-l-transparent'}
                            `}
                        >
                            <span className="text-xl">{GENERAL_INFO.icon}</span>
                            <span className="font-bold text-sm">{GENERAL_INFO.name}</span>
                        </button>

                        {/* SUBJECT BUTTONS */}
                        {SUBJECT_DATA.map((subject) => (
                            <button
                                key={subject.id}
                                onClick={() => { setSelectedSubjectId(subject.id); setActiveTab('capaian'); }}
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
                                 {isGeneralInfo 
                                    ? "Pastikan istirahat cukup sebelum hari ujian dan persiapkan alat tulis dengan lengkap." 
                                    : "Pelajari materi berdasarkan domain yang tertera. Fokus pada pemahaman konsep (L2 & L3), bukan hanya hafalan."
                                 }
                             </p>
                         </div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="lg:col-span-3">
                
                {/* GENERAL INFO VIEW */}
                {isGeneralInfo ? (
                   <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
                      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200">
                          <div className="flex items-start justify-between mb-4">
                              <div>
                                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                                      Informasi Penting
                                  </span>
                                  <h2 className="font-display text-3xl font-bold text-slate-800 mb-2">
                                      {GENERAL_INFO.name}
                                  </h2>
                              </div>
                              <div className="text-5xl opacity-10 hidden sm:block grayscale">
                                  {GENERAL_INFO.icon}
                              </div>
                          </div>
                          <p className="text-slate-600 leading-relaxed text-lg border-l-4 border-slate-300 pl-4 italic">
                              "{GENERAL_INFO.description}"
                          </p>
                      </div>

                      {/* NEW: TIMELINE BOX */}
                      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
                           <h3 className="font-bold text-indigo-900 text-lg mb-4 flex items-center gap-2">
                                🗓️ Lini Masa Pelaksanaan (2026)
                           </h3>
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {GENERAL_INFO.timeline.map((item, idx) => (
                                    <div key={idx} className="bg-white p-3 rounded-lg border border-indigo-50 shadow-sm text-center">
                                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">{item.phase}</p>
                                        <p className="text-sm font-bold text-indigo-700">{item.date}</p>
                                    </div>
                                ))}
                           </div>
                      </div>

                      {/* JADWAL GRID */}
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                          <div className="p-4 bg-blue-600 text-white flex items-center gap-2">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                             </svg>
                             <h3 className="font-bold text-lg">Jadwal Pelaksanaan Utama</h3>
                          </div>
                          <div className="overflow-x-auto">
                              <table className="w-full text-sm text-left">
                                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                      <tr>
                                          <th className="px-6 py-4 font-bold">Hari, Tanggal</th>
                                          <th className="px-6 py-4 font-bold">Waktu</th>
                                          <th className="px-6 py-4 font-bold">Mata Pelajaran</th>
                                      </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                      {GENERAL_INFO.schedule.map((sch, idx) => (
                                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                              <td className="px-6 py-4 font-bold text-slate-700">{sch.day}</td>
                                              <td className="px-6 py-4 text-slate-600 font-mono">{sch.time}</td>
                                              <td className="px-6 py-4 text-blue-600 font-bold">{sch.mapel}</td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                           {/* RULES */}
                           <div className="bg-red-50 border border-red-100 rounded-xl p-6">
                              <h3 className="font-bold text-red-800 text-lg mb-4 flex items-center gap-2">
                                  ⚠️ Tata Tertib Peserta
                              </h3>
                              <ul className="space-y-3">
                                  {GENERAL_INFO.rules.map((rule, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-sm text-red-700">
                                          <span className="mt-0.5">•</span>
                                          <span>{rule}</span>
                                      </li>
                                  ))}
                              </ul>
                           </div>

                           {/* REQUIREMENTS */}
                           <div className="bg-green-50 border border-green-100 rounded-xl p-6">
                              <h3 className="font-bold text-green-800 text-lg mb-4 flex items-center gap-2">
                                  🎒 Perlengkapan Wajib
                              </h3>
                              <ul className="space-y-3">
                                  {GENERAL_INFO.requirements.map((req, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-sm text-green-700">
                                          <span className="mt-0.5">✅</span>
                                          <span>{req}</span>
                                      </li>
                                  ))}
                              </ul>
                           </div>
                      </div>
                   </div>
                ) : (
                    // SUBJECT DETAIL VIEW (Existing content wrapper)
                    <>
                        {/* Header Content */}
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">
                                        Jenjang SD/MI - Kelas 6
                                    </span>
                                    <h2 className="font-display text-3xl font-bold text-slate-800 mb-2">
                                        {activeSubject?.name}
                                    </h2>
                                </div>
                                <div className="text-5xl opacity-10 hidden sm:block grayscale">
                                    {activeSubject?.icon}
                                </div>
                            </div>
                            <p className="text-slate-600 leading-relaxed text-lg border-l-4 border-slate-300 pl-4 italic">
                                "{activeSubject?.description}"
                            </p>
                        </div>

                        {/* Tabs Navigation */}
                        <div className="flex border-b border-slate-200 mb-6 gap-6 overflow-x-auto">
                            <button 
                                onClick={() => setActiveTab('capaian')}
                                className={`pb-3 border-b-2 font-bold text-sm whitespace-nowrap transition-colors ${
                                    activeTab === 'capaian' 
                                    ? 'border-blue-600 text-blue-600' 
                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                Capaian Pembelajaran
                            </button>
                            <button 
                                onClick={() => setActiveTab('distribusi')}
                                className={`pb-3 border-b-2 font-bold text-sm whitespace-nowrap transition-colors ${
                                    activeTab === 'distribusi' 
                                    ? 'border-blue-600 text-blue-600' 
                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                Distribusi Soal
                            </button>
                            <button 
                                onClick={() => setActiveTab('asesmen')}
                                className={`pb-3 border-b-2 font-bold text-sm whitespace-nowrap transition-colors ${
                                    activeTab === 'asesmen' 
                                    ? 'border-blue-600 text-blue-600' 
                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                Bank Soal Latihan
                            </button>
                        </div>

                        {/* CONTENT: CAPAIAN PEMBELAJARAN */}
                        {activeTab === 'capaian' && activeSubject && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                
                                {/* Section Materi Terpetakan (NEW) */}
                                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
                                    <h3 className="font-bold text-indigo-900 text-lg mb-4 flex items-center gap-2">
                                        📚 Rangkuman Materi Esensial
                                    </h3>
                                    <ul className="grid md:grid-cols-2 gap-3">
                                        {activeSubject.studyGuides?.map((guide, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-indigo-800">
                                                <span className="text-indigo-500 mt-0.5">•</span>
                                                <span>{guide}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-slate-800 text-lg">Domain Kompetensi (Kisi-kisi US)</h3>
                                        <span className="text-xs text-slate-500">Sesuai Kisi-kisi Resmi Kemdikbud</span>
                                    </div>

                                    <div className="space-y-4">
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
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CONTENT: DISTRIBUSI SOAL */}
                        {activeTab === 'distribusi' && activeSubject && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="p-6 border-b border-slate-100 bg-slate-50">
                                        <h3 className="font-bold text-lg text-slate-800">Sebaran Materi Ujian</h3>
                                        <p className="text-slate-500 text-sm">Estimasi jumlah dan persentase soal per topik materi.</p>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-white text-slate-500 border-b border-slate-200">
                                                <tr>
                                                    <th className="px-6 py-4 font-bold">No</th>
                                                    <th className="px-6 py-4 font-bold">Materi Pokok</th>
                                                    <th className="px-6 py-4 font-bold text-center">Jumlah Soal</th>
                                                    <th className="px-6 py-4 font-bold text-right">Persentase</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {activeSubject.distributions?.map((dist, idx) => (
                                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-6 py-4 text-slate-400 font-medium">{idx + 1}</td>
                                                        <td className="px-6 py-4 font-bold text-slate-700">{dist.topic}</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="inline-block px-3 py-1 bg-slate-100 rounded-full font-bold text-slate-600">{dist.count}</span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex items-center justify-end gap-3">
                                                                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: dist.percent }}></div>
                                                                </div>
                                                                <span className="font-bold text-blue-600 w-8">{dist.percent}</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="bg-slate-50 font-bold text-slate-700">
                                                <tr>
                                                    <td colSpan={2} className="px-6 py-4 text-right">Total Soal</td>
                                                    <td className="px-6 py-4 text-center text-lg">
                                                        {activeSubject.distributions?.reduce((acc, curr) => acc + curr.count, 0)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">100%</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                                <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
                                    <strong>Catatan:</strong> Distribusi soal dapat berubah menyesuaikan kebijakan dinas pendidikan terkait penyusunan kisi-kisi soal tahun berjalan.
                                </div>
                            </div>
                        )}

                        {/* CONTENT: CONTOH ASESMEN */}
                        {activeTab === 'asesmen' && activeSubject && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                     <div>
                                        <h3 className="font-bold text-lg text-slate-800">Bank Soal Latihan</h3>
                                        <p className="text-xs text-slate-500">Model AKM (Asesmen Kompetensi Minimum) & Materi Esensial</p>
                                     </div>
                                     <button className="text-sm font-bold text-blue-600 border border-blue-200 px-4 py-2 rounded-full hover:bg-blue-50 transition-colors">
                                        📥 Download PDF Soal
                                     </button>
                                </div>
                                
                                {activeSubject.examples?.map((ex, idx) => (
                                    <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-slate-200"></div>
                                        
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="inline-block px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase rounded tracking-wide">
                                                {ex.type}
                                            </span>
                                            <span className="text-slate-300 font-display font-bold text-4xl opacity-50">
                                                {idx + 1}
                                            </span>
                                        </div>
                                        
                                        {/* Soal dengan formatting line break untuk Stimulus */}
                                        <div className="font-medium text-slate-800 mb-6 text-sm md:text-base leading-relaxed whitespace-pre-line">
                                            {ex.q}
                                        </div>

                                        {ex.options && ex.options.length > 0 && (
                                            <div className="space-y-2 mb-6 pl-4 border-l-2 border-slate-100">
                                                {ex.options.map((opt, i) => (
                                                    <div key={i} className="text-slate-600 hover:text-slate-900 cursor-default p-2 rounded hover:bg-slate-50 transition-colors text-sm">
                                                        {opt}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="bg-green-50 border border-green-100 p-3 rounded-lg flex gap-2 items-start">
                                            <span className="text-green-600 mt-0.5">✅</span>
                                            <div>
                                                <span className="text-xs font-bold text-green-700 uppercase block mb-1">Kunci Jawaban & Pembahasan</span>
                                                <span className="font-bold text-slate-800 text-sm whitespace-pre-line">{ex.ans}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetailPage;
