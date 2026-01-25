
import React, { useState, useEffect } from 'react';
import { GalleryImage } from '../types';

interface GallerySectionProps {
  galleryItems: GalleryImage[];
}

const GallerySection: React.FC<GallerySectionProps> = ({ galleryItems }) => {
  const [filter, setFilter] = useState('Semua');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  
  const categories = ['Semua', ...Array.from(new Set(galleryItems.map(item => item.category)))];

  const filteredImages = filter === 'Semua' 
    ? galleryItems 
    : galleryItems.filter(img => img.category === filter);

  // Handle locking body scroll and Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
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
    <section id="galeri" className="py-24 bg-brand-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-brand-dark mb-4">Galeri Aktivitas</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Momen-momen berharga dalam kegiatan belajar, ekstrakurikuler, dan lingkungan hidup.</p>
        </div>

        {/* Modern Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                        filter === cat
                        ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30'
                        : 'bg-white text-slate-500 hover:bg-white hover:text-brand-primary shadow-sm'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 px-2">
            {filteredImages.map((image) => (
                <div 
                    key={image.id} 
                    className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow duration-300"
                    onClick={() => setSelectedImage(image)}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedImage(image)}
                    tabIndex={0}
                    role="button"
                >
                    <img 
                        src={image.src} 
                        alt={image.caption} 
                        className="w-full h-auto transform transition duration-700 group-hover:scale-105"
                        loading="lazy"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <span className="inline-block px-2 py-1 bg-brand-accent/90 text-brand-dark text-[10px] font-bold rounded uppercase mb-2">
                                {image.category}
                            </span>
                            <p className="font-bold text-white text-lg leading-tight">{image.caption}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Modern Lightbox Modal */}
      {selectedImage && (
        <div 
            className="fixed inset-0 z-[60] flex items-center justify-center bg-brand-dark/95 backdrop-blur-md p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedImage(null)}
        >
            <div 
                className="relative max-w-6xl w-full flex flex-col items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-16 right-0 md:right-4 text-white/60 hover:text-white transition-colors p-2 bg-white/10 rounded-full hover:bg-white/20"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <img 
                    src={selectedImage.src} 
                    alt={selectedImage.caption} 
                    className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/10"
                />
                
                <div className="mt-6 text-center">
                    <h3 className="text-white text-2xl font-display font-bold mb-2">
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
