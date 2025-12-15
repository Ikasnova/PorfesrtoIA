import React from 'react';
import { Unit } from '../types';
import { CheckCircle2, Circle, Lock, ChevronDown, ChevronRight, PlayCircle } from 'lucide-react';

interface Props {
  units: Unit[];
  currentUnitIdx: number;
  currentLessonIdx: number;
  completedLessons: Set<string>;
  onSelectLesson: (uIdx: number, lIdx: number) => void;
  showFinal: boolean;
  onSelectFinal: () => void;
}

const Sidebar: React.FC<Props> = ({ 
  units, 
  currentUnitIdx, 
  currentLessonIdx, 
  completedLessons, 
  onSelectLesson,
  showFinal,
  onSelectFinal
}) => {
  const [expandedUnits, setExpandedUnits] = React.useState<Set<number>>(new Set([0]));

  const toggleUnit = (idx: number) => {
    const newExpanded = new Set(expandedUnits);
    if (newExpanded.has(idx)) {
      newExpanded.delete(idx);
    } else {
      newExpanded.add(idx);
    }
    setExpandedUnits(newExpanded);
  };

  return (
    <div className="w-full md:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full overflow-y-auto flex flex-col transition-colors duration-300 font-sans">
      
      {/* Syllabus Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-sm font-bold text-brand-secondary dark:text-slate-500 uppercase tracking-widest">
          Plan de Estudios
        </h2>
      </div>
      
      <div className="flex-1 py-4 space-y-1">
        {units.map((unit, uIdx) => {
          const isExpanded = expandedUnits.has(uIdx);
          const isActiveUnit = currentUnitIdx === uIdx && !showFinal;
          const lessonsCompletedCount = unit.lessons.filter((_, i) => completedLessons.has(`${uIdx}-${i}`)).length;
          const isUnitCompleted = lessonsCompletedCount === unit.lessons.length;

          return (
            <div key={uIdx} className="mb-2">
              <button
                onClick={() => toggleUnit(uIdx)}
                className={`w-full text-left px-6 py-4 flex items-start gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group
                  ${isActiveUnit ? 'bg-slate-50 dark:bg-slate-800/30' : ''}`}
              >
                <div className="mt-1 text-brand-secondary dark:text-slate-500 group-hover:text-brand-primary dark:group-hover:text-brand-accent">
                  {isExpanded ? <ChevronDown size={18} strokeWidth={2.5} /> : <ChevronRight size={18} strokeWidth={2.5} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-base font-bold truncate uppercase tracking-tight ${isActiveUnit ? 'text-brand-primary dark:text-brand-accent' : 'text-brand-dark dark:text-slate-200'}`}>
                      Unidad {uIdx + 1}
                    </h3>
                    {isUnitCompleted && <CheckCircle2 size={18} className="text-brand-accent" />}
                  </div>
                  <p className="text-sm text-brand-secondary dark:text-slate-400 mt-1 line-clamp-1 font-medium">{unit.title}</p>
                </div>
              </button>

              {isExpanded && (
                <div className="relative ml-6 border-l-2 border-slate-100 dark:border-slate-800 my-1 py-1 space-y-1">
                  {unit.lessons.map((lesson, lIdx) => {
                    const lessonId = `${uIdx}-${lIdx}`;
                    const isCompleted = completedLessons.has(lessonId);
                    const isCurrent = isActiveUnit && currentLessonIdx === lIdx;

                    return (
                      <button
                        key={lIdx}
                        onClick={() => onSelectLesson(uIdx, lIdx)}
                        className={`w-full text-left pl-7 pr-5 py-3.5 flex items-center gap-3 text-base transition-all relative
                          ${isCurrent 
                            ? 'text-brand-primary dark:text-brand-accent font-bold bg-slate-50/50 dark:bg-slate-800/20' 
                            : 'text-brand-secondary dark:text-slate-400 hover:text-brand-dark dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                      >
                        {isCurrent && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-primary rounded-r-full" />
                        )}

                        {isCompleted ? (
                          <CheckCircle2 size={20} className="text-brand-accent flex-shrink-0" />
                        ) : isCurrent ? (
                          <PlayCircle size={20} className="text-brand-primary dark:text-brand-accent flex-shrink-0 fill-brand-primary/10 dark:fill-brand-accent/10" />
                        ) : (
                          <Circle size={20} className="text-slate-300 dark:text-slate-600 flex-shrink-0" />
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <div className="mt-10 px-6 pb-10">
          <button
            onClick={onSelectFinal}
            className={`w-full group flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-300 ${showFinal 
              ? 'border-brand-primary bg-brand-primary/5 dark:bg-brand-primary/10 dark:border-brand-primary' 
              : 'border-slate-200 dark:border-slate-700 bg-transparent hover:border-brand-secondary dark:hover:border-slate-600'}`}
          >
            <div className={`p-3 rounded-lg transition-colors ${showFinal 
              ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30' 
              : 'bg-slate-100 dark:bg-slate-800 text-brand-secondary dark:text-slate-500 group-hover:text-brand-primary'}`}>
              <Lock size={24} />
            </div>
            <div className="text-left">
              <span className={`block font-bold text-base uppercase tracking-wide ${showFinal ? 'text-brand-primary dark:text-white' : 'text-brand-dark dark:text-slate-300'}`}>Evaluación Final</span>
              <span className="text-sm text-brand-secondary dark:text-slate-400">Examen y Proyectos</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;