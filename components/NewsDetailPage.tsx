
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
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 font-body animate-in fade-in duration-500">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Navigation */}
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-slate-500 hover:text-brand-primary font-bold mb-8 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-brand-primary transition-colors shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          <span>Kembali ke Beranda</span>
        </button>

        {/* Article Header */}
        <div className="bg-white rounded-[2rem] p-2 shadow-sm border border-slate-100 mb-10">
            <div className="relative aspect-video md:aspect-[21/9] rounded-[1.5rem] overflow-hidden">
                <img 
                    src={news.image} 
                    alt={news.title} 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full">
                    <span className="inline-block px-3 py-1 bg-brand-accent text-brand-dark text-xs font-bold rounded-lg mb-4 backdrop-blur-md">
                        {news.category}
                    </span>
                    <h1 className="text-2xl md:text-4xl lg:text-5xl font-display font-bold text-white leading-tight mb-4 drop-shadow-md">
                        {news.title}
                    </h1>
                    <div className="flex items-center gap-4 text-white/80 text-sm">
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            {news.date}
                        </span>
                        <span>•</span>
                        <span>Oleh Admin Sekolah</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
            <div className="prose prose-lg prose-slate max-w-none prose-headings:font-display prose-headings:text-brand-dark prose-a:text-brand-primary hover:prose-a:text-brand-dark prose-img:rounded-xl">
                {/* Render content paragraphs. If content is missing, fallback to summary. */}
                {(news.content || news.summary).split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4 leading-relaxed text-slate-600">
                        {paragraph}
                    </p>
                ))}
            </div>

            {/* Share / Tags Footer */}
            <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
                <div className="text-sm text-slate-400">
                    Tag: <span className="text-brand-primary font-bold">#{news.category.toLowerCase()}</span> #sdntempurejo1kediri
                </div>
                <div className="flex gap-2">
                    <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-green-50 hover:text-green-600 transition-colors">
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    </button>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default NewsDetailPage;
