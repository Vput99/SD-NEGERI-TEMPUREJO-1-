
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProfileSection from './components/ProfileSection';
import NewsSection from './components/NewsSection';
import ScheduleSection from './components/ScheduleSection';
import ExamSection from './components/ExamSection'; 
import ExamDetailPage from './components/ExamDetailPage'; // Import New Detail Page
import GallerySection from './components/GallerySection';
import PPDBSection from './components/PPDBSection';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import AdminDashboard from './components/AdminDashboard';
import AllTeachersPage from './components/AllTeachersPage';
import NewsDetailPage from './components/NewsDetailPage'; 
import { NEWS, TEACHERS, CLASS_SCHEDULES, GALLERY, SCHOOL_NAME, SCHOOL_ADDRESS, SCHOOL_EMAIL, SCHOOL_PHONE } from './constants';
import { NewsItem, Teacher, ClassSchedule, GalleryImage, SchoolProfile } from './types';
import { db } from './services/firebase';
// Added getDoc and deleteDoc for standardized profile handling
import { collection, getDocs, addDoc, doc, setDoc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';

function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Navigation State
  const [showAllTeachers, setShowAllTeachers] = useState(false);
  const [activeNewsItem, setActiveNewsItem] = useState<NewsItem | null>(null);
  const [showExamDetail, setShowExamDetail] = useState(false); // New State for Exam Detail

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

  // FETCH DATA FROM FIREBASE
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. Check & Fetch Profile (STANDARDIZED TO ID: 'main')
        const mainDocRef = doc(db, "school_profile", "main");
        const mainDocSnap = await getDoc(mainDocRef);

        if (mainDocSnap.exists()) {
            // Jika dokumen 'main' sudah ada (hasil save dari Admin), gunakan ini.
            const data = mainDocSnap.data();
            setSchoolProfile(prev => ({
                ...prev,
                ...data,
                // Merge nested socialMedia object to prevent overwrite if keys are missing in DB
                socialMedia: {
                    ...prev.socialMedia,
                    ...(data.socialMedia || {})
                }
            }));
        } else {
            // FALLBACK: Cek apakah ada dokumen lama dengan ID acak (Legacy data)
            const profileSnap = await getDocs(collection(db, "school_profile"));
            
            if (!profileSnap.empty) {
                const legacyDoc = profileSnap.docs[0]; // Ambil yang pertama
                const data = legacyDoc.data();
                
                // Update state
                setSchoolProfile(prev => ({
                    ...prev,
                    ...data,
                    socialMedia: {
                        ...prev.socialMedia,
                        ...(data.socialMedia || {})
                    }
                }));

                // MIGRASI OTOMATIS:
                // Simpan data ini ke 'main' agar sinkron dengan Admin Panel
                await setDoc(doc(db, "school_profile", "main"), data);
                // Hapus data lama yang ID-nya acak agar tidak bingung kedepannya
                await deleteDoc(legacyDoc.ref);
                console.log("Database Profil berhasil dimigrasi ke standar baru.");
            } else {
                // Jika belum ada data sama sekali, buat baru dengan ID 'main'
                await setDoc(doc(db, "school_profile", "main"), schoolProfile);
            }
        }

        // 2. Check & Fetch News
        const newsSnap = await getDocs(collection(db, "news"));
        if (!newsSnap.empty) {
            const fetchedNews = newsSnap.docs.map(d => ({ ...d.data(), id: d.id } as any));
            
            // SYNC FIX FOR NEWS (PPDB YEAR)
            const ppdbNews = fetchedNews.find((n: any) => n.title.includes("Penerimaan Siswa Baru"));
            const targetPPDB = NEWS.find(n => n.title.includes("Penerimaan Siswa Baru"));

            if (ppdbNews && targetPPDB && ppdbNews.title !== targetPPDB.title) {
                 console.log("Syncing PPDB News year to 2025/2026...");
                 await updateDoc(doc(db, "news", ppdbNews.id), {
                     title: targetPPDB.title,
                     date: targetPPDB.date,
                     content: targetPPDB.content
                 });
                 ppdbNews.title = targetPPDB.title;
                 ppdbNews.date = targetPPDB.date;
                 ppdbNews.content = targetPPDB.content;
            }

            setNewsData(fetchedNews);
        } else {
            for (const item of NEWS) {
                const { id, ...data } = item; 
                await addDoc(collection(db, "news"), data);
            }
            const newSnap = await getDocs(collection(db, "news"));
            setNewsData(newSnap.docs.map(d => ({ ...d.data(), id: d.id } as any)));
        }

        // 3. Check & Fetch Teachers
        const teachersSnap = await getDocs(collection(db, "teachers"));
        if (!teachersSnap.empty) {
            let fetchedTeachers = teachersSnap.docs.map(d => ({ ...d.data(), id: d.id } as any));
            
            // SYNC FIX: Ensure DB data matches constants for critical fields
            for (const tConstant of TEACHERS) {
                const tDB = fetchedTeachers.find((t: any) => t.role === tConstant.role);
                
                if (tDB) {
                    const nameChanged = tDB.name !== tConstant.name;
                    const imageChanged = tDB.image !== tConstant.image;

                    if (nameChanged || imageChanged) {
                         console.log(`Syncing teacher data for ${tConstant.role}...`);
                         await updateDoc(doc(db, "teachers", tDB.id), {
                             name: tConstant.name,
                             image: tConstant.image
                         });
                         tDB.name = tConstant.name;
                         tDB.image = tConstant.image;
                    }
                }
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

        // 4. Check & Fetch Gallery
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

        // 5. Check & Fetch Schedules
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
        />
      )}
    </div>
  );
}

export default App;
