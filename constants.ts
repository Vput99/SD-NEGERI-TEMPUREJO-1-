
import { NavItem, Teacher, NewsItem, ClassSchedule, GalleryImage } from './types';

export const SCHOOL_NAME = "SD Harapan Bangsa";
export const SCHOOL_ADDRESS = "Jl. Pendidikan No. 123, Jakarta Selatan";
export const SCHOOL_PHONE = "(021) 555-0123";
export const SCHOOL_EMAIL = "info@sdharapanbangsa.sch.id";

export const NAV_ITEMS: NavItem[] = [
  { label: "Beranda", href: "#beranda" },
  { label: "Profil", href: "#profil" },
  { label: "Informasi", href: "#informasi" },
  { label: "Jadwal", href: "#jadwal" },
  { label: "Galeri", href: "#galeri" },
  { label: "PPDB", href: "#ppdb" },
  { label: "Kontak", href: "#kontak" },
];

export const TEACHERS: Teacher[] = [
  { id: 1, name: "Budi Santoso, S.Pd", role: "Kepala Sekolah", image: "https://picsum.photos/id/1005/300/300" },
  { id: 2, name: "Siti Aminah, S.Pd", role: "Wali Kelas 1", image: "https://picsum.photos/id/1011/300/300" },
  { id: 3, name: "Rahmat Hidayat, S.Kom", role: "Guru TIK", image: "https://picsum.photos/id/1025/300/300" },
  { id: 4, name: "Dewi Lestari, S.Sn", role: "Guru Kesenian", image: "https://picsum.photos/id/1027/300/300" },
];

export const NEWS: NewsItem[] = [
  {
    id: 1,
    title: "Penerimaan Siswa Baru Tahun Ajaran 2024/2025",
    date: "10 Mei 2024",
    category: "Pengumuman",
    summary: "Segera daftarkan putra-putri Anda! Kuota terbatas untuk gelombang pertama.",
    image: "https://picsum.photos/id/20/600/400"
  },
  {
    id: 2,
    title: "Juara 1 Lomba Menggambar Tingkat Kota",
    date: "24 April 2024",
    category: "Prestasi",
    summary: "Selamat kepada Ananda Rizky dari Kelas 4B atas prestasinya yang membanggakan.",
    image: "https://picsum.photos/id/180/600/400"
  },
  {
    id: 3,
    title: "Kegiatan Kerja Bakti Jumat Bersih",
    date: "15 April 2024",
    category: "Kegiatan",
    summary: "Seluruh warga sekolah berpartisipasi membersihkan lingkungan sekolah.",
    image: "https://picsum.photos/id/160/600/400"
  }
];

export const CLASS_SCHEDULES: ClassSchedule[] = [
  {
    className: "Kelas 1",
    days: [
      {
        dayName: "Senin",
        schedule: [
          { time: "07:00 - 07:30", subject: "Upacara Bendera" },
          { time: "07:30 - 09:30", subject: "Tematik (Diriku)" },
          { time: "09:30 - 10:00", subject: "Istirahat" },
          { time: "10:00 - 11:00", subject: "Pendidikan Agama" },
        ]
      },
      {
        dayName: "Selasa",
        schedule: [
          { time: "07:00 - 08:30", subject: "PJOK" },
          { time: "08:30 - 09:00", subject: "Istirahat" },
          { time: "09:00 - 10:30", subject: "Matematika Dasar" },
        ]
      },
      { dayName: "Rabu", schedule: [{ time: "07:00 - 10:00", subject: "Tematik (Kegiatanku)" }] },
      { dayName: "Kamis", schedule: [{ time: "07:00 - 09:00", subject: "Seni Budaya & Prakarya" }] },
      { dayName: "Jumat", schedule: [{ time: "07:00 - 08:30", subject: "Senam Pagi" }, { time: "08:30 - 09:30", subject: "Pramuka Siaga" }] },
    ]
  },
  {
    className: "Kelas 2",
    days: [
      { 
        dayName: "Senin", 
        schedule: [
          { time: "07:00 - 07:30", subject: "Upacara Bendera" }, 
          { time: "07:30 - 10:00", subject: "Tematik (Hidup Rukun)" }
        ] 
      },
      { dayName: "Selasa", schedule: [{ time: "07:00 - 09:00", subject: "Matematika" }] },
      { dayName: "Rabu", schedule: [{ time: "07:00 - 09:00", subject: "Bahasa Inggris Dasar" }] },
      { dayName: "Kamis", schedule: [{ time: "07:00 - 09:00", subject: "Seni Budaya" }] },
      { dayName: "Jumat", schedule: [{ time: "07:00 - 09:00", subject: "Pendidikan Agama" }] },
    ]
  },
  {
    className: "Kelas 3",
    days: [
      { dayName: "Senin", schedule: [{ time: "07:00 - 07:30", subject: "Upacara" }, { time: "07:30 - 11:00", subject: "Tematik (Benda di Sekitarku)" }] },
      { dayName: "Selasa", schedule: [{ time: "07:00 - 09:00", subject: "PJOK" }, { time: "09:30 - 11:00", subject: "Matematika" }] },
      { dayName: "Rabu", schedule: [{ time: "07:00 - 11:00", subject: "Bahasa Indonesia" }] },
      { dayName: "Kamis", schedule: [{ time: "07:00 - 09:00", subject: "Bahasa Inggris" }] },
      { dayName: "Jumat", schedule: [{ time: "07:00 - 10:30", subject: "Agama & Pramuka" }] },
    ]
  },
  {
    className: "Kelas 4",
    days: [
      { dayName: "Senin", schedule: [{ time: "07:00 - 07:30", subject: "Upacara" }, { time: "07:30 - 12:00", subject: "Matematika & IPAS" }] },
      { dayName: "Selasa", schedule: [{ time: "07:00 - 12:00", subject: "Bahasa Indonesia" }] },
      { dayName: "Rabu", schedule: [{ time: "07:00 - 10:00", subject: "Seni Musik" }, { time: "10:00 - 12:00", subject: "Bahasa Inggris" }] },
      { dayName: "Kamis", schedule: [{ time: "07:00 - 12:00", subject: "Pendidikan Pancasila" }] },
      { dayName: "Jumat", schedule: [{ time: "07:00 - 11:00", subject: "Agama & Senam" }] },
    ]
  },
  {
    className: "Kelas 5",
    days: [
      { dayName: "Senin", schedule: [{ time: "07:00 - 07:30", subject: "Upacara" }, { time: "07:30 - 12:30", subject: "Tematik" }] },
      { dayName: "Selasa", schedule: [{ time: "07:00 - 10:00", subject: "Matematika" }, { time: "10:30 - 12:30", subject: "IPA" }] },
      { dayName: "Rabu", schedule: [{ time: "07:00 - 12:30", subject: "IPS & PKN" }] },
      { dayName: "Kamis", schedule: [{ time: "07:00 - 12:30", subject: "Bahasa & Sastra" }] },
      { dayName: "Jumat", schedule: [{ time: "07:00 - 11:00", subject: "Agama & Jum'at Bersih" }] },
    ]
  },
  {
    className: "Kelas 6",
    days: [
      { dayName: "Senin", schedule: [{ time: "07:00 - 07:30", subject: "Upacara" }, { time: "07:30 - 13:00", subject: "Pemantapan Materi (UN)" }] },
      { dayName: "Selasa", schedule: [{ time: "07:00 - 13:00", subject: "Matematika Lanjut" }] },
      { dayName: "Rabu", schedule: [{ time: "07:00 - 13:00", subject: "Sains & Praktikum" }] },
      { dayName: "Kamis", schedule: [{ time: "07:00 - 13:00", subject: "Bahasa Inggris & TIK" }] },
      { dayName: "Jumat", schedule: [{ time: "07:00 - 11:00", subject: "Agama & Bimbingan Konseling" }] },
    ]
  }
];

export const GALLERY: GalleryImage[] = [
  { id: 1, category: 'Fasilitas', src: "https://picsum.photos/id/201/800/600", caption: "Lab Komputer Modern" },
  { id: 2, category: 'Akademik', src: "https://picsum.photos/id/301/800/600", caption: "Kegiatan Belajar Mengajar" },
  { id: 3, category: 'Ekstrakurikuler', src: "https://picsum.photos/id/401/800/600", caption: "Latihan Pramuka" },
  { id: 4, category: 'Ekstrakurikuler', src: "https://picsum.photos/id/501/800/600", caption: "Pertandingan Futsal" },
  { id: 5, category: 'Fasilitas', src: "https://picsum.photos/id/600/800/600", caption: "Perpustakaan Lengkap" },
  { id: 6, category: 'Akademik', src: "https://picsum.photos/id/701/800/600", caption: "Praktikum Sains" },
];

export const SYSTEM_CONTEXT = `
Anda adalah asisten virtual bernama "Bu Guru AI" untuk website SD Harapan Bangsa. 
Gaya bicara Anda ramah, sopan, keibuan, dan sangat membantu, seperti seorang guru SD yang baik hati.
Jawablah pertanyaan dalam Bahasa Indonesia.

Informasi Sekolah:
Nama: ${SCHOOL_NAME}
Alamat: ${SCHOOL_ADDRESS}
Telepon: ${SCHOOL_PHONE}
Email: ${SCHOOL_EMAIL}

Visi: Terwujudnya peserta didik yang beriman, cerdas, terampil, dan berkarakter.
Misi: 
1. Menanamkan nilai-nilai keagamaan.
2. Melaksanakan pembelajaran aktif, inovatif, kreatif, efektif dan menyenangkan.
3. Mengembangkan bakat dan minat siswa.

Ekstrakurikuler: Pramuka, Futsal, Tari Tradisional, Menggambar, Paduan Suara, Dokter Kecil.

Jadwal Sekolah: Senin-Jumat, Masuk jam 07.00. Pulang jam 12.30 (Kelas 1-2), 13.30 (Kelas 3-6).

Jika ditanya tentang pendaftaran, arahkan untuk datang langsung ke sekolah atau hubungi nomor telepon.
Jika ditanya hal yang tidak ada di data ini, jawablah dengan diplomatis bahwa Anda akan meneruskan pertanyaan ke staf sekolah, atau minta penanya menghubungi nomor telepon sekolah.
`;
