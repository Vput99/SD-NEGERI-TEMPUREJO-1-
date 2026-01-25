
import React, { useState, useEffect } from 'react';
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
import { db } from './services/firebase';
import { collection, getDocs, addDoc, doc, setDoc } from 'firebase/firestore';

function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Database States
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

  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [teachersData, setTeachersData] = useState<Teacher[]>([]);
  const [schedulesData, setSchedulesData] = useState<ClassSchedule[]>([]);
  const [galleryData, setGalleryData] = useState<GalleryImage[]>([]);

  // FETCH DATA FROM FIREBASE
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. Check & Fetch Profile
        const profileSnap = await getDocs(collection(db, "school_profile"));
        if (!profileSnap.empty) {
            // Use the first document found
            setSchoolProfile(profileSnap.docs[0].data() as SchoolProfile);
        } else {
            // Seed Profile if empty
            await addDoc(collection(db, "school_profile"), schoolProfile);
        }

        // 2. Check & Fetch News
        const newsSnap = await getDocs(collection(db, "news"));
        if (!newsSnap.empty) {
            const fetchedNews = newsSnap.docs.map(d => ({ ...d.data(), id: d.id } as any));
            setNewsData(fetchedNews);
        } else {
            // Seed News
            for (const item of NEWS) {
                // Remove numeric ID, let Firestore generate string ID
                const { id, ...data } = item; 
                await addDoc(collection(db, "news"), data);
            }
            // Fetch again after seed
            const newSnap = await getDocs(collection(db, "news"));
            setNewsData(newSnap.docs.map(d => ({ ...d.data(), id: d.id } as any)));
        }

        // 3. Check & Fetch Teachers
        const teachersSnap = await getDocs(collection(db, "teachers"));
        if (!teachersSnap.empty) {
            const fetchedTeachers = teachersSnap.docs.map(d => ({ ...d.data(), id: d.id } as any));
            setTeachersData(fetchedTeachers);
        } else {
            // Seed Teachers
            for (const item of TEACHERS) {
                const { id, ...data } = item;
                await addDoc(collection(db, "teachers"), data);
            }
             const newSnap = await getDocs(collection(db, "teachers"));
             setTeachersData(newSnap.docs.map(d => ({ ...d.data(), id: d.id } as any)));
        }

        // 4. Check & Fetch Gallery
        const gallerySnap = await getDocs(collection(db, "gallery"));
        if (!gallerySnap.empty) {
            const fetchedGallery = gallerySnap.docs.map(d => ({ ...d.data(), id: d.id } as any));
            setGalleryData(fetchedGallery);
        } else {
            // Seed Gallery
            for (const item of GALLERY) {
                const { id, ...data } = item;
                await addDoc(collection(db, "gallery"), data);
            }
            const newSnap = await getDocs(collection(db, "gallery"));
            setGalleryData(newSnap.docs.map(d => ({ ...d.data(), id: d.id } as any)));
        }

        // 5. Check & Fetch Schedules
        // Note: Schedule structure is complex. We store each Class as a document.
        const scheduleSnap = await getDocs(collection(db, "schedules"));
        if (!scheduleSnap.empty) {
            const fetchedSchedules = scheduleSnap.docs.map(d => d.data() as ClassSchedule);
            setSchedulesData(fetchedSchedules);
        } else {
            // Seed Schedules
            for (const item of CLASS_SCHEDULES) {
                // Use className as custom ID to ensure uniqueness easier
                await setDoc(doc(db, "schedules", item.className), item);
            }
            setSchedulesData(CLASS_SCHEDULES);
        }

      } catch (error) {
        console.error("Error connecting to Firebase:", error);
        alert("Gagal terhubung ke database. Pastikan config firebase.ts sudah benar.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-brand-light">
            <div className="flex flex-col items-center">
                <span className="text-4xl animate-bounce mb-4">🏫</span>
                <p className="font-bold text-brand-primary">Memuat Data Sekolah...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-body">
      <Header schoolProfile={schoolProfile} />
      <main className="flex-grow">
        <Hero schoolProfile={schoolProfile} />
        <ProfileSection teachers={teachersData} schoolName={schoolProfile.name} />
        <NewsSection newsItems={newsData} />
        <ScheduleSection schedules={schedulesData} />
        <GallerySection galleryItems={galleryData} />
        <PPDBSection />
      </main>
      
      <Footer schoolProfile={schoolProfile} onOpenAdmin={() => setIsAdminOpen(true)} />
      
      <AIAssistant />

      {isAdminOpen && (
        <AdminDashboard 
          isOpen={isAdminOpen} 
          onClose={() => setIsAdminOpen(false)}
          schoolProfile={schoolProfile}
          setSchoolProfile={setSchoolProfile}
          newsData={newsData}
          setNewsData={setNewsData}
          teachersData={teachersData}
          setTeachersData={setTeachersData}
          schedulesData={schedulesData}
          setSchedulesData={setSchedulesData}
          galleryData={galleryData}
          setGalleryData={setGalleryData}
        />
      )}
    </div>
  );
}

export default App;
