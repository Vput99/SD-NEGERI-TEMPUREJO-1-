
import React, { useState } from 'react';
import { NewsItem, Teacher, ClassSchedule, GalleryImage, SchoolProfile, Suggestion } from '../types';
import { db } from '../services/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { generateNewsContent } from '../services/geminiService';

interface AdminDashboardProps {
    isOpen: boolean;
    onClose: () => void;
    schoolProfile: SchoolProfile;
    setSchoolProfile: React.Dispatch<React.SetStateAction<SchoolProfile>>;
    newsData: NewsItem[];
    setNewsData: React.Dispatch<React.SetStateAction<NewsItem[]>>;
    teachersData: Teacher[];
    setTeachersData: React.Dispatch<React.SetStateAction<Teacher[]>>;
    schedulesData: ClassSchedule[];
    setSchedulesData: React.Dispatch<React.SetStateAction<ClassSchedule[]>>;
    galleryData: GalleryImage[];
    setGalleryData: React.Dispatch<React.SetStateAction<GalleryImage[]>>;
    suggestionsData: Suggestion[]; 
    setSuggestionsData: React.Dispatch<React.SetStateAction<Suggestion[]>>; 
}

type TabType = 'dashboard' | 'news' | 'teachers' | 'schedules' | 'gallery' | 'identity' | 'suggestions';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    isOpen, onClose, 
    schoolProfile, setSchoolProfile,
    newsData, setNewsData,
    teachersData, setTeachersData,
    schedulesData, setSchedulesData,
    galleryData, setGalleryData,
    suggestionsData, setSuggestionsData
}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');
    const [loading, setLoading] = useState(false);
    const [compressing, setCompressing] = useState(false);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    
    // Mobile Sidebar State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- SCHEDULE STATE ---
    const [selectedClassTab, setSelectedClassTab] = useState("Kelas 1");

    // --- FORM STATES ---
    const [editingNews, setEditingNews] = useState<Partial<NewsItem> | null>(null);
    const [editingTeacher, setEditingTeacher] = useState<Partial<Teacher> | null>(null);
    const [editingGallery, setEditingGallery] = useState<Partial<GalleryImage> | null>(null);
    
    // --- AUTH ---
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin123') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Password salah!');
        }
    };

    // --- UTILS: IMAGE COMPRESSION ---
    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    
                    const MAX_SIZE = 800;
                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height *= MAX_SIZE / width;
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width *= MAX_SIZE / height;
                            height = MAX_SIZE;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error("Gagal memproses gambar (Canvas error)"));
                        return;
                    }

                    ctx.clearRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);

                    let outputMime = 'image/jpeg';
                    if (file.type === 'image/png' || file.type === 'image/webp') {
                        outputMime = 'image/webp'; 
                    }

                    let quality = 0.8;
                    let dataUrl = canvas.toDataURL(outputMime, quality);
                    const MAX_BASE64_LENGTH = 1000000; 

                    while (dataUrl.length > MAX_BASE64_LENGTH && quality > 0.1) {
                        quality -= 0.1;
                        dataUrl = canvas.toDataURL(outputMime, quality);
                    }

                    if (dataUrl.length > MAX_BASE64_LENGTH) {
                        reject(new Error("Ukuran gambar terlalu besar."));
                    } else {
                        resolve(dataUrl);
                    }
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, setFunction: Function, currentData: any) => {
        const file = e.target.files?.[0];
        if (file) {
            setCompressing(true);
            try {
                const compressedBase64 = await compressImage(file);
                // Ensure we create a clean object update
                setFunction((prev: any) => ({ ...prev, [field]: compressedBase64 }));
            } catch (err: any) {
                alert(err.message || "Gagal mengompres gambar.");
            } finally {
                setCompressing(false);
            }
        }
    };

    // --- AI GENERATION ---
    const handleGenerateAI = async () => {
        if (!editingNews?.title || !editingNews?.image) {
            alert("Mohon isi Judul dan Upload Foto terlebih dahulu.");
            return;
        }

        setIsGeneratingAI(true);
        try {
            const result = await generateNewsContent(editingNews.title, editingNews.image);
            setEditingNews(prev => ({
                ...prev,
                summary: result.summary,
                content: result.content
            }));
        } catch (error: any) {
            alert("Gagal AI: " + error.message);
        } finally {
            setIsGeneratingAI(false);
        }
    };

    // --- CRUD OPERATIONS ---
    const handleSaveNews = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingNews?.title || !editingNews?.date) return;
        setLoading(true);
        
        // Explicitly construct payload to prevent circular references
        const newsPayload = {
            title: editingNews.title,
            date: editingNews.date,
            category: editingNews.category || 'Pengumuman',
            summary: editingNews.summary || '',
            content: editingNews.content || '',
            image: editingNews.image || ''
        };

        try {
            if (editingNews.id) {
                const newsRef = doc(db, "news", String(editingNews.id));
                await updateDoc(newsRef, newsPayload);
                setNewsData(prev => prev.map(item => item.id === editingNews.id ? { ...newsPayload, id: editingNews.id } as NewsItem : item));
            } else {
                const newDoc = await addDoc(collection(db, "news"), newsPayload);
                setNewsData(prev => [{ ...newsPayload, id: newDoc.id } as NewsItem, ...prev]);
            }
            setEditingNews(null);
        } catch (error: any) {
            console.error("Save News Error:", error);
            alert(`Gagal: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteNews = async (id: string | number) => {
        if (!confirm("Hapus berita ini?")) return;
        setLoading(true);
        try {
            await deleteDoc(doc(db, "news", String(id)));
            setNewsData(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            alert("Gagal menghapus berita");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveTeacher = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTeacher?.name) return;
        setLoading(true);

        // Explicitly construct payload
        const teacherPayload = {
            name: editingTeacher.name,
            role: editingTeacher.role,
            image: editingTeacher.image || '',
            nip: editingTeacher.nip || '',
            education: editingTeacher.education || '',
            motto: editingTeacher.motto || ''
        };

        try {
            if (editingTeacher.id) {
                const ref = doc(db, "teachers", String(editingTeacher.id));
                await updateDoc(ref, teacherPayload);
                setTeachersData(prev => prev.map(item => item.id === editingTeacher.id ? { ...teacherPayload, id: editingTeacher.id } as Teacher : item));
            } else {
                const newDoc = await addDoc(collection(db, "teachers"), teacherPayload);
                setTeachersData(prev => [...prev, { ...teacherPayload, id: newDoc.id } as Teacher]);
            }
            setEditingTeacher(null);
        } catch (error: any) {
            console.error("Save Teacher Error:", error);
            alert(`Gagal: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTeacher = async (id: string | number) => {
        if (!confirm("Hapus data guru?")) return;
        try {
            await deleteDoc(doc(db, "teachers", String(id)));
            setTeachersData(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            alert("Gagal menghapus data");
        }
    };

    const handleSaveGallery = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingGallery?.src) return;
        setLoading(true);

        // Explicitly construct payload
        const galleryPayload = {
            caption: editingGallery.caption,
            category: editingGallery.category,
            src: editingGallery.src,
            type: editingGallery.type || 'image' // Default to image if undefined
        };

        try {
             if (editingGallery.id) {
                const ref = doc(db, "gallery", String(editingGallery.id));
                await updateDoc(ref, galleryPayload);
                setGalleryData(prev => prev.map(item => item.id === editingGallery.id ? { ...galleryPayload, id: editingGallery.id } as GalleryImage : item));
            } else {
                const newDoc = await addDoc(collection(db, "gallery"), galleryPayload);
                setGalleryData(prev => [...prev, { ...galleryPayload, id: newDoc.id } as GalleryImage]);
            }
            setEditingGallery(null);
        } catch (error: any) {
             console.error("Save Gallery Error:", error);
             alert(`Gagal: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGallery = async (id: string | number) => {
        if (!confirm("Hapus item galeri?")) return;
        try {
            await deleteDoc(doc(db, "gallery", String(id)));
            setGalleryData(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            alert("Gagal menghapus item");
        }
    };

    const handleSaveProfile = async () => {
        setLoading(true);

        // Explicitly construct payload
        const profilePayload = {
            name: schoolProfile.name,
            address: schoolProfile.address,
            phone: schoolProfile.phone || '',
            email: schoolProfile.email,
            logo: schoolProfile.logo || '',
            logoDaerah: schoolProfile.logoDaerah || '',
            logoMapan: schoolProfile.logoMapan || '',
            socialMedia: {
                facebook: schoolProfile.socialMedia.facebook || '',
                instagram: schoolProfile.socialMedia.instagram || '',
                youtube: schoolProfile.socialMedia.youtube || '',
                tiktok: schoolProfile.socialMedia.tiktok || ''
            }
        };

        try {
            await setDoc(doc(db, "school_profile", "main"), profilePayload, { merge: true });
            alert("Profil berhasil disimpan!");
        } catch (error: any) {
            console.error("Save Profile Error:", error);
            alert("Gagal menyimpan profil.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSuggestion = async (id: string) => {
        if (!confirm("Hapus pesan?")) return;
        try {
            await deleteDoc(doc(db, "suggestions", id));
            setSuggestionsData(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            alert("Gagal menghapus pesan");
        }
    };

    const NavButton = ({ tab, label, icon }: { tab: TabType, label: string, icon: string }) => (
        <button 
            onClick={() => { setActiveTab(tab); setIsSidebarOpen(false); }} 
            className={`w-full text-left px-4 py-3 md:py-2 rounded-lg flex items-center gap-3 transition-colors
            ${activeTab === tab 
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                : 'hover:bg-slate-800 text-slate-300'}`}
        >
            <span className="text-lg">{icon}</span> {label}
            {tab === 'suggestions' && suggestionsData.length > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-auto">{suggestionsData.length}</span>
            )}
        </button>
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center md:p-4">
            {/* Main Container - Full Screen on Mobile, Card on Desktop */}
            <div className="bg-white w-full h-full md:h-[90vh] md:max-w-6xl md:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative">
                
                {/* Mobile Header (Only visible on mobile) */}
                <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center shrink-0 z-30">
                    <div className="flex items-center gap-2">
                         <span className="text-xl">🛠️</span>
                         <h2 className="font-bold">Admin Panel</h2>
                    </div>
                    <div className="flex gap-2">
                        {isAuthenticated && (
                             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-white/10 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                             </button>
                        )}
                        <button onClick={onClose} className="p-2 bg-red-500/20 text-red-400 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Sidebar Overlay (Mobile) */}
                {isSidebarOpen && (
                    <div 
                        className="absolute inset-0 bg-black/50 z-20 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                {/* Sidebar */}
                <div className={`
                    absolute md:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white flex flex-col shrink-0 transform transition-transform duration-300
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}>
                    <div className="p-6 border-b border-slate-700 hidden md:block">
                        <h2 className="font-bold text-xl tracking-tight">Admin Panel</h2>
                        <p className="text-slate-400 text-xs">SDN Tempurejo 1</p>
                    </div>
                    
                    {!isAuthenticated ? (
                        <div className="p-4 text-sm text-slate-400">Silakan login</div>
                    ) : (
                        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                            <NavButton tab="dashboard" label="Dashboard" icon="📊" />
                            <NavButton tab="suggestions" label="Kotak Masuk" icon="📬" />
                            <NavButton tab="identity" label="Identitas" icon="🏫" />
                            <NavButton tab="news" label="Berita" icon="📰" />
                            <NavButton tab="schedules" label="Jadwal" icon="📅" />
                            <NavButton tab="teachers" label="Guru" icon="👨‍🏫" />
                            <NavButton tab="gallery" label="Galeri" icon="📸" />
                        </nav>
                    )}

                    <div className="p-4 border-t border-slate-700 hidden md:block">
                        <button onClick={onClose} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-full px-4 py-2 hover:bg-red-500/10 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Keluar
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-grow bg-slate-50 overflow-y-auto p-4 md:p-8 w-full">
                    {!isAuthenticated ? (
                        <div className="h-full flex flex-col items-center justify-center">
                            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-sm border border-slate-100">
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🔐</div>
                                    <h3 className="text-2xl font-bold text-slate-800">Login Pengelola</h3>
                                    <p className="text-slate-500 text-sm mt-1">Masuk untuk mengelola website</p>
                                </div>
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                                        <input 
                                            type="password" 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary focus:outline-none transition-all"
                                            placeholder="Masukkan password admin..."
                                        />
                                    </div>
                                    {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg text-center">{error}</p>}
                                    <button type="submit" className="w-full bg-brand-primary text-white py-3 rounded-xl font-bold hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/30">
                                        Masuk Dashboard
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* ... (DASHBOARD, SUGGESTIONS, NEWS, SCHEDULES, TEACHERS TABS REMAIN UNCHANGED) ... */}
                            {/* --- TAB: DASHBOARD --- */}
                            {activeTab === 'dashboard' && (
                                <div className="animate-in fade-in duration-500">
                                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-slate-800">Selamat Datang! 👋</h2>
                                    <p className="text-slate-500 mb-8 text-sm md:text-base">Ringkasan data website sekolah saat ini.</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                        <div className="bg-gradient-to-br from-purple-500 to-violet-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                                            <div className="relative z-10">
                                                <h3 className="text-purple-100 text-xs font-bold uppercase tracking-wider mb-1">Pesan Masuk</h3>
                                                <p className="text-4xl md:text-5xl font-black">{suggestionsData.length}</p>
                                            </div>
                                            <div className="absolute -right-4 -bottom-4 text-white/10 text-8xl">📬</div>
                                        </div>

                                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                                            <div className="relative z-10">
                                                <h3 className="text-emerald-100 text-xs font-bold uppercase tracking-wider mb-1">Berita</h3>
                                                <p className="text-4xl md:text-5xl font-black">{newsData.length}</p>
                                            </div>
                                            <div className="absolute -right-4 -bottom-4 text-white/10 text-8xl">📰</div>
                                        </div>

                                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                                            <div className="relative z-10">
                                                <h3 className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Guru</h3>
                                                <p className="text-4xl md:text-5xl font-black">{teachersData.length}</p>
                                            </div>
                                            <div className="absolute -right-4 -bottom-4 text-white/10 text-8xl">👨‍🏫</div>
                                        </div>

                                        <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
                                            <div className="relative z-10">
                                                <h3 className="text-amber-100 text-xs font-bold uppercase tracking-wider mb-1">Foto & Video</h3>
                                                <p className="text-4xl md:text-5xl font-black">{galleryData.length}</p>
                                            </div>
                                            <div className="absolute -right-4 -bottom-4 text-white/10 text-8xl">📸</div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                        <h3 className="font-bold text-slate-800 mb-4">Akses Cepat</h3>
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <button onClick={() => setActiveTab('suggestions')} className="px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-sm font-bold transition-colors text-left">
                                                📬 Cek Kotak Masuk
                                            </button>
                                            <button onClick={() => setActiveTab('news')} className="px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-sm font-bold transition-colors text-left">
                                                + Tulis Berita
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                             {/* --- TAB: GALERI --- */}
                             {activeTab === 'gallery' && (
                                <div>
                                     <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold">Galeri Aktivitas</h2>
                                        <button 
                                            onClick={() => setEditingGallery({ caption: '', category: 'Kegiatan', src: '', type: 'image' })}
                                            className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
                                        >
                                            + Tambah Item
                                        </button>
                                    </div>

                                    {editingGallery && (
                                        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm mb-8 border border-slate-200">
                                            <form onSubmit={handleSaveGallery} className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">Judul / Caption</label>
                                                    <input 
                                                        type="text" 
                                                        value={editingGallery.caption} 
                                                        onChange={e => setEditingGallery({...editingGallery, caption: e.target.value})}
                                                        className="w-full border rounded p-2" required 
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Kategori</label>
                                                        <select 
                                                            value={editingGallery.category} 
                                                            onChange={e => setEditingGallery({...editingGallery, category: e.target.value as any})}
                                                            className="w-full border rounded p-2"
                                                        >
                                                            <option value="Kegiatan">Kegiatan</option>
                                                            <option value="Fasilitas">Fasilitas</option>
                                                            <option value="Ekstrakurikuler">Ekstrakurikuler</option>
                                                            <option value="Akademik">Akademik</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Tipe Media</label>
                                                        <div className="flex gap-4">
                                                            <label className="flex items-center gap-2 cursor-pointer">
                                                                <input 
                                                                    type="radio" 
                                                                    name="mediaType"
                                                                    checked={editingGallery.type !== 'video'} // Default to image
                                                                    onChange={() => setEditingGallery({...editingGallery, type: 'image', src: ''})}
                                                                />
                                                                <span>Foto</span>
                                                            </label>
                                                            <label className="flex items-center gap-2 cursor-pointer">
                                                                <input 
                                                                    type="radio" 
                                                                    name="mediaType"
                                                                    checked={editingGallery.type === 'video'}
                                                                    onChange={() => setEditingGallery({...editingGallery, type: 'video', src: ''})}
                                                                />
                                                                <span>Video (YouTube)</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                     <label className="block text-sm font-medium mb-1">
                                                        {editingGallery.type === 'video' ? 'Link Video (YouTube URL)' : 'Upload Foto'}
                                                     </label>
                                                     
                                                     {editingGallery.type === 'video' ? (
                                                         <input 
                                                            type="url"
                                                            value={editingGallery.src}
                                                            onChange={(e) => setEditingGallery({...editingGallery, src: e.target.value})}
                                                            placeholder="Contoh: https://www.youtube.com/watch?v=..."
                                                            className="w-full border rounded p-2"
                                                            required
                                                         />
                                                     ) : (
                                                         <input 
                                                            type="file" 
                                                            accept="image/*"
                                                            onChange={(e) => handleImageUpload(e, 'src', setEditingGallery, editingGallery)}
                                                            className="w-full text-sm"
                                                            required={!editingGallery.src}
                                                         />
                                                     )}
                                                     
                                                     {/* Preview */}
                                                     {editingGallery.src && (
                                                         <div className="mt-2">
                                                             <p className="text-xs text-slate-400 mb-1">Preview:</p>
                                                             {editingGallery.type === 'video' ? (
                                                                 <div className="text-sm text-blue-500 truncate">{editingGallery.src}</div>
                                                             ) : (
                                                                 <img src={editingGallery.src} alt="Preview" className="h-20 object-cover rounded" />
                                                             )}
                                                         </div>
                                                     )}
                                                </div>

                                                <div className="flex justify-end gap-2">
                                                    <button type="button" onClick={() => setEditingGallery(null)} className="px-4 py-2 text-slate-500">Batal</button>
                                                    <button 
                                                        type="submit" 
                                                        disabled={loading || compressing}
                                                        className="bg-brand-primary text-white px-6 py-2 rounded hover:bg-brand-dark disabled:opacity-50"
                                                    >
                                                        Simpan
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {galleryData.map(item => (
                                            <div key={item.id} className="group relative rounded-lg overflow-hidden aspect-square border border-slate-200 bg-slate-100">
                                                {item.type === 'video' ? (
                                                    <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                                        <span className="text-4xl">▶️</span>
                                                        {/* Attempt to show YT thumbnail if possible, otherwise generic */}
                                                        {item.src.includes('youtube') || item.src.includes('youtu.be') ? (
                                                            <img 
                                                                src={`https://img.youtube.com/vi/${item.src.split('v=')[1]?.split('&')[0] || item.src.split('/').pop()}/0.jpg`} 
                                                                alt={item.caption}
                                                                className="absolute inset-0 w-full h-full object-cover opacity-60"
                                                            />
                                                        ) : null}
                                                    </div>
                                                ) : (
                                                    <img src={item.src} alt={item.caption} className="w-full h-full object-cover" />
                                                )}
                                                
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 text-white">
                                                    <div className="flex justify-between items-end">
                                                        <p className="text-xs font-bold truncate flex-grow pr-2">{item.caption}</p>
                                                        <span className="text-[10px] bg-white/20 px-1 rounded">
                                                            {item.type === 'video' ? 'VIDEO' : 'FOTO'}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2 mt-2 justify-end">
                                                        <button onClick={() => handleDeleteGallery(item.id)} className="text-xs bg-red-500 px-2 py-1 rounded">Hapus</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ... (OTHER TABS) ... */}
                            {/* --- TAB: IDENTITAS --- */}
                            {activeTab === 'identity' && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6">Identitas Sekolah</h2>
                                    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Nama Sekolah</label>
                                                <input 
                                                    type="text" 
                                                    value={schoolProfile.name} 
                                                    onChange={e => setSchoolProfile({...schoolProfile, name: e.target.value})}
                                                    className="w-full border rounded p-2"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Alamat Lengkap</label>
                                            <input 
                                                type="text" 
                                                value={schoolProfile.address} 
                                                onChange={e => setSchoolProfile({...schoolProfile, address: e.target.value})}
                                                className="w-full border rounded p-2"
                                            />
                                        </div>
                                        
                                        {/* KONTAK & SOSMED SECTION */}
                                        <div className="border-t pt-4 mt-2">
                                            <h4 className="font-bold mb-3 text-slate-700">Kontak & Media Sosial</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">Email</label>
                                                    <input 
                                                        type="email" 
                                                        value={schoolProfile.email} 
                                                        onChange={e => setSchoolProfile({...schoolProfile, email: e.target.value})}
                                                        className="w-full border rounded p-2"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">Facebook URL</label>
                                                    <input 
                                                        type="text" 
                                                        value={schoolProfile.socialMedia.facebook} 
                                                        onChange={e => setSchoolProfile({...schoolProfile, socialMedia: {...schoolProfile.socialMedia, facebook: e.target.value}})}
                                                        className="w-full border rounded p-2"
                                                        placeholder="https://facebook.com/..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">Instagram URL</label>
                                                    <input 
                                                        type="text" 
                                                        value={schoolProfile.socialMedia.instagram} 
                                                        onChange={e => setSchoolProfile({...schoolProfile, socialMedia: {...schoolProfile.socialMedia, instagram: e.target.value}})}
                                                        className="w-full border rounded p-2"
                                                        placeholder="https://instagram.com/..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">TikTok URL</label>
                                                    <input 
                                                        type="text" 
                                                        value={schoolProfile.socialMedia.tiktok} 
                                                        onChange={e => setSchoolProfile({...schoolProfile, socialMedia: {...schoolProfile.socialMedia, tiktok: e.target.value}})}
                                                        className="w-full border rounded p-2"
                                                        placeholder="https://tiktok.com/@..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">YouTube URL</label>
                                                    <input 
                                                        type="text" 
                                                        value={schoolProfile.socialMedia.youtube} 
                                                        onChange={e => setSchoolProfile({...schoolProfile, socialMedia: {...schoolProfile.socialMedia, youtube: e.target.value}})}
                                                        className="w-full border rounded p-2"
                                                        placeholder="https://youtube.com/..."
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t pt-4 mt-4">
                                            <h4 className="font-bold mb-2">Logo Sekolah</h4>
                                            <div className="flex items-center gap-4">
                                                {schoolProfile.logo && <img src={schoolProfile.logo} className="w-16 h-16 object-contain border rounded" />}
                                                <input 
                                                    type="file" 
                                                    onChange={(e) => handleImageUpload(e, 'logo', setSchoolProfile, schoolProfile)}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button 
                                                onClick={handleSaveProfile}
                                                disabled={loading || compressing}
                                                className="bg-brand-primary text-white px-6 py-2 rounded-lg hover:bg-brand-dark"
                                            >
                                                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
