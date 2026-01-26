
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
    <section id="jadwal" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative BG */}
       <div className="absolute inset-0 opacity-50 pointer-events-none">
            <div className="absolute top-20 right-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl"></div>
       </div>

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-slate-800 mb-4">Jadwal Pelajaran</h2>
            <p className="text-slate-500">Pilih kelas untuk melihat agenda harian.</p>
        </div>

        {/* Floating Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-16">
            <div className="bg-white p-1.5 rounded-2xl shadow-lg shadow-slate-200/50 flex flex-wrap justify-center gap-1 border border-slate-100">
                {schedules.map((schedule) => (
                    <button
                        key={schedule.className}
                        onClick={() => setActiveClass(schedule.className)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                            activeClass === schedule.className
                            ? 'bg-brand-dark text-white shadow-md'
                            : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                        {schedule.className}
                    </button>
                ))}
            </div>
        </div>

        {/* Schedule Grid - Widget Style */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {currentSchedule?.days.map((day, idx) => (
                <div 
                    key={day.dayName} 
                    className="flex flex-col bg-white rounded-3xl p-5 shadow-sm border border-slate-100 hover:shadow-xl hover:border-brand-primary/30 transition-all duration-300 group h-full"
                    style={{ animationDelay: `${idx * 100}ms` }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-display text-xl font-bold text-slate-800">{day.dayName}</span>
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                            ${idx % 2 === 0 ? 'bg-brand-light text-brand-primary' : 'bg-blue-50 text-brand-blue'}
                        `}>
                           {idx + 1}
                        </span>
                    </div>
                    
                    <div className="space-y-3 flex-grow">
                        {day.schedule.map((item, i) => (
                            <div key={i} className="relative pl-4 py-1 border-l-2 border-slate-200 group-hover:border-brand-accent transition-colors">
                                <p className="text-xs font-bold text-slate-400 mb-0.5">{item.time}</p>
                                <p className="text-sm font-semibold text-slate-700 leading-tight">{item.subject}</p>
                            </div>
                        ))}
                        {day.schedule.length === 0 && (
                            <div className="h-full flex items-center justify-center text-slate-400 text-sm italic bg-slate-50 rounded-xl min-h-[100px]">
                                Libur
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
