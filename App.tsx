
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProfileSection from './components/ProfileSection';
import NewsSection from './components/NewsSection';
import ScheduleSection from './components/ScheduleSection';
import ExamSection from './components/ExamSection'; 
import ExamDetailPage from './components/ExamDetailPage'; 
import GallerySection from './components/GallerySection';
import PPDBSection from './components/PPDBSection';
import SuggestionSection from './components/SuggestionSection'; 
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import AdminDashboard from './components/AdminDashboard';
import AllTeachersPage from './components/AllTeachersPage';
import NewsDetailPage from './components/NewsDetailPage'; 
import { NEWS, TEACHERS, CLASS_SCHEDULES, GALLERY, SCHOOL_NAME, SCHOOL_ADDRESS, SCHOOL_EMAIL, SCHOOL_PHONE } from './constants';
import { NewsItem, Teacher, ClassSchedule, GalleryImage, SchoolProfile, Suggestion } from './types';
import { db } from './services/firebase';
import { collection, getDocs, addDoc, doc, setDoc, updateDoc, getDoc, deleteDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Navigation State
  const [showAllTeachers, setShowAllTeachers] = useState(false);
  const [activeNewsItem, setActiveNewsItem] = useState<NewsItem | null>(null);
  const [showExamDetail, setShowExamDetail] = useState(false); 

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
      youtube: "https://youtube.com",
      tiktok: "https://tiktok.com"
    }
  });

  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [teachersData, setTeachersData] = useState<Teacher[]>([]);
  const [schedulesData, setSchedulesData] = useState<ClassSchedule[]>([]);
  const [galleryData, setGalleryData] = useState<GalleryImage[]>([]);
  const [suggestionsData, setSuggestionsData] = useState<Suggestion[]>([]); 

  // --- 1. FETCH INITIAL DATA (One time load) ---
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // A. Profile
        const mainDocRef = doc(db, "school_profile", "main");
        const mainDocSnap = await getDoc(mainDocRef);

        if (mainDocSnap.exists()) {
            const data = mainDocSnap.data();
            setSchoolProfile(prev => ({
                ...prev,
                ...data,
                socialMedia: { ...prev.socialMedia, ...(data.socialMedia || {}) }
            }));
        } else {
            // Fallback & Migration Logic
            const profileSnap = await getDocs(collection(db, "school_profile"));
            if (!profileSnap.empty) {
                const legacyDoc = profileSnap.docs[0];
                const data = legacyDoc.data();
                setSchoolProfile(prev => ({ ...prev, ...data, socialMedia: { ...prev.socialMedia, ...(data.socialMedia || {}) } }));
                await setDoc(doc(db, "school_profile", "main"), data);
                await deleteDoc(legacyDoc.ref);
            } else {
                await setDoc(doc(db, "school_profile", "main"), schoolProfile);
            }
        }

        // B. News
        const newsSnap = await getDocs(collection(db, "news"));
        if (!newsSnap.empty) {
            const fetchedNews = newsSnap.docs.map(d => ({ ...d.data(), id: d.id } as any));
            setNewsData(fetchedNews);
        } else {
            for (const item of NEWS) {
                const { id, ...data } = item; 
                await addDoc(collection(db, "news"), data);
            }
            const newSnap = await getDocs(collection(db, "news"));
            setNewsData(newSnap.docs.map(d => ({ ...d.data(), id: d.id } as any)));
        }

        // C. Teachers
        const teachersSnap = await getDocs(collection(db, "teachers"));
        if (!teachersSnap.empty) {
            let fetchedTeachers = teachersSnap.docs.map(d => ({ ...d.data(), id: d.id } as any));
            
            // Cleanup Logic for Siti Aminah (if still exists)
            const sitiAminah = fetchedTeachers.find((t: any) => t.name === "Siti Aminah, S.Pd");
            if (sitiAminah) {
                await deleteDoc(doc(db, "teachers", sitiAminah.id));
                fetchedTeachers = fetchedTeachers.filter((t: any) => t.id !== sitiAminah.id);
            }

            fetchedTeachers.sort((a, b) => {
                if (a.role === "Kepala Sekolah") return -1;
                if (b.role === "Kepala Sekolah") return 1;
                return 0;
            });
            setTeachersData(fetchedTeachers);
        } else {
            for (const item of TEACHERS) {
                const { id, ...data } = item;
                await addDoc(collection(db, "teachers"), data);
            }
             const newSnap = await getDocs(collection(db, "teachers"));
             setTeachersData(newSnap.docs.map(d => ({ ...d.data(), id: d.id } as any)));
        }

        // D. Gallery
        const gallerySnap = await getDocs(collection(db, "gallery"));
        if (!gallerySnap.empty) {
            const fetchedGallery = gallerySnap.docs.map(d => ({ ...d.data(), id: d.id } as any));
            setGalleryData(fetchedGallery);
        } else {
            for (const item of GALLERY) {
                const { id, ...data } = item;
                await addDoc(collection(db, "gallery"), data);
            }
            const newSnap = await getDocs(collection(db, "gallery"));
            setGalleryData(newSnap.docs.map(d => ({ ...d.data(), id: d.id } as any)));
        }

        // E. Schedules
        const scheduleSnap = await getDocs(collection(db, "schedules"));
        if (!scheduleSnap.empty) {
            const fetchedSchedules = scheduleSnap.docs.map(d => d.data() as ClassSchedule);
            setSchedulesData(fetchedSchedules);
        } else {
            for (const item of CLASS_SCHEDULES) {
                await setDoc(doc(db, "schedules", item.className), item);
            }
            setSchedulesData(CLASS_SCHEDULES);
        }

      } catch (error) {
        console.error("Error connecting to Firebase:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // --- 2. REAL-TIME LISTENER FOR SUGGESTIONS ---
  // Ini agar pesan baru langsung muncul di Admin tanpa refresh halaman
  useEffect(() => {
    const q = query(collection(db, "suggestions"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedSuggestions = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as any));
      setSuggestionsData(fetchedSuggestions);
    }, (error) => {
      console.error("Real-time suggestions error:", error);
    });

    return () => unsubscribe();
  }, []);


  const resetView = () => {
    setShowAllTeachers(false);
    setActiveNewsItem(null);
    setShowExamDetail(false);
  };

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

  // Determine what to render based on state priority
  let content;
  if (activeNewsItem) {
    content = <NewsDetailPage news={activeNewsItem} onBack={() => { setActiveNewsItem(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />;
  } else if (showAllTeachers) {
    content = <AllTeachersPage teachers={teachersData} onBack={() => { setShowAllTeachers(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />;
  } else if (showExamDetail) {
    content = <ExamDetailPage onBack={() => { setShowExamDetail(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />;
  } else {
    content = (
      <>
        <Hero schoolProfile={schoolProfile} />
        <ProfileSection 
            teachers={teachersData} 
            schoolName={schoolProfile.name} 
            onSeeAllClick={() => { setShowAllTeachers(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        />
        <NewsSection 
            newsItems={newsData} 
            onNewsClick={(news) => setActiveNewsItem(news)}
        />
        <ScheduleSection schedules={schedulesData} />
        <ExamSection onOpenDetail={() => { setShowExamDetail(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        <GallerySection galleryItems={galleryData} />
        <PPDBSection />
        {/* ADD SUGGESTION SECTION BEFORE FOOTER */}
        <SuggestionSection schoolProfile={schoolProfile} />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-body">
      <Header 
        schoolProfile={schoolProfile} 
        onResetView={resetView} 
      />
      
      <main className="flex-grow">
        {content}
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
          suggestionsData={suggestionsData} 
          setSuggestionsData={setSuggestionsData}
        />
      )}
    </div>
  );
}

export default App;
