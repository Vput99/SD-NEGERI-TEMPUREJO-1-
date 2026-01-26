
import React, { useEffect } from 'react';
import { NewsItem } from '../types';

interface NewsDetailPageProps {
  news: NewsItem;
  onBack: () => void;
}

const NewsDetailPage: React.FC<NewsDetailPageProps> = ({ news, onBack }) => {
  
  // Scroll to top when mounted
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-paper font-serifbody text-slate-900 pt-20 pb-20 animate-in fade-in duration-500">
        
        {/* Navigation Bar (Simple) */}
        <div className="fixed top-0 left-0 right-0 bg-paper/90 backdrop-blur border-b border-slate-300 z-50 h-16 flex items-center">
            <div className="container mx-auto px-4">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-600 hover:text-black font-bold uppercase tracking-widest text-xs transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    KEMBALI KE HALAMAN UTAMA
                </button>
            </div>
        </div>

      <div className="container mx-auto px-4 max-w-5xl mt-8">
        
        {/* Newspaper Header (Masthead feel) */}
        <div className="border-b-4 border-black mb-8 pb-4 text-center">
            <div className="flex justify-between border-b border-black pb-1 mb-4 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-600 font-sans">
                <span>{news.date}</span>
                <span>Warta Tempurejo | Edisi Khusus</span>
                <span>{news.category}</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-newspaper font-black text-black leading-[0.9] uppercase tracking-tight mb-4">
                {news.title}
            </h1>
            <div className="text-sm italic text-slate-500 font-serifbody">
                Ditulis oleh <span className="font-bold text-black not-italic">Tim Redaksi Sekolah</span> — SD Negeri Tempurejo 1
            </div>
        </div>

        {/* Main Image with Newspaper styling */}
        <div className="mb-10 group">
            <div className="relative border-2 border-black p-1 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
                <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-full h-auto object-cover max-h-[600px] grayscale transition-all duration-700 group-hover:grayscale-0"
                />
            </div>
            <p className="mt-2 text-xs md:text-sm font-sans text-slate-500 border-l-2 border-black pl-2 ml-1">
                <span className="font-bold text-black uppercase">Dokumentasi:</span> {news.summary}
            </p>
        </div>

        {/* Article Content - 2 Columns Layout */}
        <div className="max-w-none">
            {/* Lead Paragraph (First paragraph bigger/bold) */}
            <div className="text-lg md:text-xl font-medium leading-relaxed mb-6 font-newspaper text-slate-800 border-b border-slate-300 pb-6 text-justify">
                {(news.content || news.summary).split('\n')[0]}
            </div>

            {/* Remaining Content in Columns */}
            <div className="columns-1 md:columns-2 gap-8 text-justify leading-loose text-slate-700 font-serifbody text-base md:text-lg">
                {(news.content || news.summary).split('\n').slice(1).map((paragraph, idx) => {
                     // Drop cap logic for the first paragraph of the main body (if it exists)
                     if (idx === 0) {
                         return (
                            <p key={idx} className="mb-6">
                                <span className="float-left text-7xl font-newspaper font-black leading-[0.8] mr-3 mt-1 text-black">
                                    {paragraph.charAt(0)}
                                </span>
                                {paragraph.slice(1)}
                            </p>
                         );
                     }
                     return (
                        <p key={idx} className="mb-6 indent-8">
                            {paragraph}
                        </p>
                     );
                })}
                 {/* Fallback if no content beyond summary */}
                 {!(news.content || news.summary).includes('\n') && (
                     <p className="italic text-slate-400 text-center py-4 border-t border-b border-slate-200 my-4">
                         (Baca selengkapnya di mading sekolah atau hubungi tata usaha untuk informasi detail.)
                     </p>
                 )}
            </div>
        </div>

        {/* Footer / End Mark */}
        <div className="flex justify-center my-12">
             <div className="text-center">
                 <span className="text-3xl text-black">***</span>
                 <p className="text-xs uppercase tracking-widest mt-2 font-sans font-bold">Terima Kasih Telah Membaca</p>
             </div>
        </div>

        {/* Related / Tags Section */}
        <div className="bg-white border-t-2 border-black p-6 mt-8 shadow-sm">
            <h3 className="font-sans font-bold uppercase text-sm mb-4 border-b border-slate-200 pb-2">Informasi Terkait</h3>
            <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 border border-slate-300 text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors cursor-pointer">
                    #{news.category}
                </span>
                <span className="px-3 py-1 border border-slate-300 text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors cursor-pointer">
                    #SDNTempurejo1
                </span>
                <span className="px-3 py-1 border border-slate-300 text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors cursor-pointer">
                    #BeritaSekolah
                </span>
            </div>
        </div>

      </div>
    </div>
  );
};

export default NewsDetailPage;
