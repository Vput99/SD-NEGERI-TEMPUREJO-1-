
export interface NavItem {
  label: string;
  href: string;
}

export interface Teacher {
  id: string | number;
  name: string;
  role: string;
  image: string;
}

export interface NewsItem {
  id: string | number;
  title: string;
  date: string;
  category: string;
  summary: string;
  image: string;
}

export interface ScheduleItem {
  time: string;
  subject: string;
}

export interface ClassSchedule {
  className: string; // e.g., "Kelas 1", "Kelas 2"
  days: {
    dayName: string; // "Senin", "Selasa"
    schedule: ScheduleItem[];
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface GalleryImage {
  id: string | number;
  src: string;
  caption: string;
  category: 'Ekstrakurikuler' | 'Akademik' | 'Fasilitas';
}

export interface SchoolProfile {
  name: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  logoDaerah?: string;
  logoMapan?: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    youtube: string;
  };
}
