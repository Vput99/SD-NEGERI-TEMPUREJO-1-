
import React from 'react';
import { NewsItem } from '../types';

interface NewsSectionProps {
  newsItems: NewsItem[];
  onNewsClick: (news: NewsItem) => void;
}

const NewsSection: React.FC<NewsSectionProps> = ({ newsItems, onNewsClick }) => {
  // Ambil berita utama (terbaru) dan berita sampingan
  const featuredNews = newsItems[0];
  const sideNews = newsItems.slice(1, 4); // Ambil maks 3 berita lainnya

  return (
    <section id="informasi" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-multiply"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="max-w-2xl">
                <span className="text-brand-primary font-bold tracking-widest uppercase text-sm">Update Terkini</span>
                <h2 className="font-display text-4xl font-bold text-brand-dark mt-2">Kabar Sekolah</h2>
            </div>
             <button className="hidden md:inline-flex px-6 py-2 rounded-full border border-slate-300 font-bold text-slate-600 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all text-sm">
                Lihat Semua Berita
            </button>
        </div>

        {newsItems.length > 0 ? (
            <div className="grid lg:grid-cols-12 gap-8">
                {/* 1. FEATURED NEWS (LEFT - BIG) */}
                <div className="lg:col-span-7">
                    <article 
                        onClick={() => onNewsClick(featuredNews)}
                        className="relative h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden group cursor-pointer shadow-xl transition-transform hover:-translate-y-1"
                    >
                        <img 
                            src={featuredNews.image} 
                            alt={featuredNews.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                        
                        <div className="absolute bottom-0 left-0 p-8 md:p-10">
                            <span className="inline-block px-3 py-1 bg-brand-accent text-brand-dark text-xs font-bold rounded-lg mb-4">
                                {featuredNews.category}
                            </span>
                            <h3 className="font-display text-2xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-brand-light transition-colors">
                                {featuredNews.title}
                            </h3>
                            <p className="text-slate-200 line-clamp-2 md:line-clamp-none max-w-xl mb-6 text-sm md:text-base">
                                {featuredNews.summary}
                            </p>
                            <span className="text-slate-400 text-sm flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                {featuredNews.date}
                            </span>
                        </div>
                    </article>
                </div>

                {/* 2. SIDE NEWS (RIGHT - LIST) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    {sideNews.map((item) => (
                        <article 
                            key={item.id} 
                            onClick={() => onNewsClick(item)}
                            className="flex gap-4 p-4 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all border border-slate-100 group cursor-pointer h-full hover:border-brand-primary/30"
                        >
                            <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-2xl overflow-hidden">
                                <img 
                                    src={item.image} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>
                            <div className="flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="w-2 h-2 rounded-full bg-brand-primary"></span>
                                    <span className="text-xs font-bold text-slate-400 uppercase">{item.category}</span>
                                </div>
                                <h4 className="font-display font-bold text-lg text-brand-dark leading-snug mb-2 group-hover:text-brand-primary transition-colors line-clamp-2">
                                    {item.title}
                                </h4>
                                <span className="text-xs text-slate-400 mt-auto">{item.date}</span>
                            </div>
                        </article>
                    ))}
                    
                    {/* View All Button for Mobile */}
                    <button className="md:hidden block w-full text-center py-4 rounded-xl bg-white border border-slate-200 font-bold text-brand-primary">
                        Lihat Arsip Berita
                    </button>
                </div>
            </div>
        ) : (
             <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400">Belum ada berita yang tersedia.</p>
            </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
