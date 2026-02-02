
import React, { useState, useEffect, useRef } from 'react';
import { GalleryImage } from '../types';

interface GallerySectionProps {
  galleryItems: GalleryImage[];
}

const GallerySection: React.FC<GallerySectionProps> = ({ galleryItems }) => {
  const [filter, setFilter] = useState('Semua');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const categories = ['Semua', ...Array.from(new Set(galleryItems.map(item => item.category)))];

  const filteredImages = filter === 'Semua' 
    ? galleryItems 
    : galleryItems.filter(img => img.category === filter);

  // Reset scroll when filter changes
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'instant' });
        checkScrollButtons();
    }
  }, [filter]);

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
      const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Helper to get YouTube ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Handle locking body scroll and Escape key for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };

    if (selectedImage) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage]);

  return (
    <section id="galeri" className="py-20 bg-brand-light relative">
      <div className="container mx-auto px-4">
        
        {/* Header & Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-8 gap-6">
            <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-4">Galeri Aktivitas</h2>
                
                {/* Modern Filter Pills */}
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                                filter === cat
                                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30'
                                : 'bg-white text-slate-500 hover:bg-white hover:text-brand-primary shadow-sm border border-slate-100'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
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

        {/* Horizontal Slider */}
        <div 
            ref={scrollRef}
            onScroll={checkScrollButtons}
            className="flex gap-4 overflow-x-auto pb-6 px-1 snap-x snap-mandatory no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            {filteredImages.length > 0 ? filteredImages.map((image) => {
                const isVideo = image.type === 'video';
                const youtubeId = isVideo ? getYouTubeId(image.src) : null;
                const thumbnailUrl = isVideo && youtubeId 
                    ? `https://img.youtube.com/vi/${youtubeId}/0.jpg` 
                    : image.src;

                return (
                    <div 
                        key={image.id} 
                        className="snap-start shrink-0 w-[80vw] sm:w-[320px] md:w-[400px] aspect-[4/3] relative group rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 bg-slate-200"
                        onClick={() => setSelectedImage(image)}
                        onKeyDown={(e) => e.key === 'Enter' && setSelectedImage(image)}
                        tabIndex={0}
                        role="button"
                    >
                        <img 
                            src={thumbnailUrl} 
                            alt={image.caption} 
                            className={`w-full h-full object-cover transform transition duration-700 group-hover:scale-110 ${isVideo ? 'opacity-80' : ''}`}
                            loading="lazy"
                        />
                        
                        {/* Play Icon for Videos */}
                        {isVideo && (
                            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/60 shadow-lg group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                </div>
                            </div>
                        )}

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                <span className={`inline-block px-2 py-1 text-[10px] font-bold rounded uppercase mb-2 ${isVideo ? 'bg-red-500 text-white' : 'bg-brand-accent/90 text-brand-dark'}`}>
                                    {isVideo ? 'VIDEO' : image.category}
                                </span>
                                <p className="font-bold text-white text-lg leading-tight">{image.caption}</p>
                            </div>
                        </div>
                    </div>
                );
            }) : (
                <div className="w-full py-10 text-center text-slate-400 italic">
                    Tidak ada galeri untuk kategori ini.
                </div>
            )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
            className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-dark/95 backdrop-blur-md p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedImage(null)}
        >
            <div 
                className="relative max-w-5xl w-full flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-12 right-0 md:right-4 text-white/60 hover:text-white transition-colors p-2 bg-white/10 rounded-full hover:bg-white/20"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                {selectedImage.type === 'video' ? (
                    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10">
                         {getYouTubeId(selectedImage.src) ? (
                             <iframe 
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${getYouTubeId(selectedImage.src)}?autoplay=1`}
                                title={selectedImage.caption}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                             ></iframe>
                         ) : (
                             // Fallback for direct MP4 links (less common given storage limits, but good to have)
                             <video controls autoPlay className="w-full h-full">
                                 <source src={selectedImage.src} type="video/mp4" />
                                 Browser Anda tidak mendukung tag video.
                             </video>
                         )}
                    </div>
                ) : (
                    <img 
                        src={selectedImage.src} 
                        alt={selectedImage.caption} 
                        className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/10"
                    />
                )}
                
                <div className="mt-6 text-center">
                    <h3 className="text-white text-xl md:text-2xl font-display font-bold mb-2">
                        {selectedImage.caption}
                    </h3>
                    <p className="text-brand-accent text-sm font-semibold uppercase tracking-widest">{selectedImage.category}</p>
                </div>
            </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
