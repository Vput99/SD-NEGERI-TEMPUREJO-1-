
import React, { useState } from 'react';
import { NewsItem, Teacher, ClassSchedule, GalleryImage, SchoolProfile } from '../types';
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
    const [loading, setLoading] = useState(false);
    const [compressing, setCompressing] = useState(false);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

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
                    
                    // Resize logic: Max 800px
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
                    ctx.drawImage(img, 0, 0, width, height);

                    // Compress to JPEG with reduced quality
                    let quality = 0.7;
                    let dataUrl = canvas.toDataURL('image/jpeg', quality);

                    // Loop to ensure size is under ~900KB (Safety margin for Firestore 1MB)
                    // Base64 length ~ 1.33 * bytes
                    const MAX_BASE64_LENGTH = 1000000; 

                    while (dataUrl.length > MAX_BASE64_LENGTH && quality > 0.1) {
                        quality -= 0.1;
                        dataUrl = canvas.toDataURL('image/jpeg', quality);
                    }

                    if (dataUrl.length > MAX_BASE64_LENGTH) {
                        reject(new Error("Ukuran gambar terlalu besar meskipun sudah dikompres. Gunakan gambar lain."));
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
                setFunction({ ...currentData, [field]: compressedBase64 });
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
            alert("Mohon isi Judul dan Upload Foto terlebih dahulu agar AI bisa menganalisisnya.");
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
            alert("Gagal menghasilkan berita dengan AI: " + error.message);
        } finally {
            setIsGeneratingAI(false);
        }
    };

    // --- CRUD: NEWS ---
    const handleSaveNews = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingNews?.title || !editingNews?.date) return;
        setLoading(true);
        try {
            if (editingNews.id) {
                // Update
                const newsRef = doc(db, "news", String(editingNews.id));
                const { id, ...data } = editingNews;
                await updateDoc(newsRef, data);
                setNewsData(prev => prev.map(item => item.id === editingNews.id ? editingNews as NewsItem : item));
            } else {
                // Create
                const newDoc = await addDoc(collection(db, "news"), editingNews);
                setNewsData(prev => [{ ...editingNews, id: newDoc.id } as NewsItem, ...prev]);
            }
            setEditingNews(null);
        } catch (error: any) {
            console.error("Error saving news:", error);
            alert(`Gagal menyimpan berita: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteNews = async (id: string | number) => {
        if (!confirm("Yakin hapus berita ini?")) return;
        setLoading(true);
        try {
            await deleteDoc(doc(db, "news", String(id)));
            setNewsData(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error("Error deleting news:", error);
            alert("Gagal menghapus berita");
        } finally {
            setLoading(false);
        }
    };

    // --- CRUD: TEACHERS ---
    const handleSaveTeacher = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTeacher?.name) return;
        setLoading(true);
        try {
            if (editingTeacher.id) {
                const ref = doc(db, "teachers", String(editingTeacher.id));
                const { id, ...data } = editingTeacher;
                await updateDoc(ref, data);
                setTeachersData(prev => prev.map(item => item.id === editingTeacher.id ? editingTeacher as Teacher : item));
            } else {
                const newDoc = await addDoc(collection(db, "teachers"), editingTeacher);
                setTeachersData(prev => [...prev, { ...editingTeacher, id: newDoc.id } as Teacher]);
            }
            setEditingTeacher(null);
        } catch (error: any) {
            alert(`Gagal menyimpan data guru: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTeacher = async (id: string | number) => {
        if (!confirm("Yakin hapus data guru ini?")) return;
        try {
            await deleteDoc(doc(db, "teachers", String(id)));
            setTeachersData(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            alert("Gagal menghapus data guru");
        }
    };

    // --- CRUD: GALLERY ---
    const handleSaveGallery = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingGallery?.src) return;
        setLoading(true);
        try {
             if (editingGallery.id) {
                const ref = doc(db, "gallery", String(editingGallery.id));
                const { id, ...data } = editingGallery;
                await updateDoc(ref, data);
                setGalleryData(prev => prev.map(item => item.id === editingGallery.id ? editingGallery as GalleryImage : item));
            } else {
                const newDoc = await addDoc(collection(db, "gallery"), editingGallery);
                setGalleryData(prev => [...prev, { ...editingGallery, id: newDoc.id } as GalleryImage]);
            }
            setEditingGallery(null);
        } catch (error: any) {
             alert(`Gagal menyimpan foto: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGallery = async (id: string | number) => {
        if (!confirm("Hapus foto ini?")) return;
        try {
            await deleteDoc(doc(db, "gallery", String(id)));
            setGalleryData(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            alert("Gagal menghapus foto");
        }
    };

    // --- CRUD: PROFILE ---
    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            // Find existing profile doc or create new
            await setDoc(doc(db, "school_profile", "main"), schoolProfile);
            alert("Profil sekolah berhasil disimpan!");
        } catch (error: any) {
            console.error(error);
            alert("Gagal menyimpan profil.");
        } finally {
            setLoading(false);
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex overflow-hidden">
                
                {/* Sidebar */}
                <div className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
                    <div className="p-6 border-b border-slate-700">
                        <h2 className="font-bold text-xl tracking-tight">Admin Panel</h2>
                        <p className="text-slate-400 text-xs">SDN Tempurejo 1</p>
                    </div>
                    
                    {!isAuthenticated ? (
                        <div className="p-4 text-sm text-slate-400">Silakan login</div>
                    ) : (
                        <nav className="flex-grow p-4 space-y-2">
                            <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${activeTab === 'dashboard' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'hover:bg-slate-800 text-slate-300'}`}>
                                <span>📊</span> Dashboard
                            </button>
                            <button onClick={() => setActiveTab('identity')} className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${activeTab === 'identity' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'hover:bg-slate-800 text-slate-300'}`}>
                                <span>🏫</span> Identitas
                            </button>
                            <button onClick={() => setActiveTab('news')} className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${activeTab === 'news' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'hover:bg-slate-800 text-slate-300'}`}>
                                <span>📰</span> Berita
                            </button>
                            <button onClick={() => setActiveTab('teachers')} className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${activeTab === 'teachers' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'hover:bg-slate-800 text-slate-300'}`}>
                                <span>👨‍🏫</span> Guru
                            </button>
                            <button onClick={() => setActiveTab('gallery')} className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 ${activeTab === 'gallery' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'hover:bg-slate-800 text-slate-300'}`}>
                                <span>📸</span> Galeri
                            </button>
                        </nav>
                    )}

                    <div className="p-4 border-t border-slate-700">
                        <button onClick={onClose} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-full px-4 py-2 hover:bg-red-500/10 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Keluar
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-grow bg-slate-50 overflow-y-auto p-8">
                    {!isAuthenticated ? (
                        <div className="h-full flex flex-col items-center justify-center">
                            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border border-slate-100">
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
                            {/* --- TAB: DASHBOARD --- */}
                            {activeTab === 'dashboard' && (
                                <div className="animate-in fade-in duration-500">
                                    <h2 className="text-3xl font-bold mb-2 text-slate-800">Selamat Datang, Admin! 👋</h2>
                                    <p className="text-slate-500 mb-8">Ringkasan data website sekolah saat ini.</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Card 1: Berita */}
                                        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-lg shadow-emerald-500/20 text-white relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                                            <div className="relative z-10">
                                                <h3 className="text-emerald-100 text-sm font-bold uppercase tracking-wider mb-1">Total Berita</h3>
                                                <p className="text-5xl font-black">{newsData.length}</p>
                                                <div className="mt-4 pt-4 border-t border-white/20 flex items-center text-sm font-medium text-emerald-50">
                                                    <span>Terakhir update: Hari ini</span>
                                                </div>
                                            </div>
                                            <div className="absolute -right-4 -bottom-4 text-white/10 text-9xl group-hover:scale-110 transition-transform duration-500">📰</div>
                                        </div>

                                        {/* Card 2: Guru */}
                                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-lg shadow-blue-500/20 text-white relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                                            <div className="relative z-10">
                                                <h3 className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-1">Total Guru</h3>
                                                <p className="text-5xl font-black">{teachersData.length}</p>
                                                <div className="mt-4 pt-4 border-t border-white/20 flex items-center text-sm font-medium text-blue-50">
                                                    <span>Data aktif</span>
                                                </div>
                                            </div>
                                            <div className="absolute -right-4 -bottom-4 text-white/10 text-9xl group-hover:scale-110 transition-transform duration-500">👨‍🏫</div>
                                        </div>

                                        {/* Card 3: Galeri */}
                                        <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-6 rounded-2xl shadow-lg shadow-amber-500/20 text-white relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                                            <div className="relative z-10">
                                                <h3 className="text-amber-100 text-sm font-bold uppercase tracking-wider mb-1">Foto Galeri</h3>
                                                <p className="text-5xl font-black">{galleryData.length}</p>
                                                <div className="mt-4 pt-4 border-t border-white/20 flex items-center text-sm font-medium text-amber-50">
                                                    <span>Dokumentasi kegiatan</span>
                                                </div>
                                            </div>
                                            <div className="absolute -right-4 -bottom-4 text-white/10 text-9xl group-hover:scale-110 transition-transform duration-500">📸</div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                        <h3 className="font-bold text-slate-800 mb-4">Akses Cepat</h3>
                                        <div className="flex gap-4">
                                            <button onClick={() => setActiveTab('news')} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-sm font-bold transition-colors">
                                                + Tulis Berita
                                            </button>
                                            <button onClick={() => setActiveTab('gallery')} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 text-sm font-bold transition-colors">
                                                + Upload Foto
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- TAB: BERITA --- */}
                            {activeTab === 'news' && (
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold">Kelola Berita</h2>
                                        <button 
                                            onClick={() => setEditingNews({ title: '', date: '', category: 'Pengumuman', summary: '', content: '', image: '' })}
                                            className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
                                        >
                                            + Tambah Berita
                                        </button>
                                    </div>

                                    {editingNews && (
                                        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-slate-200">
                                            <h3 className="font-bold mb-4">{editingNews.id ? 'Edit Berita' : 'Tambah Berita Baru'}</h3>
                                            <form onSubmit={handleSaveNews} className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Judul</label>
                                                        <input 
                                                            type="text" 
                                                            value={editingNews.title} 
                                                            onChange={e => setEditingNews({...editingNews, title: e.target.value})}
                                                            className="w-full border rounded p-2" required 
                                                            placeholder="Contoh: Kegiatan Maulid Nabi 2025"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Tanggal</label>
                                                        <input 
                                                            type="text" 
                                                            value={editingNews.date} 
                                                            onChange={e => setEditingNews({...editingNews, date: e.target.value})}
                                                            className="w-full border rounded p-2" placeholder="Contoh: 12 Mei 2025" required 
                                                        />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Kategori</label>
                                                        <select 
                                                            value={editingNews.category} 
                                                            onChange={e => setEditingNews({...editingNews, category: e.target.value})}
                                                            className="w-full border rounded p-2"
                                                        >
                                                            <option value="Pengumuman">Pengumuman</option>
                                                            <option value="Prestasi">Prestasi</option>
                                                            <option value="Kegiatan">Kegiatan</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                         <label className="block text-sm font-medium mb-1">Upload Foto (Wajib untuk AI)</label>
                                                         <input 
                                                            type="file" 
                                                            accept="image/*"
                                                            onChange={(e) => handleImageUpload(e, 'image', setEditingNews, editingNews)}
                                                            className="w-full text-sm"
                                                         />
                                                         {compressing && <span className="text-xs text-brand-primary font-bold animate-pulse">Sedang mengompres gambar...</span>}
                                                    </div>
                                                </div>

                                                {/* AI GENERATION BUTTON */}
                                                <div className="flex justify-end border-b border-slate-100 pb-4">
                                                    <button
                                                        type="button"
                                                        onClick={handleGenerateAI}
                                                        disabled={isGeneratingAI || compressing || !editingNews.title || !editingNews.image}
                                                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
                                                    >
                                                        {isGeneratingAI ? (
                                                            <>
                                                                <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></span>
                                                                <span>Sedang Menulis...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span>✨</span>
                                                                <span>Buat Isi Berita dengan AI</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium mb-1">Ringkasan (Muncul di Depan)</label>
                                                    <textarea 
                                                        value={editingNews.summary} 
                                                        onChange={e => setEditingNews({...editingNews, summary: e.target.value})}
                                                        className="w-full border rounded p-2 h-20" required 
                                                        placeholder="Ringkasan singkat tentang berita..."
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">Isi Berita Lengkap</label>
                                                    <textarea 
                                                        value={editingNews.content || ''} 
                                                        onChange={e => setEditingNews({...editingNews, content: e.target.value})}
                                                        className="w-full border rounded p-2 h-40" 
                                                        placeholder="Tulis isi berita lengkap di sini (atau gunakan tombol AI di atas)..."
                                                    />
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <button type="button" onClick={() => setEditingNews(null)} className="px-4 py-2 text-slate-500">Batal</button>
                                                    <button 
                                                        type="submit" 
                                                        disabled={loading || compressing || isGeneratingAI}
                                                        className="bg-brand-primary text-white px-6 py-2 rounded hover:bg-brand-dark disabled:opacity-50"
                                                    >
                                                        {loading ? 'Menyimpan...' : compressing ? 'Memproses Gambar...' : 'Simpan'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        {newsData.map(news => (
                                            <div key={news.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 flex items-center gap-4">
                                                <img src={news.image} alt="" className="w-16 h-16 object-cover rounded-md bg-slate-100" />
                                                <div className="flex-grow">
                                                    <h4 className="font-bold">{news.title}</h4>
                                                    <p className="text-xs text-slate-500">{news.date} • {news.category}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => setEditingNews(news)} className="text-blue-500 text-sm hover:underline">Edit</button>
                                                    <button onClick={() => handleDeleteNews(news.id)} className="text-red-500 text-sm hover:underline">Hapus</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* --- TAB: GURU --- */}
                            {activeTab === 'teachers' && (
                                <div>
                                     <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold">Data Guru</h2>
                                        <button 
                                            onClick={() => setEditingTeacher({ name: '', role: '', image: '' })}
                                            className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
                                        >
                                            + Tambah Guru
                                        </button>
                                    </div>

                                    {editingTeacher && (
                                        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-slate-200">
                                             <h3 className="font-bold mb-4">{editingTeacher.id ? 'Edit Guru' : 'Tambah Guru'}</h3>
                                             <form onSubmit={handleSaveTeacher} className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Nama Lengkap & Gelar</label>
                                                        <input 
                                                            type="text" 
                                                            value={editingTeacher.name} 
                                                            onChange={e => setEditingTeacher({...editingTeacher, name: e.target.value})}
                                                            className="w-full border rounded p-2" required 
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1">Jabatan</label>
                                                        <input 
                                                            type="text" 
                                                            value={editingTeacher.role} 
                                                            onChange={e => setEditingTeacher({...editingTeacher, role: e.target.value})}
                                                            className="w-full border rounded p-2" required 
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                     <label className="block text-sm font-medium mb-1">Foto Profil</label>
                                                     <input 
                                                        type="file" 
                                                        accept="image/*"
                                                        onChange={(e) => handleImageUpload(e, 'image', setEditingTeacher, editingTeacher)}
                                                        className="w-full text-sm"
                                                     />
                                                     {compressing && <span className="text-xs text-brand-primary font-bold animate-pulse">Sedang mengompres gambar...</span>}
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <button type="button" onClick={() => setEditingTeacher(null)} className="px-4 py-2 text-slate-500">Batal</button>
                                                    <button 
                                                        type="submit" 
                                                        disabled={loading || compressing}
                                                        className="bg-brand-primary text-white px-6 py-2 rounded hover:bg-brand-dark disabled:opacity-50"
                                                    >
                                                        {loading ? 'Menyimpan...' : compressing ? 'Memproses Gambar...' : 'Simpan'}
                                                    </button>
                                                </div>
                                             </form>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {teachersData.map(teacher => (
                                            <div key={teacher.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 flex items-center gap-4">
                                                <img src={teacher.image} alt="" className="w-12 h-12 object-cover rounded-full bg-slate-100" />
                                                <div className="flex-grow">
                                                    <h4 className="font-bold">{teacher.name}</h4>
                                                    <p className="text-xs text-slate-500">{teacher.role}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => setEditingTeacher(teacher)} className="text-blue-500 text-sm">Edit</button>
                                                    <button onClick={() => handleDeleteTeacher(teacher.id)} className="text-red-500 text-sm">Hapus</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                             {/* --- TAB: GALERI --- */}
                             {activeTab === 'gallery' && (
                                <div>
                                     <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold">Galeri Foto</h2>
                                        <button 
                                            onClick={() => setEditingGallery({ caption: '', category: 'Kegiatan', src: '' })}
                                            className="bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors"
                                        >
                                            + Tambah Foto
                                        </button>
                                    </div>

                                    {editingGallery && (
                                        <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-slate-200">
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
                                                     <label className="block text-sm font-medium mb-1">Upload Foto</label>
                                                     <input 
                                                        type="file" 
                                                        accept="image/*"
                                                        onChange={(e) => handleImageUpload(e, 'src', setEditingGallery, editingGallery)}
                                                        className="w-full text-sm"
                                                     />
                                                     {compressing && <span className="text-xs text-brand-primary font-bold animate-pulse">Sedang mengompres gambar...</span>}
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <button type="button" onClick={() => setEditingGallery(null)} className="px-4 py-2 text-slate-500">Batal</button>
                                                    <button 
                                                        type="submit" 
                                                        disabled={loading || compressing}
                                                        className="bg-brand-primary text-white px-6 py-2 rounded hover:bg-brand-dark disabled:opacity-50"
                                                    >
                                                        {loading ? 'Menyimpan...' : compressing ? 'Memproses Gambar...' : 'Simpan'}
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {galleryData.map(item => (
                                            <div key={item.id} className="group relative rounded-lg overflow-hidden aspect-square border border-slate-200">
                                                <img src={item.src} alt={item.caption} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 text-white">
                                                    <p className="text-xs font-bold truncate">{item.caption}</p>
                                                    <div className="flex gap-2 mt-2 justify-end">
                                                        <button onClick={() => handleDeleteGallery(item.id)} className="text-xs bg-red-500 px-2 py-1 rounded">Hapus</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* --- TAB: IDENTITAS --- */}
                            {activeTab === 'identity' && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6">Identitas Sekolah</h2>
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Nama Sekolah</label>
                                                <input 
                                                    type="text" 
                                                    value={schoolProfile.name} 
                                                    onChange={e => setSchoolProfile({...schoolProfile, name: e.target.value})}
                                                    className="w-full border rounded p-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">No Telepon</label>
                                                <input 
                                                    type="text" 
                                                    value={schoolProfile.phone} 
                                                    onChange={e => setSchoolProfile({...schoolProfile, phone: e.target.value})}
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
