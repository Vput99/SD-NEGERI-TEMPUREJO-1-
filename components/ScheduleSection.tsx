
import React, { useState, useEffect } from 'react';
import { ClassSchedule } from '../types';

interface ScheduleSectionProps {
  schedules: ClassSchedule[];
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({ schedules }) => {
  const [activeClass, setActiveClass] = useState(schedules[0]?.className || "");
  
  useEffect(() => {
    if (schedules.length > 0 && !schedules.find(s => s.className === activeClass)) {
        setActiveClass(schedules[0].className);
    }
  }, [schedules, activeClass]);

  const currentSchedule = schedules.find(s => s.className === activeClass);

  return (
    <section id="jadwal" className="py-24 bg-gradient-to-b from-brand-light to-white relative">
      {/* Background Leaves Decor */}
       <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
            <svg width="400" height="400" viewBox="0 0 500 500">
                <path fill="#059669" d="M344.5,41.5C189.5-23.5,60.5,130.5,41.5,231.5S-38.5,459.5,86.5,487.5s283-46,357-147S499.5,106.5,344.5,41.5Z" />
            </svg>
       </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-brand-dark mb-4">Jadwal Pembelajaran</h2>
            <p className="text-slate-600">Disiplin waktu adalah kunci keberhasilan siswa.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 bg-white p-2 rounded-full shadow-sm border border-slate-100 max-w-max mx-auto">
            {schedules.map((schedule) => (
                <button
                    key={schedule.className}
                    onClick={() => setActiveClass(schedule.className)}
                    className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                        activeClass === schedule.className
                        ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30'
                        : 'bg-transparent text-slate-500 hover:bg-slate-50'
                    }`}
                >
                    {schedule.className}
                </button>
            ))}
        </div>

        {/* Schedule Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSchedule?.days.map((day) => (
                <div key={day.dayName} className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-brand-accent/50 transition-all duration-300 group">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-dashed border-slate-100">
                        <h3 className="font-display text-2xl font-bold text-brand-dark group-hover:text-brand-primary transition-colors">
                            {day.dayName}
                        </h3>
                        <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-primary">
                            📅
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        {day.schedule.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-brand-light/50 transition-colors">
                                <div className="min-w-[80px] text-xs font-bold text-brand-primary bg-white px-2 py-1 rounded border border-brand-primary/10 text-center">
                                    {item.time.split(' - ')[0]}
                                    <span className="block text-[10px] text-slate-400 font-normal">{item.time.split(' - ')[1]}</span>
                                </div>
                                <div className="flex-grow">
                                    <h4 className="font-bold text-slate-700 text-sm leading-tight pt-0.5">{item.subject}</h4>
                                </div>
                            </div>
                        ))}
                        {day.schedule.length === 0 && (
                            <p className="text-slate-400 text-sm italic text-center py-4">Tidak ada kegiatan.</p>
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
