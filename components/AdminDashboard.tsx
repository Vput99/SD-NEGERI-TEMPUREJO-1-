
import React, { useState } from 'react';
import { NewsItem, Teacher, ClassSchedule, GalleryImage, ScheduleItem, SchoolProfile } from '../types';
import { db } from '../services/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, setDoc, getDocs } from 'firebase/firestore';

interface AdminDashboardProps {
    isOpen: boolean;
    onClose: () => void;
    // School Profile Props
    schoolProfile: SchoolProfile;
    setSchoolProfile: React.Dispatch<React.SetStateAction<SchoolProfile>>;
    // Data Props
    newsData: NewsItem[];
    setNewsData: React.Dispatch<React.SetStateAction<NewsItem[]>>;
    teachersData: Teacher[];
    setTeachersData: React.Dispatch<React.SetStateAction<Teacher[]>>;
    schedulesData: ClassSchedule[];
    setSchedulesData: React.Dispatch<React.SetStateAction<ClassSchedule[]>>;
    galleryData: GalleryImage[];
    setGalleryData: React.Dispatch<React.SetStateAction<GalleryImage[]>>;
}

type TabType = 'dashboard' | 'news' | 'teachers' | 'schedules' | 'gallery' | 'identity';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    isOpen, onClose, 
    schoolProfile, setSchoolProfile,
    newsData, setNewsData,
    teachersData, setTeachersData,
    schedulesData, setSchedulesData,
    galleryData, setGalleryData
}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');
    const [isSaving, setIsSaving] = useState(false);

    // --- State for Forms ---
    const [isEditing, setIsEditing] = useState(false);
    
    // Identity Form State (Local)
    const [identityForm, setIdentityForm] = useState<SchoolProfile>(schoolProfile);

    // Generic holders for editing
    const [currentNews, setCurrentNews] = useState<Partial<NewsItem> & { id?: string }>({});
    const [currentTeacher, setCurrentTeacher] = useState<Partial<Teacher> & { id?: string }>({});
    const [currentGallery, setCurrentGallery] = useState<Partial<GalleryImage> & { id?: string }>({});
    
    // Schedule Editing State
    const [selectedClassForSchedule, setSelectedClassForSchedule] = useState<string>(schedulesData[0]?.className || '');
    const [selectedDayForSchedule, setSelectedDayForSchedule] = useState<string>('Senin');
    const [newScheduleItem, setNewScheduleItem] = useState<ScheduleItem>({ time: '', subject: '' });

    // --- Auth Logic ---
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin123') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Password salah!');
        }
    };

    // --- File Upload Helper (With Auto Compression) ---
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void, isLogo: boolean = false) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check initial file size (e.g. warn if > 5MB)
            if (file.size > 5 * 1024 * 1024) {
                 alert("Ukuran file asli terlalu besar (>5MB). Mohon pilih file yang lebih kecil.");
                 return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    
                    // Optimization Settings (Aggressive compression for DB storage)
                    const MAX_WIDTH = isLogo ? 300 : 640;  // Reduced from 800
                    const MAX_HEIGHT = isLogo ? 300 : 800; // Add max height constraint
                    
                    let width = img.width;
                    let height = img.height;

                    // Resize logic maintaining aspect ratio
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, width, height);
                        
                        // Use JPEG for photos, PNG for logos (transparency)
                        const format = isLogo ? 'image/png' : 'image/jpeg';
                        // Reduce quality to 0.5 (50%) to ensure small file size
                        const quality = isLogo ? undefined : 0.5; 

                        const dataUrl = canvas.toDataURL(format, quality);
                        
                        // Firestore field limit is ~1MB (1,048,487 bytes)
                        // Safety threshold set to ~600KB to allow room for other fields
                        const SAFETY_LIMIT = 600000;

                        if (dataUrl.length > SAFETY_LIMIT) {
                            alert(`Ukuran gambar hasil kompresi masih terlalu besar (${Math.round(dataUrl.length/1024)} KB). Mohon gunakan gambar dengan resolusi lebih rendah.`);
                        } else {
                            callback(dataUrl);
                        }
                    }
                };
            };
        }
    };

    // --- Save Identity ---
    const saveIdentity = async () => {
        setIsSaving(true);
        try {
            const cleanData = {
                name: identityForm.name || "",
                address: identityForm.address || "",
                phone: identityForm.phone || "",
                email: identityForm.email || "",
                logo: identityForm.logo || "",
                logoDaerah: identityForm.logoDaerah || "",
                logoMapan: identityForm.logoMapan || "",
                socialMedia: {
                    facebook: identityForm.socialMedia?.facebook || "",
                    instagram: identityForm.socialMedia?.instagram || "",
                    youtube: identityForm.socialMedia?.youtube || ""
                }
            };

            const querySnapshot = await getDocs(collection(db, "school_profile"));
            if (!querySnapshot.empty) {
                const docId = querySnapshot.docs[0].id;
                await updateDoc(doc(db, "school_profile", docId), cleanData);
            } else {
                await addDoc(collection(db, "school_profile"), cleanData);
            }
            setSchoolProfile(cleanData);
            alert('Data identitas sekolah berhasil disimpan!');
        } catch (e: any) {
            console.error(e);
            alert("Gagal menyimpan: " + (e.message || "Terjadi kesalahan."));
        }
        setIsSaving(false);
    };

    // --- CRUD: News ---
    const saveNews = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const dataToSave = {
                title: currentNews.title || "",
                date: currentNews.date || "",
                category: currentNews.category || 'Pengumuman',
                summary: currentNews.summary || "",
                content: currentNews.content || "", 
                image: currentNews.image || 'https://picsum.photos/600/400'
            };

            if (currentNews.id) {
                await updateDoc(doc(db, "news", String(currentNews.id)), dataToSave);
                setNewsData(prev => prev.map(item => String(item.id) === String(currentNews.id) ? { ...item, ...dataToSave } : item));
            } else {
                const docRef = await addDoc(collection(db, "news"), dataToSave);
                setNewsData(prev => [{ ...dataToSave, id: docRef.id } as any, ...prev]);
            }
            setIsEditing(false);
            setCurrentNews({});
        } catch (e: any) {
            console.error(e);
            alert("Gagal menyimpan berita: " + e.message);
        }
        setIsSaving(false);
    };

    const deleteNews = async (id: string | number) => {
        if(!confirm("Hapus berita ini?")) return;
        try {
            await deleteDoc(doc(db, "news", String(id)));
            setNewsData(prev => prev.filter(n => String(n.id) !== String(id)));
        } catch(e) { console.error(e); alert("Gagal menghapus"); }
    };

    // --- CRUD: Teachers ---
    const saveTeacher = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const dataToSave = {
                name: currentTeacher.name || "",
                role: currentTeacher.role || "",
                image: currentTeacher.image || 'https://picsum.photos/300/300'
            };
            if (currentTeacher.id) {
                await updateDoc(doc(db, "teachers", String(currentTeacher.id)), dataToSave);
                setTeachersData(prev => prev.map(item => String(item.id) === String(currentTeacher.id) ? { ...item, ...dataToSave } : item));
            } else {
                const docRef = await addDoc(collection(db, "teachers"), dataToSave);
                setTeachersData(prev => [...prev, { ...dataToSave, id: docRef.id } as any]);
            }
            setIsEditing(false);
            setCurrentTeacher({});
        } catch (e: any) { console.error(e); alert("Gagal menyimpan guru: " + e.message); }
        setIsSaving(false);
    };

    const deleteTeacher = async (id: string | number) => {
        if(!confirm("Hapus guru ini?")) return;
        try {
            await deleteDoc(doc(db, "teachers", String(id)));
            setTeachersData(prev => prev.filter(t => String(t.id) !== String(id)));
        } catch(e) { console.error(e); }
    };

    // --- CRUD: Gallery ---
    const saveGallery = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const dataToSave = {
                caption: currentGallery.caption || "",
                category: currentGallery.category || 'Fasilitas',
                src: currentGallery.src || 'https://picsum.photos/800/600'
            };
            if (currentGallery.id) {
                await updateDoc(doc(db, "gallery", String(currentGallery.id)), dataToSave);
                setGalleryData(prev => prev.map(item => String(item.id) === String(currentGallery.id) ? { ...item, ...dataToSave } : item));
            } else {
                const docRef = await addDoc(collection(db, "gallery"), dataToSave);
                setGalleryData(prev => [...prev, { ...dataToSave, id: docRef.id } as any]);
            }
            setIsEditing(false);
            setCurrentGallery({});
        } catch(e: any) { console.error(e); alert("Gagal menyimpan galeri: " + e.message); }
        setIsSaving(false);
    };

    const deleteGallery = async (id: string | number) => {
        if(!confirm("Hapus foto ini?")) return;
        try {
            await deleteDoc(doc(db, "gallery", String(id)));
            setGalleryData(prev => prev.filter(g => String(g.id) !== String(id)));
        } catch(e) { console.error(e); }
    };

    // --- CRUD: Schedule ---
    const updateScheduleInFirestore = async (updatedClassSchedule: ClassSchedule) => {
        try {
            await setDoc(doc(db, "schedules", updatedClassSchedule.className), updatedClassSchedule);
        } catch (e: any) {
            console.error("Failed to update schedule", e);
            alert("Gagal update jadwal ke database: " + e.message);
        }
    };

    const addScheduleItem = async () => {
        if (!newScheduleItem.time || !newScheduleItem.subject) return;

        let updatedClass: ClassSchedule | null = null;
        const newSchedules = schedulesData.map(cls => {
            if (cls.className === selectedClassForSchedule) {
                updatedClass = {
                    ...cls,
                    days: cls.days.map(day => {
                        if (day.dayName === selectedDayForSchedule) {
                            return { ...day, schedule: [...day.schedule, newScheduleItem] };
                        }
                        return day;
                    })
                };
                return updatedClass;
            }
            return cls;
        });

        if (updatedClass) {
            setSchedulesData(newSchedules);
            await updateScheduleInFirestore(updatedClass);
        }
        setNewScheduleItem({ time: '', subject: '' });
    };

    const deleteScheduleItem = async (idx: number) => {
        let updatedClass: ClassSchedule | null = null;
        const newSchedules = schedulesData.map(cls => {
            if (cls.className === selectedClassForSchedule) {
                updatedClass = {
                    ...cls,
                    days: cls.days.map(day => {
                        if (day.dayName === selectedDayForSchedule) {
                            const newSched = [...day.schedule];
                            newSched.splice(idx, 1);
                            return { ...day, schedule: newSched };
                        }
                        return day;
                    })
                };
                return updatedClass;
            }
            return cls;
        });

        if (updatedClass) {
            setSchedulesData(newSchedules);
            await updateScheduleInFirestore(updatedClass);
        }
    };

    if (!isOpen) return null;

    // -- Sidebar Button Component --
    const SidebarItem = ({ id, label, icon }: { id: TabType, label: string, icon: React.ReactNode }) => (
        <button 
            onClick={() => { setActiveTab(id); setIsEditing(false); }}
            className={`
                flex items-center gap-2 px-4 py-3 rounded-lg transition-colors whitespace-nowrap
                ${activeTab === id ? 'bg-brand-blue text-white' : 'text-slate-300 hover:bg-slate-700'}
                md:w-full md:justify-start justify-center
            `}
        >
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </button>
    );

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-2 md:p-4">
            <div className="bg-white w-full h-[95vh] md:max-w-7xl md:h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
                
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-2 right-2 md:top-4 md:right-4 z-10 p-2 bg-white/50 hover:bg-white rounded-full transition-colors shadow-sm">
                    <svg className="h-5 w-5 md:h-6 md:w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {!isAuthenticated ? (
                    <div className="w-full h-full flex items-center justify-center bg-brand-light p-4">
                        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm md:max-w-md border border-slate-100">
                            <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Login Pengelola</h2>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Password (admin123)" />
                                {error && <p className="text-red-500 text-xs">{error}</p>}
                                <button type="submit" className="w-full bg-brand-blue text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors">Masuk</button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Sidebar / Topbar Navigation */}
                        <div className="w-full md:w-64 bg-slate-800 text-white flex flex-col shrink-0">
                            <div className="p-4 md:p-6 border-b border-slate-700 hidden md:block">
                                <h2 className="text-xl font-bold font-display truncate">{schoolProfile.name}</h2>
                                <span className="text-xs text-slate-400">Database Manager</span>
                            </div>
                            
                            {/* Horizontal scroll on mobile, Vertical stack on desktop */}
                            <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto p-2 md:p-4 gap-2 no-scrollbar border-b md:border-b-0 border-slate-700">
                                <SidebarItem id="dashboard" label="Overview" icon={<span className="text-lg">📊</span>} />
                                <SidebarItem id="identity" label="Identitas" icon={<span className="text-lg">🏫</span>} />
                                <SidebarItem id="news" label="Berita" icon={<span className="text-lg">📰</span>} />
                                <SidebarItem id="teachers" label="Guru" icon={<span className="text-lg">👨‍🏫</span>} />
                                <SidebarItem id="schedules" label="Jadwal" icon={<span className="text-lg">📅</span>} />
                                <SidebarItem id="gallery" label="Galeri" icon={<span className="text-lg">📷</span>} />
                            </nav>
                            
                            <div className="p-4 border-t border-slate-700 hidden md:block">
                                <button onClick={() => setIsAuthenticated(false)} className="text-sm text-slate-400 hover:text-white">Log Out</button>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 bg-slate-50 overflow-y-auto p-4 md:p-8">
                            {/* DASHBOARD TAB */}
                            {activeTab === 'dashboard' && (
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Dashboard Overview</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                                        <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-l-4 border-brand-blue">
                                            <div className="text-xs md:text-sm text-slate-500">Total Berita</div>
                                            <div className="text-xl md:text-2xl font-bold">{newsData.length}</div>
                                        </div>
                                        <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-l-4 border-brand-orange">
                                            <div className="text-xs md:text-sm text-slate-500">Guru & Staf</div>
                                            <div className="text-xl md:text-2xl font-bold">{teachersData.length}</div>
                                        </div>
                                        <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-l-4 border-brand-yellow">
                                            <div className="text-xs md:text-sm text-slate-500">Foto Galeri</div>
                                            <div className="text-xl md:text-2xl font-bold">{galleryData.length}</div>
                                        </div>
                                        <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-l-4 border-brand-green">
                                            <div className="text-xs md:text-sm text-slate-500">Kelas Aktif</div>
                                            <div className="text-xl md:text-2xl font-bold">{schedulesData.length}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* IDENTITY TAB */}
                            {activeTab === 'identity' && (
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Identitas Sekolah</h2>
                                    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Sekolah</label>
                                                <input type="text" value={identityForm.name} onChange={(e) => setIdentityForm({...identityForm, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Nomor Telepon</label>
                                                <input type="text" value={identityForm.phone} onChange={(e) => setIdentityForm({...identityForm, phone: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Alamat Lengkap</label>
                                                <input type="text" value={identityForm.address} onChange={(e) => setIdentityForm({...identityForm, address: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Email Sekolah</label>
                                                <input type="email" value={identityForm.email} onChange={(e) => setIdentityForm({...identityForm, email: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
                                            </div>

                                            {/* Logos */}
                                            <div className="md:col-span-2 border-t pt-4 mt-2">
                                                <h3 className="font-bold text-slate-800 mb-3 text-sm">Logo Sekolah</h3>
                                            </div>
                                            {/* Logo Sekolah */}
                                            <div className="md:col-span-2 space-y-4">
                                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        {identityForm.logo ? (
                                                            <img src={identityForm.logo} className="h-10 w-10 object-cover rounded-full" />
                                                        ) : <div className="h-10 w-10 bg-slate-200 rounded-full" />}
                                                        <span className="text-sm font-bold">Logo Utama</span>
                                                    </div>
                                                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setIdentityForm({...identityForm, logo: url}), true)} className="text-xs w-32 md:w-auto" />
                                                </div>
                                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        {identityForm.logoDaerah ? (
                                                            <img src={identityForm.logoDaerah} className="h-10 w-10 object-contain" />
                                                        ) : <div className="h-10 w-10 bg-slate-200 rounded" />}
                                                        <span className="text-sm font-bold">Logo Daerah</span>
                                                    </div>
                                                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setIdentityForm({...identityForm, logoDaerah: url}), true)} className="text-xs w-32 md:w-auto" />
                                                </div>
                                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        {identityForm.logoMapan ? (
                                                            <img src={identityForm.logoMapan} className="h-10 w-10 object-contain" />
                                                        ) : <div className="h-10 w-10 bg-slate-200 rounded" />}
                                                        <span className="text-sm font-bold">Logo Mapan</span>
                                                    </div>
                                                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setIdentityForm({...identityForm, logoMapan: url}), true)} className="text-xs w-32 md:w-auto" />
                                                </div>
                                            </div>
                                            
                                            <div className="md:col-span-2 flex justify-end mt-4 pt-4 border-t border-slate-100">
                                                <button onClick={saveIdentity} disabled={isSaving} className="w-full md:w-auto bg-brand-blue text-white px-6 py-2 rounded-lg font-bold shadow disabled:opacity-50">
                                                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* OTHER TABS SIMPLIFIED FOR MOBILE */}
                            {/* Just standard tables, but wrapped in overflow-x-auto if needed */}
                            {activeTab === 'news' && (
                                <div>
                                    <div className="flex justify-between items-center mb-4 md:mb-6">
                                        <h2 className="text-xl md:text-2xl font-bold">Berita</h2>
                                        {!isEditing && <button onClick={() => { setCurrentNews({}); setIsEditing(true); }} className="bg-brand-blue text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-bold text-xs md:text-sm">+ Tambah</button>}
                                    </div>
                                    {isEditing ? (
                                        <form onSubmit={saveNews} className="bg-white p-4 md:p-6 rounded-xl shadow-sm space-y-4">
                                            <h3 className="font-bold border-b pb-2">Form Berita</h3>
                                            <input required type="text" placeholder="Judul" value={currentNews.title || ''} onChange={e => setCurrentNews({...currentNews, title: e.target.value})} className="w-full border p-2 rounded text-sm" />
                                            <div className="grid grid-cols-2 gap-3">
                                                <input required type="text" placeholder="Tanggal" value={currentNews.date || ''} onChange={e => setCurrentNews({...currentNews, date: e.target.value})} className="border p-2 rounded text-sm" />
                                                <select value={currentNews.category || 'Pengumuman'} onChange={e => setCurrentNews({...currentNews, category: e.target.value})} className="border p-2 rounded text-sm">
                                                    <option>Pengumuman</option><option>Prestasi</option><option>Kegiatan</option>
                                                </select>
                                            </div>
                                            <textarea required rows={2} placeholder="Ringkasan (Pendek)" value={currentNews.summary || ''} onChange={e => setCurrentNews({...currentNews, summary: e.target.value})} className="w-full border p-2 rounded text-sm" />
                                            <textarea rows={6} placeholder="Isi Berita Lengkap (Tampil di halaman detail)" value={currentNews.content || ''} onChange={e => setCurrentNews({...currentNews, content: e.target.value})} className="w-full border p-2 rounded text-sm" />
                                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setCurrentNews({...currentNews, image: url}))} className="w-full text-xs" />
                                            {currentNews.image && <img src={currentNews.image} className="h-16 object-cover rounded" />}
                                            <div className="flex gap-2 justify-end">
                                                <button type="button" onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-sm text-slate-500">Batal</button>
                                                <button type="submit" disabled={isSaving} className="bg-brand-blue text-white px-3 py-1.5 rounded text-sm">{isSaving ? '...' : 'Simpan'}</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                                            {newsData.map(item => (
                                                <div key={item.id} className="p-3 md:p-4 border-b flex justify-between items-center hover:bg-slate-50">
                                                    <div className="flex-1 min-w-0 pr-2">
                                                        <div className="font-bold truncate text-sm md:text-base">{item.title}</div>
                                                        <div className="text-xs text-slate-500">{item.date}</div>
                                                    </div>
                                                    <div className="flex gap-2 shrink-0">
                                                        <button onClick={() => { setCurrentNews(item as any); setIsEditing(true); }} className="text-blue-500 text-xs font-bold p-1">Edit</button>
                                                        <button onClick={() => deleteNews(item.id)} className="text-red-500 text-xs font-bold p-1">Hapus</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                             {/* TEACHERS TAB */}
                            {activeTab === 'teachers' && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-bold">Guru</h2>
                                        {!isEditing && <button onClick={() => { setCurrentTeacher({}); setIsEditing(true); }} className="bg-brand-blue text-white px-3 py-1.5 rounded-lg font-bold text-xs">+ Tambah</button>}
                                    </div>
                                    {isEditing ? (
                                        <form onSubmit={saveTeacher} className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                                            <input required type="text" placeholder="Nama" value={currentTeacher.name || ''} onChange={e => setCurrentTeacher({...currentTeacher, name: e.target.value})} className="w-full border p-2 rounded text-sm" />
                                            <input required type="text" placeholder="Jabatan" value={currentTeacher.role || ''} onChange={e => setCurrentTeacher({...currentTeacher, role: e.target.value})} className="w-full border p-2 rounded text-sm" />
                                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setCurrentTeacher({...currentTeacher, image: url}))} className="w-full text-xs" />
                                            {currentTeacher.image && <img src={currentTeacher.image} className="h-16 w-16 object-cover rounded-full" />}
                                            <div className="flex gap-2 justify-end">
                                                <button type="button" onClick={() => setIsEditing(false)} className="text-sm text-slate-500">Batal</button>
                                                <button type="submit" className="bg-brand-blue text-white px-3 py-1.5 rounded text-sm">Simpan</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {teachersData.map(t => (
                                                <div key={t.id} className="bg-white p-3 rounded-xl shadow-sm flex items-center gap-3">
                                                    <img src={t.image} className="w-10 h-10 rounded-full object-cover" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-bold text-sm truncate">{t.name}</div>
                                                        <div className="text-xs text-slate-500 truncate">{t.role}</div>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <button onClick={() => { setCurrentTeacher(t as any); setIsEditing(true); }} className="text-blue-500 text-xs">Edit</button>
                                                        <button onClick={() => deleteTeacher(t.id)} className="text-red-500 text-xs">Hapus</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                             {/* SCHEDULES TAB */}
                             {activeTab === 'schedules' && (
                                <div>
                                    <h2 className="text-xl font-bold mb-4">Jadwal</h2>
                                    <div className="bg-white p-4 rounded-xl shadow-sm">
                                        <div className="flex flex-col md:flex-row gap-3 mb-4">
                                            <select value={selectedClassForSchedule} onChange={e => setSelectedClassForSchedule(e.target.value)} className="border p-2 rounded text-sm w-full font-bold">
                                                {schedulesData.map(s => <option key={s.className} value={s.className}>{s.className}</option>)}
                                            </select>
                                            <select value={selectedDayForSchedule} onChange={e => setSelectedDayForSchedule(e.target.value)} className="border p-2 rounded text-sm w-full">
                                                <option>Senin</option><option>Selasa</option><option>Rabu</option><option>Kamis</option><option>Jumat</option>
                                            </select>
                                        </div>

                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                                            <div className="space-y-2 mb-4">
                                                {schedulesData
                                                    .find(c => c.className === selectedClassForSchedule)
                                                    ?.days.find(d => d.dayName === selectedDayForSchedule)
                                                    ?.schedule.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between items-center bg-white p-2 rounded shadow-sm text-sm">
                                                            <div className="truncate pr-2">
                                                                <span className="font-bold text-brand-blue mr-2 block md:inline">{item.time}</span>
                                                                <span>{item.subject}</span>
                                                            </div>
                                                            <button onClick={() => deleteScheduleItem(idx)} className="text-red-500 p-1">🗑️</button>
                                                        </div>
                                                ))}
                                            </div>
                                            <div className="flex flex-col md:flex-row gap-2 items-end pt-2 border-t">
                                                <input type="text" value={newScheduleItem.time} onChange={e => setNewScheduleItem({...newScheduleItem, time: e.target.value})} className="w-full border p-2 rounded text-xs" placeholder="Waktu (07:00-08:00)" />
                                                <input type="text" value={newScheduleItem.subject} onChange={e => setNewScheduleItem({...newScheduleItem, subject: e.target.value})} className="w-full border p-2 rounded text-xs" placeholder="Mapel" />
                                                <button onClick={addScheduleItem} className="w-full md:w-auto bg-brand-green text-white px-3 py-2 rounded text-xs font-bold">Tambah</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                             {/* GALLERY TAB */}
                             {activeTab === 'gallery' && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-bold">Galeri</h2>
                                        {!isEditing && <button onClick={() => { setCurrentGallery({}); setIsEditing(true); }} className="bg-brand-blue text-white px-3 py-1.5 rounded-lg font-bold text-xs">+ Upload</button>}
                                    </div>
                                    {isEditing ? (
                                        <form onSubmit={saveGallery} className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                                            <input required type="text" placeholder="Caption" value={currentGallery.caption || ''} onChange={e => setCurrentGallery({...currentGallery, caption: e.target.value})} className="w-full border p-2 rounded text-sm" />
                                            <select value={currentGallery.category || 'Fasilitas'} onChange={e => setCurrentGallery({...currentGallery, category: e.target.value as any})} className="w-full border p-2 rounded text-sm">
                                                <option>Fasilitas</option><option>Akademik</option><option>Ekstrakurikuler</option>
                                            </select>
                                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setCurrentGallery({...currentGallery, src: url}))} className="w-full text-xs" />
                                            {currentGallery.src && <img src={currentGallery.src} className="h-24 object-cover rounded" />}
                                            <div className="flex gap-2 justify-end">
                                                <button type="button" onClick={() => setIsEditing(false)} className="text-sm text-slate-500">Batal</button>
                                                <button type="submit" disabled={isSaving} className="bg-brand-blue text-white px-3 py-1.5 rounded text-sm">Simpan</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            {galleryData.map(item => (
                                                <div key={item.id} className="relative rounded-lg overflow-hidden shadow-sm aspect-video">
                                                    <img src={item.src} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-end justify-between p-2">
                                                        <span className="text-white text-[10px] truncate w-2/3">{item.caption}</span>
                                                        <button onClick={() => deleteGallery(item.id)} className="text-red-300 text-xs font-bold bg-black/50 px-1 rounded">Hapus</button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
