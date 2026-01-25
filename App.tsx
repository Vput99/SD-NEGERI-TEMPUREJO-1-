import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProfileSection from './components/ProfileSection';
import NewsSection from './components/NewsSection';
import ScheduleSection from './components/ScheduleSection';
import GallerySection from './components/GallerySection';
import PPDBSection from './components/PPDBSection';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import AdminDashboard from './components/AdminDashboard';
import { NEWS, TEACHERS, CLASS_SCHEDULES, GALLERY, SCHOOL_NAME, SCHOOL_ADDRESS, SCHOOL_EMAIL, SCHOOL_PHONE } from './constants';
import { NewsItem, Teacher, ClassSchedule, GalleryImage, SchoolProfile } from './types';

function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // Database States (Lifted Up)
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>({
    name: SCHOOL_NAME,
    address: SCHOOL_ADDRESS,
    phone: SCHOOL_PHONE,
    email: SCHOOL_EMAIL,
    logo: "",
    logoDaerah: "",
    logoMapan: "",
    socialMedia: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      youtube: "https://youtube.com"
    }
  });

  const [newsData, setNewsData] = useState<NewsItem[]>(NEWS);
  const [teachersData, setTeachersData] = useState<Teacher[]>(TEACHERS);
  const [schedulesData, setSchedulesData] = useState<ClassSchedule[]>(CLASS_SCHEDULES);
  const [galleryData, setGalleryData] = useState<GalleryImage[]>(GALLERY);

  return (
    <div className="min-h-screen flex flex-col font-body">
      <Header schoolProfile={schoolProfile} />
      <main className="flex-grow">
        <Hero schoolProfile={schoolProfile} />
        {/* Pass dynamic teachers data */}
        <ProfileSection teachers={teachersData} schoolName={schoolProfile.name} />
        
        {/* Pass dynamic news data */}
        <NewsSection newsItems={newsData} />
        
        {/* Pass dynamic schedule data */}
        <ScheduleSection schedules={schedulesData} />
        
        {/* Pass dynamic gallery data */}
        <GallerySection galleryItems={galleryData} />

        {/* PPDB Coming Soon Section */}
        <PPDBSection />
      </main>
      
      <Footer schoolProfile={schoolProfile} onOpenAdmin={() => setIsAdminOpen(true)} />
      
      <AIAssistant />

      {/* Admin Dashboard with full database access */}
      {isAdminOpen && (
        <AdminDashboard 
          isOpen={isAdminOpen} 
          onClose={() => setIsAdminOpen(false)}
          // School Profile Props
          schoolProfile={schoolProfile}
          setSchoolProfile={setSchoolProfile}
          // News Props
          newsData={newsData}
          setNewsData={setNewsData}
          // Teachers Props
          teachersData={teachersData}
          setTeachersData={setTeachersData}
          // Schedules Props
          schedulesData={schedulesData}
          setSchedulesData={setSchedulesData}
          // Gallery Props
          galleryData={galleryData}
          setGalleryData={setGalleryData}
        />
      )}
    </div>
  );
}

export default App;