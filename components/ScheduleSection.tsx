
import React, { useState, useEffect, useRef } from 'react';
import { ClassSchedule } from '../types';

interface ScheduleSectionProps {
  schedules: ClassSchedule[];
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({ schedules }) => {
  const [activeClass, setActiveClass] = useState(schedules[0]?.className || "");
  
  // Scroll Logic
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    if (schedules.length > 0 && !schedules.find(s => s.className === activeClass)) {
        setActiveClass(schedules[0].className);
    }
  }, [schedules, activeClass]);

  // Reset scroll when class changes
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        setCanScrollLeft(false);
        setCanScrollRight(true);
    }
  }, [activeClass]);

  const currentSchedule = schedules.find(s => s.className === activeClass);

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
    <section id="jadwal" className="py-16 bg-white relative border-b border-slate-100">
      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        
        {/* Header & Controls Container */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            
            {/* Title & Class Selector */}
            <div className="flex-1">
                <h2 className="font-display text-3xl font-bold text-slate-800 mb-4">Jadwal Pelajaran</h2>
                
                {/* Compact Class Tabs */}
                <div className="flex flex-wrap gap-2">
                    {schedules.map((schedule) => (
                        <button
                            key={schedule.className}
                            onClick={() => setActiveClass(schedule.className)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border ${
                                activeClass === schedule.className
                                ? 'bg-brand-dark text-white border-brand-dark shadow-md'
                                : 'bg-white text-slate-500 border-slate-200 hover:border-brand-primary hover:text-brand-primary'
                            }`}
                        >
                            {schedule.className}
                        </button>
                    ))}
                </div>
            </div>

            {/* Scroll Navigation */}
            <div className="flex gap-2 self-end md:self-auto">
                <button 
                    onClick={() => scroll('left')}
                    disabled={!canScrollLeft}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${!canScrollLeft ? 'border-slate-100 text-slate-200 cursor-not-allowed' : 'border-slate-300 text-slate-600 hover:bg-slate-800 hover:text-white hover:border-slate-800'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button 
                    onClick={() => scroll('right')}
                    disabled={!canScrollRight}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${!canScrollRight ? 'border-slate-100 text-slate-200 cursor-not-allowed' : 'border-slate-300 text-slate-600 hover:bg-slate-800 hover:text-white hover:border-slate-800'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>

        {/* Horizontal Slider Content */}
        <div 
            ref={scrollRef}
            onScroll={checkScrollButtons}
            className="flex gap-4 overflow-x-auto pb-4 px-1 snap-x snap-mandatory no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            {currentSchedule?.days.map((day, idx) => (
                <div 
                    key={day.dayName} 
                    className="snap-start shrink-0 w-[260px] bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-brand-primary/30 transition-all duration-300 flex flex-col h-full min-h-[220px]"
                >
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
                        <span className="font-display text-lg font-bold text-slate-800">{day.dayName}</span>
                        <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100">
                           Hari ke-{idx + 1}
                        </span>
                    </div>
                    
                    <div className="space-y-3 flex-grow overflow-y-auto max-h-[200px] pr-1 custom-scrollbar">
                        {day.schedule.length > 0 ? day.schedule.map((item, i) => (
                            <div key={i} className="group">
                                <p className="text-[10px] font-bold text-slate-400 mb-0.5">{item.time}</p>
                                <p className="text-sm font-semibold text-slate-700 leading-tight group-hover:text-brand-primary transition-colors">{item.subject}</p>
                            </div>
                        )) : (
                            <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
                                Tidak ada jadwal
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;
