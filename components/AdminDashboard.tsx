
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

    // --- File Upload Helper ---
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    callback(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // --- Save Identity ---
    const saveIdentity = async () => {
        setIsSaving(true);
        try {
            // Sanitasi data: pastikan tidak ada field undefined karena Firestore menolaknya
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

            // Find the doc ID for profile. Since we only have 1 profile, we query it.
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
            alert("Gagal menyimpan: " + (e.message || "Terjadi kesalahan tidak diketahui. Cek Rules Firebase."));
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
                image: currentNews.image || 'https://picsum.photos/600/400'
            };

            if (currentNews.id) {
                // Update
                await updateDoc(doc(db, "news", String(currentNews.id)), dataToSave);
                setNewsData(prev => prev.map(item => String(item.id) === String(currentNews.id) ? { ...item, ...dataToSave } : item));
            } else {
                // Create
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
    // Firestore Logic: Update the whole Class Document
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

    // -- Sub Components for UI --
    const SidebarItem = ({ id, label, icon }: { id: TabType, label: string, icon: React.ReactNode }) => (
        <button 
            onClick={() => { setActiveTab(id); setIsEditing(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === id ? 'bg-brand-blue text-white' : 'text-slate-300 hover:bg-slate-700'}`}
        >
            {icon}
            {label}
        </button>
    );

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-7xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
                
                {/* Close */}
                <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white rounded-full transition-colors">
                    <svg className="h-6 w-6 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                {!isAuthenticated ? (
                    <div className="w-full h-full flex items-center justify-center bg-brand-light">
                        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                            <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Login Pengelola</h2>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Password (admin123)" />
                                {error && <p className="text-red-500 text-xs">{error}</p>}
                                <button type="submit" className="w-full bg-brand-blue text-white py-3 rounded-lg font-bold">Masuk</button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Sidebar */}
                        <div className="w-full md:w-64 bg-slate-800 text-white flex flex-col">
                            <div className="p-6 border-b border-slate-700">
                                <h2 className="text-xl font-bold font-display">{schoolProfile.name}</h2>
                                <span className="text-xs text-slate-400">Database Manager</span>
                            </div>
                            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                                <SidebarItem id="dashboard" label="Overview" icon={<span className="text-lg">📊</span>} />
                                <SidebarItem id="identity" label="Identitas Sekolah" icon={<span className="text-lg">🏫</span>} />
                                <SidebarItem id="news" label="Berita & Info" icon={<span className="text-lg">📰</span>} />
                                <SidebarItem id="teachers" label="Data Guru" icon={<span className="text-lg">👨‍🏫</span>} />
                                <SidebarItem id="schedules" label="Jadwal Pelajaran" icon={<span className="text-lg">📅</span>} />
                                <SidebarItem id="gallery" label="Galeri & Ekskul" icon={<span className="text-lg">📷</span>} />
                            </nav>
                            <div className="p-4 border-t border-slate-700">
                                <button onClick={() => setIsAuthenticated(false)} className="text-sm text-slate-400 hover:text-white">Log Out</button>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 bg-slate-50 overflow-y-auto p-8">
                            {/* DASHBOARD TAB */}
                            {activeTab === 'dashboard' && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-l-4 border-brand-blue">
                                            <div className="text-sm text-slate-500">Total Berita</div>
                                            <div className="text-2xl font-bold">{newsData.length}</div>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-l-4 border-brand-orange">
                                            <div className="text-sm text-slate-500">Guru & Staf</div>
                                            <div className="text-2xl font-bold">{teachersData.length}</div>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-l-4 border-brand-yellow">
                                            <div className="text-sm text-slate-500">Foto Galeri</div>
                                            <div className="text-2xl font-bold">{galleryData.length}</div>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-l-4 border-brand-green">
                                            <div className="text-sm text-slate-500">Kelas Aktif</div>
                                            <div className="text-2xl font-bold">{schedulesData.length}</div>
                                        </div>
                                    </div>
                                    <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
                                        <h3 className="font-bold text-blue-800 mb-2">👋 Selamat Datang Admin!</h3>
                                        <p className="text-blue-600 text-sm">
                                            Status: <span className="font-bold text-green-600">Online (Terhubung ke Firebase)</span><br/>
                                            Gunakan menu di sebelah kiri untuk mengelola konten website. Perubahan akan langsung tersimpan di database Cloud.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* IDENTITY TAB */}
                            {activeTab === 'identity' && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6">Identitas Sekolah</h2>
                                    <div className="bg-white p-6 rounded-xl shadow-sm">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Nama Sekolah</label>
                                                <input 
                                                    type="text" 
                                                    value={identityForm.name}
                                                    onChange={(e) => setIdentityForm({...identityForm, name: e.target.value})}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Nomor Telepon</label>
                                                <input 
                                                    type="text" 
                                                    value={identityForm.phone}
                                                    onChange={(e) => setIdentityForm({...identityForm, phone: e.target.value})}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Alamat Lengkap</label>
                                                <input 
                                                    type="text" 
                                                    value={identityForm.address}
                                                    onChange={(e) => setIdentityForm({...identityForm, address: e.target.value})}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Email Sekolah</label>
                                                <input 
                                                    type="email" 
                                                    value={identityForm.email}
                                                    onChange={(e) => setIdentityForm({...identityForm, email: e.target.value})}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                                                />
                                            </div>

                                            {/* Logo Uploads */}
                                            <div className="md:col-span-2 border-t pt-6 mt-2">
                                                <h3 className="font-bold text-slate-800 mb-4">Logo Sekolah & Daerah</h3>
                                            </div>

                                            {/* Logo Sekolah */}
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Logo Sekolah</label>
                                                <div className="flex items-center gap-4">
                                                    {identityForm.logo ? (
                                                        <img src={identityForm.logo} alt="Logo Preview" className="h-16 w-16 object-cover rounded-full border border-slate-200" />
                                                    ) : (
                                                        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 text-xs border border-slate-200">No Logo</div>
                                                    )}
                                                    <input 
                                                        type="file" 
                                                        accept="image/*" 
                                                        onChange={(e) => handleFileUpload(e, (url) => setIdentityForm({...identityForm, logo: url}))} 
                                                        className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-blue/10 file:text-brand-blue hover:file:bg-brand-blue/20" 
                                                    />
                                                    {identityForm.logo && (
                                                        <button onClick={() => setIdentityForm({...identityForm, logo: ''})} className="text-red-500 text-sm font-bold hover:underline">Hapus</button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Logo Daerah */}
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Logo Daerah</label>
                                                <div className="flex items-center gap-4">
                                                    {identityForm.logoDaerah ? (
                                                        <img src={identityForm.logoDaerah} alt="Logo Daerah Preview" className="h-16 w-16 object-contain border border-slate-200 p-1 rounded" />
                                                    ) : (
                                                        <div className="h-16 w-16 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs border border-slate-200">No Logo</div>
                                                    )}
                                                    <input 
                                                        type="file" 
                                                        accept="image/*" 
                                                        onChange={(e) => handleFileUpload(e, (url) => setIdentityForm({...identityForm, logoDaerah: url}))} 
                                                        className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-blue/10 file:text-brand-blue hover:file:bg-brand-blue/20" 
                                                    />
                                                    {identityForm.logoDaerah && (
                                                        <button onClick={() => setIdentityForm({...identityForm, logoDaerah: ''})} className="text-red-500 text-sm font-bold hover:underline">Hapus</button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Logo Mapan */}
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Logo Mapan Kota Kediri</label>
                                                <div className="flex items-center gap-4">
                                                    {identityForm.logoMapan ? (
                                                        <img src={identityForm.logoMapan} alt="Logo Mapan Preview" className="h-16 w-16 object-contain border border-slate-200 p-1 rounded" />
                                                    ) : (
                                                        <div className="h-16 w-16 bg-slate-100 rounded flex items-center justify-center text-slate-400 text-xs border border-slate-200">No Logo</div>
                                                    )}
                                                    <input 
                                                        type="file" 
                                                        accept="image/*" 
                                                        onChange={(e) => handleFileUpload(e, (url) => setIdentityForm({...identityForm, logoMapan: url}))} 
                                                        className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-blue/10 file:text-brand-blue hover:file:bg-brand-blue/20" 
                                                    />
                                                    {identityForm.logoMapan && (
                                                        <button onClick={() => setIdentityForm({...identityForm, logoMapan: ''})} className="text-red-500 text-sm font-bold hover:underline">Hapus</button>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="md:col-span-2 border-t pt-6 mt-2">
                                                <h3 className="font-bold text-slate-800 mb-4">Media Sosial</h3>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Facebook URL</label>
                                                <input 
                                                    type="text" 
                                                    value={identityForm.socialMedia.facebook}
                                                    onChange={(e) => setIdentityForm({...identityForm, socialMedia: {...identityForm.socialMedia, facebook: e.target.value}})}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                                                    placeholder="https://facebook.com/..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Instagram URL</label>
                                                <input 
                                                    type="text" 
                                                    value={identityForm.socialMedia.instagram}
                                                    onChange={(e) => setIdentityForm({...identityForm, socialMedia: {...identityForm.socialMedia, instagram: e.target.value}})}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                                                    placeholder="https://instagram.com/..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Youtube URL</label>
                                                <input 
                                                    type="text" 
                                                    value={identityForm.socialMedia.youtube}
                                                    onChange={(e) => setIdentityForm({...identityForm, socialMedia: {...identityForm.socialMedia, youtube: e.target.value}})}
                                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none"
                                                    placeholder="https://youtube.com/..."
                                                />
                                            </div>

                                            <div className="md:col-span-2 flex justify-end mt-4 pt-4 border-t border-slate-100">
                                                <button 
                                                    onClick={saveIdentity}
                                                    disabled={isSaving}
                                                    className="bg-brand-blue text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-blue-600 transition-colors disabled:opacity-50"
                                                >
                                                    {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* NEWS TAB */}
                            {activeTab === 'news' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold">Kelola Berita</h2>
                                        {!isEditing && <button onClick={() => { setCurrentNews({}); setIsEditing(true); }} className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold text-sm">+ Tambah</button>}
                                    </div>
                                    {isEditing ? (
                                        <form onSubmit={saveNews} className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                                            <h3 className="font-bold border-b pb-2">Form Berita</h3>
                                            <input required type="text" placeholder="Judul" value={currentNews.title || ''} onChange={e => setCurrentNews({...currentNews, title: e.target.value})} className="w-full border p-2 rounded" />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input required type="text" placeholder="Tanggal" value={currentNews.date || ''} onChange={e => setCurrentNews({...currentNews, date: e.target.value})} className="border p-2 rounded" />
                                                <select value={currentNews.category || 'Pengumuman'} onChange={e => setCurrentNews({...currentNews, category: e.target.value})} className="border p-2 rounded">
                                                    <option>Pengumuman</option><option>Prestasi</option><option>Kegiatan</option>
                                                </select>
                                            </div>
                                            <textarea required rows={3} placeholder="Ringkasan" value={currentNews.summary || ''} onChange={e => setCurrentNews({...currentNews, summary: e.target.value})} className="w-full border p-2 rounded" />
                                            <div>
                                                <label className="block text-sm font-bold mb-1">Upload Foto</label>
                                                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setCurrentNews({...currentNews, image: url}))} className="w-full text-sm" />
                                                {currentNews.image && <img src={currentNews.image} alt="Preview" className="mt-2 h-20 object-cover rounded" />}
                                            </div>
                                            <div className="flex gap-2 justify-end">
                                                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-500">Batal</button>
                                                <button type="submit" disabled={isSaving} className="bg-brand-blue text-white px-4 py-2 rounded">{isSaving ? 'Menyimpan...' : 'Simpan'}</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                                            {newsData.map(item => (
                                                <div key={item.id} className="p-4 border-b flex justify-between items-center hover:bg-slate-50">
                                                    <div>
                                                        <div className="font-bold">{item.title}</div>
                                                        <div className="text-xs text-slate-500">{item.date} • {item.category}</div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => { setCurrentNews(item as any); setIsEditing(true); }} className="text-blue-500 text-sm font-bold">Edit</button>
                                                        <button onClick={() => deleteNews(item.id)} className="text-red-500 text-sm font-bold">Hapus</button>
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
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold">Data Guru</h2>
                                        {!isEditing && <button onClick={() => { setCurrentTeacher({}); setIsEditing(true); }} className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold text-sm">+ Tambah Guru</button>}
                                    </div>
                                    {isEditing ? (
                                        <form onSubmit={saveTeacher} className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                                            <h3 className="font-bold border-b pb-2">Form Guru</h3>
                                            <input required type="text" placeholder="Nama Lengkap" value={currentTeacher.name || ''} onChange={e => setCurrentTeacher({...currentTeacher, name: e.target.value})} className="w-full border p-2 rounded" />
                                            <input required type="text" placeholder="Jabatan (Misal: Wali Kelas 1)" value={currentTeacher.role || ''} onChange={e => setCurrentTeacher({...currentTeacher, role: e.target.value})} className="w-full border p-2 rounded" />
                                            <div>
                                                <label className="block text-sm font-bold mb-1">Foto Guru</label>
                                                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setCurrentTeacher({...currentTeacher, image: url}))} className="w-full text-sm" />
                                                {currentTeacher.image && <img src={currentTeacher.image} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded-full" />}
                                            </div>
                                            <div className="flex gap-2 justify-end">
                                                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-500">Batal</button>
                                                <button type="submit" disabled={isSaving} className="bg-brand-blue text-white px-4 py-2 rounded">{isSaving ? 'Menyimpan...' : 'Simpan'}</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {teachersData.map(t => (
                                                <div key={t.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4">
                                                    <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                                                    <div className="flex-1">
                                                        <div className="font-bold text-sm">{t.name}</div>
                                                        <div className="text-xs text-slate-500">{t.role}</div>
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <button onClick={() => { setCurrentTeacher(t as any); setIsEditing(true); }} className="text-blue-500 text-xs font-bold">Edit</button>
                                                        <button onClick={() => deleteTeacher(t.id)} className="text-red-500 text-xs font-bold">Hapus</button>
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
                                    <h2 className="text-2xl font-bold mb-6">Kelola Jadwal Pelajaran</h2>
                                    <div className="bg-white p-6 rounded-xl shadow-sm">
                                        {/* Selectors */}
                                        <div className="flex gap-4 mb-6">
                                            <select value={selectedClassForSchedule} onChange={e => setSelectedClassForSchedule(e.target.value)} className="border p-2 rounded font-bold text-slate-700">
                                                {schedulesData.map(s => <option key={s.className} value={s.className}>{s.className}</option>)}
                                            </select>
                                            <select value={selectedDayForSchedule} onChange={e => setSelectedDayForSchedule(e.target.value)} className="border p-2 rounded text-slate-700">
                                                <option>Senin</option><option>Selasa</option><option>Rabu</option><option>Kamis</option><option>Jumat</option>
                                            </select>
                                        </div>

                                        {/* Editor */}
                                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                            <h3 className="font-bold text-slate-700 mb-4">Jadwal {selectedClassForSchedule} - {selectedDayForSchedule}</h3>
                                            
                                            {/* List Items */}
                                            <div className="space-y-2 mb-4">
                                                {schedulesData
                                                    .find(c => c.className === selectedClassForSchedule)
                                                    ?.days.find(d => d.dayName === selectedDayForSchedule)
                                                    ?.schedule.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between items-center bg-white p-3 rounded shadow-sm">
                                                            <div>
                                                                <span className="font-bold text-brand-blue mr-2">{item.time}</span>
                                                                <span>{item.subject}</span>
                                                            </div>
                                                            <button onClick={() => deleteScheduleItem(idx)} className="text-red-500 hover:text-red-700">🗑️</button>
                                                        </div>
                                                ))}
                                            </div>

                                            {/* Add New */}
                                            <div className="flex gap-2 items-end mt-4 pt-4 border-t border-slate-200">
                                                <div className="flex-1">
                                                    <label className="text-xs font-bold text-slate-500">Waktu (07:00 - 08:00)</label>
                                                    <input type="text" value={newScheduleItem.time} onChange={e => setNewScheduleItem({...newScheduleItem, time: e.target.value})} className="w-full border p-2 rounded text-sm" placeholder="00:00 - 00:00" />
                                                </div>
                                                <div className="flex-[2]">
                                                    <label className="text-xs font-bold text-slate-500">Mata Pelajaran</label>
                                                    <input type="text" value={newScheduleItem.subject} onChange={e => setNewScheduleItem({...newScheduleItem, subject: e.target.value})} className="w-full border p-2 rounded text-sm" placeholder="Nama Pelajaran" />
                                                </div>
                                                <button onClick={addScheduleItem} className="bg-brand-green text-white px-4 py-2 rounded text-sm font-bold h-[38px]">Tambah</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* GALLERY TAB */}
                            {activeTab === 'gallery' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold">Galeri & Ekstrakurikuler</h2>
                                        {!isEditing && <button onClick={() => { setCurrentGallery({}); setIsEditing(true); }} className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold text-sm">+ Upload Foto</button>}
                                    </div>
                                    {isEditing ? (
                                        <form onSubmit={saveGallery} className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                                            <h3 className="font-bold border-b pb-2">Form Galeri</h3>
                                            <input required type="text" placeholder="Caption / Judul Foto" value={currentGallery.caption || ''} onChange={e => setCurrentGallery({...currentGallery, caption: e.target.value})} className="w-full border p-2 rounded" />
                                            <select value={currentGallery.category || 'Fasilitas'} onChange={e => setCurrentGallery({...currentGallery, category: e.target.value as any})} className="w-full border p-2 rounded">
                                                <option>Fasilitas</option><option>Akademik</option><option>Ekstrakurikuler</option>
                                            </select>
                                            <div>
                                                <label className="block text-sm font-bold mb-1">Upload File Foto</label>
                                                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setCurrentGallery({...currentGallery, src: url}))} className="w-full text-sm" />
                                                {currentGallery.src && <img src={currentGallery.src} alt="Preview" className="mt-2 h-40 object-cover rounded" />}
                                            </div>
                                            <div className="flex gap-2 justify-end">
                                                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-500">Batal</button>
                                                <button type="submit" disabled={isSaving} className="bg-brand-blue text-white px-4 py-2 rounded">{isSaving ? 'Menyimpan...' : 'Simpan'}</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {galleryData.map(item => (
                                                <div key={item.id} className="group relative rounded-lg overflow-hidden shadow-sm">
                                                    <img src={item.src} alt={item.caption} className="w-full h-32 object-cover" />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                                                        <p className="text-white text-xs font-bold truncate">{item.caption}</p>
                                                        <div className="flex justify-end mt-2">
                                                            <button onClick={() => deleteGallery(item.id)} className="bg-red-500 text-white text-xs px-2 py-1 rounded">Hapus</button>
                                                        </div>
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
