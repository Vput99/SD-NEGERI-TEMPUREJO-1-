
import React, { useRef, useState, useEffect } from 'react';
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

  useEffect(() => {
    checkScrollButtons();
  }, [newsItems]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth / 1.5 : clientWidth / 1.5;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="informasi" className="py-20 bg-slate-50 relative overflow-hidden font-body">
      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-multiply"></div>

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        
        {/* Header & Controls */}
        <div className="flex justify-between items-end mb-10">
            <div>
                <span className="text-brand-primary font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-2 block">
                    Kabar Sekolah
                </span>
                <h2 className="font-display text-3xl md:text-5xl font-black text-slate-800">
                    Berita Terkini
                </h2>
            </div>
            
            {/* Scroll Buttons */}
            <div className="flex gap-2">
                <button 
                    onClick={() => scroll('left')}
                    disabled={!canScrollLeft}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${!canScrollLeft ? 'border-slate-200 text-slate-300 cursor-not-allowed' : 'bg-white border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white shadow-sm'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button 
                    onClick={() => scroll('right')}
                    disabled={!canScrollRight}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${!canScrollRight ? 'border-slate-200 text-slate-300 cursor-not-allowed' : 'bg-white border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white shadow-sm'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>

        {/* Slider Content */}
        {newsItems.length > 0 ? (
            <div 
                ref={scrollRef}
                onScroll={checkScrollButtons}
                className="flex gap-6 overflow-x-auto pb-8 px-1 snap-x snap-mandatory no-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {newsItems.map((item) => (
                    <div 
                        key={item.id}
                        onClick={() => onNewsClick(item)}
                        className="snap-start shrink-0 w-[85vw] sm:w-[350px] group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-[450px]"
                    >
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden">
                            <img 
                                src={item.image} 
                                alt={item.title} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 bg-white/90 backdrop-blur text-brand-dark text-xs font-bold rounded-lg shadow-sm">
                                    {item.category}
                                </span>
                            </div>
                        </div>

                        {/* Text */}
                        <div className="p-6 flex flex-col flex-grow">
                            <div className="text-xs text-slate-400 mb-2 font-medium flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                {item.date}
                            </div>
                            <h3 className="font-display text-lg font-bold text-slate-800 mb-3 leading-snug group-hover:text-brand-primary transition-colors line-clamp-2">
                                {item.title}
                            </h3>
                            <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-grow leading-relaxed">
                                {item.summary}
                            </p>
                            <div className="mt-auto border-t border-slate-50 pt-4">
                                <span className="text-xs font-bold text-brand-blue flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Baca Selengkapnya 
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
             <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <div className="text-6xl mb-4 opacity-20">📰</div>
                <h3 className="text-xl font-bold text-slate-400">Belum ada berita yang diterbitkan.</h3>
            </div>
        )}
        
      </div>
    </section>
  );
};

export default NewsSection;
