
import React, { useState, useRef } from 'react';
import { NewsItem } from '../types';

interface NewsSectionProps {
  newsItems: NewsItem[];
  onNewsClick: (news: NewsItem) => void;
}

const NewsSection: React.FC<NewsSectionProps> = ({ newsItems, onNewsClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 1.5 : clientWidth / 1.5;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="informasi" className="py-20 bg-slate-50 relative overflow-hidden">
      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-multiply"></div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header with Controls */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
            <div className="max-w-2xl">
                <span className="text-brand-primary font-bold tracking-widest uppercase text-sm">Update Terkini</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mt-1">Kabar Sekolah</h2>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex gap-2">
                <button 
                    onClick={() => scroll('left')}
                    disabled={!canScrollLeft}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${!canScrollLeft ? 'border-slate-200 text-slate-300 cursor-not-allowed' : 'border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white shadow-md'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button 
                    onClick={() => scroll('right')}
                    disabled={!canScrollRight}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${!canScrollRight ? 'border-slate-200 text-slate-300 cursor-not-allowed' : 'border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white shadow-md'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>

        {/* Carousel Container */}
        {newsItems.length > 0 ? (
            <div 
                ref={scrollRef}
                onScroll={checkScrollButtons}
                className="flex gap-6 overflow-x-auto pb-8 pt-2 px-1 snap-x snap-mandatory no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {newsItems.map((item) => (
                    <article 
                        key={item.id} 
                        onClick={() => onNewsClick(item)}
                        className="snap-start shrink-0 w-[85vw] sm:w-[350px] md:w-[400px] bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer flex flex-col h-full"
                    >
                        <div className="relative h-48 overflow-hidden">
                            <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="inline-block px-3 py-1 bg-brand-accent/90 backdrop-blur-md text-brand-dark text-xs font-bold rounded-lg shadow-sm">
                                    {item.category}
                                </span>
                            </div>
                        </div>
                        
                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="font-display text-xl font-bold text-slate-800 mb-3 leading-snug group-hover:text-brand-primary transition-colors line-clamp-2">
                                {item.title}
                            </h3>
                            <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-grow">
                                {item.summary}
                            </p>
                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                                <span className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    {item.date}
                                </span>
                                <span className="font-bold text-brand-blue group-hover:translate-x-1 transition-transform">Baca Selengkapnya →</span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        ) : (
             <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400">Belum ada berita yang tersedia.</p>
            </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
