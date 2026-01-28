
import React, { useState } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { SchoolProfile } from '../types';

interface SuggestionSectionProps {
  schoolProfile: SchoolProfile;
}

const SuggestionSection: React.FC<SuggestionSectionProps> = ({ schoolProfile }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'Saran',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) {
      alert("Nama dan Pesan wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      // 1. Simpan ke Firebase (Agar Admin bisa baca di Dashboard)
      await addDoc(collection(db, "suggestions"), {
        ...formData,
        date: new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        timestamp: new Date(), // for sorting
        isRead: false
      });

      // 2. Trigger Email Client (Agar terkirim ke email sekolah)
      const subject = `[Website Sekolah] ${formData.type} dari ${formData.name}`;
      const body = `Nama Pengirim: ${formData.name}\nKontak: ${formData.email}\nJenis: ${formData.type}\n\nIsi Pesan:\n${formData.message}`;
      
      const mailtoLink = `mailto:${schoolProfile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Reset form
      setFormData({ name: '', email: '', type: 'Saran', message: '' });
      
      // PENTING: Beritahu user dengan jelas
      alert("Pesan tersimpan di sistem Database Sekolah!\n\nSelanjutnya, aplikasi EMAIL Anda akan terbuka otomatis. Mohon tekan tombol 'KIRIM' (SEND) di aplikasi email tersebut agar pesan sampai ke Inbox Email Sekolah.");
      
      // Buka email client
      window.location.href = mailtoLink;

    } catch (error) {
      console.error("Error sending suggestion:", error);
      alert("Gagal menyimpan saran. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-white relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] opacity-5"></div>
      
      <div className="container mx-auto px-4 relative z-10 max-w-4xl">
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100 flex flex-col md:flex-row gap-12 items-center">
          
          {/* Left Side: Text */}
          <div className="md:w-1/2">
            <span className="inline-block px-3 py-1 bg-brand-light text-brand-primary text-xs font-bold rounded-full mb-4">
              Kotak Suara Sekolah
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Kritik & Saran
            </h2>
            <p className="text-slate-500 mb-6 leading-relaxed">
              Kami sangat menghargai masukan Anda demi kemajuan sekolah. Silakan sampaikan kritik, saran, atau pertanyaan Anda. Pesan akan tersimpan di sistem admin kami.
            </p>
            
            <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">📧</div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Email Sekolah</p>
                        <p className="font-bold text-slate-700">{schoolProfile.email}</p>
                    </div>
                </div>
                {schoolProfile.phone && (
                  <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                      <div className="w-10 h-10 bg-green-50 text-green-500 rounded-full flex items-center justify-center">📞</div>
                      <div>
                          <p className="text-xs text-slate-400 font-bold uppercase">Telepon</p>
                          <p className="font-bold text-slate-700">{schoolProfile.phone}</p>
                      </div>
                  </div>
                )}
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="md:w-1/2 w-full">
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Nama Lengkap</label>
                    <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                        placeholder="Nama Anda (Wali Murid/Umum)"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Email / No. HP</label>
                    <input 
                        type="text" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                        placeholder="Agar kami bisa membalas (Opsional)"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Jenis Pesan</label>
                    <select 
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 bg-white"
                    >
                        <option value="Saran">💡 Saran</option>
                        <option value="Kritik">⚠️ Kritik</option>
                        <option value="Pertanyaan">❓ Pertanyaan</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Isi Pesan</label>
                    <textarea 
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 h-32 resize-none"
                        placeholder="Tuliskan masukan Anda dengan sopan..."
                    ></textarea>
                </div>
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-brand-primary text-white font-bold py-3 rounded-xl hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/30 flex items-center justify-center gap-2"
                >
                    {loading ? 'Mengirim...' : (
                        <>
                            <span>Kirim Masukan</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </>
                    )}
                </button>
                <p className="text-center text-[10px] text-slate-400">
                    *Pesan akan otomatis masuk ke Admin Panel.
                </p>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SuggestionSection;
