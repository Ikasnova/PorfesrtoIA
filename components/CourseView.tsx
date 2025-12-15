import React, { useState, useEffect } from 'react';
import { GeneratedCourse } from '../types';
import Sidebar from './Sidebar';
import LessonContent from './LessonContent';
import FinalSection from './FinalSection';
import { downloadSCORM } from '../services/scormService';
import { Layout, Menu, X, Clock, BarChart, Book, Play, Sun, Moon, Download, Package } from 'lucide-react';

interface Props {
  course: GeneratedCourse;
  onBack: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const CourseView: React.FC<Props> = ({ course, onBack, darkMode, toggleDarkMode }) => {
  const { data, sources } = course;
  
  const [currentUnitIdx, setCurrentUnitIdx] = useState(0);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Stats
  const totalUnits = data.units.length;
  const totalLessons = data.units.reduce((acc, unit) => acc + unit.lessons.length, 0);
  const completedCount = completedLessons.size;
  const progress = Math.round((completedCount / totalLessons) * 100);

  const handleNext = () => {
    const unit = data.units[currentUnitIdx];
    if (currentLessonIdx < unit.lessons.length - 1) {
      setCurrentLessonIdx(prev => prev + 1);
    } else if (currentUnitIdx < data.units.length - 1) {
      setCurrentUnitIdx(prev => prev + 1);
      setCurrentLessonIdx(0);
    } else {
      setShowFinal(true);
    }
  };

  const handlePrev = () => {
    if (showFinal) {
      setShowFinal(false);
      return;
    }
    if (currentLessonIdx > 0) {
      setCurrentLessonIdx(prev => prev - 1);
    } else if (currentUnitIdx > 0) {
      const prevUnitIdx = currentUnitIdx - 1;
      setCurrentUnitIdx(prevUnitIdx);
      setCurrentLessonIdx(data.units[prevUnitIdx].lessons.length - 1);
    }
  };

  const handleComplete = () => {
    const id = `${currentUnitIdx}-${currentLessonIdx}`;
    setCompletedLessons(prev => new Set(prev).add(id));
  };

  const handleDownloadSCORM = async () => {
    setIsExporting(true);
    try {
      await downloadSCORM(course);
    } catch (error) {
      console.error("Error creating SCORM package:", error);
      alert("Hubo un error al generar el paquete SCORM.");
    } finally {
      setIsExporting(false);
    }
  };

  // Close sidebar on mobile when navigating
  useEffect(() => {
    setSidebarOpen(false);
  }, [currentUnitIdx, currentLessonIdx, showFinal]);

  const currentLesson = data.units[currentUnitIdx].lessons[currentLessonIdx];
  const isFirst = currentUnitIdx === 0 && currentLessonIdx === 0;
  const isLast = currentUnitIdx === data.units.length - 1 && currentLessonIdx === data.units[data.units.length - 1].lessons.length - 1;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-300">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ZONE 1: SIDEBAR (Plan de Estudios) */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-slate-900 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 shadow-xl md:shadow-none ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-20 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3 font-bold text-xl text-brand-dark dark:text-white tracking-tight">
            <div className="bg-brand-primary p-1.5 rounded-lg">
              <Layout className="text-white w-5 h-5" />
            </div>
            <span>AULA VIRTUAL</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto md:hidden text-brand-secondary hover:text-brand-dark">
            <X size={24} />
          </button>
        </div>

        <Sidebar 
          units={data.units}
          currentUnitIdx={currentUnitIdx}
          currentLessonIdx={currentLessonIdx}
          completedLessons={completedLessons}
          onSelectLesson={(u, l) => {
            setCurrentUnitIdx(u);
            setCurrentLessonIdx(l);
            setShowFinal(false);
          }}
          showFinal={showFinal}
          onSelectFinal={() => setShowFinal(true)}
        />
      </div>

      {/* RIGHT COLUMN WRAPPER */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        
        {/* ZONE 2: COURSE HEADER (Cabecera) */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-6 z-30 shrink-0 shadow-sm transition-colors duration-300">
          <div className="flex items-start gap-4 flex-1 min-w-0">
             <button onClick={() => setSidebarOpen(true)} className="md:hidden text-brand-secondary mt-1">
              <Menu size={24} />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-brand-primary/10 dark:bg-brand-primary/30 text-brand-primary dark:text-brand-accent text-xs font-bold uppercase tracking-wide">
                  <BarChart size={12} />
                  {data.level}
                </span>
                <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-brand-secondary dark:text-slate-400 text-xs font-bold uppercase tracking-wide">
                  <Clock size={12} />
                  {data.duration}
                </span>
              </div>
              <h1 className="text-xl md:text-3xl font-bold text-brand-dark dark:text-white truncate leading-tight uppercase tracking-tight">
                {data.title}
              </h1>
              <p className="text-sm text-brand-secondary dark:text-slate-400 mt-1 flex items-center gap-2">
                <Book size={14} />
                <span>{totalUnits} Unidades</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span>{totalLessons} Lecciones</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-end md:items-center gap-6">
            
            {/* Progress Block */}
            <div className="w-full md:w-64">
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-brand-secondary dark:text-slate-400 uppercase tracking-widest">Tu Progreso</span>
                <span className="text-sm font-bold text-brand-primary dark:text-brand-accent">{progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-brand-primary to-brand-accent rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-right text-brand-secondary dark:text-slate-500 mt-1.5">
                {completedCount} de {totalLessons} completadas
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={handleDownloadSCORM}
                disabled={isExporting}
                className={`p-2.5 rounded-lg flex items-center gap-2 text-sm font-bold uppercase transition-all shadow-sm
                  ${isExporting 
                    ? 'bg-slate-100 text-slate-400 cursor-wait' 
                    : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 border border-orange-200 dark:border-orange-800'}`}
                title="Descargar paquete para Moodle"
              >
                {isExporting ? <div className="animate-spin w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full" /> : <Package size={20} />}
                <span className="hidden xl:inline">Exportar SCORM</span>
              </button>

              <button 
                onClick={toggleDarkMode}
                className="p-2.5 rounded-lg text-brand-secondary dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={darkMode ? "Modo Claro" : "Modo Oscuro"}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              {!showFinal && (
                 <button
                 onClick={() => {
                    // In a real app, this might jump to the next incomplete lesson
                    handleNext(); 
                 }}
                 className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-brand-dark dark:bg-white text-white dark:text-brand-dark rounded-lg font-bold text-sm hover:opacity-90 transition-opacity shadow-lg uppercase tracking-wider"
               >
                 <Play size={16} fill="currentColor" />
                 <span>Continuar</span>
               </button>
              )}
            </div>
          </div>
        </header>

        {/* ZONE 3: MAIN CONTENT (Contenido Principal) */}
        <main id="main-content" className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-black/20 relative scroll-smooth p-4 md:p-8 lg:px-12">
          <div className="max-w-5xl mx-auto pb-12">
            {showFinal ? (
              <FinalSection data={data} sources={sources} />
            ) : (
              <LessonContent 
                lesson={currentLesson}
                onNext={handleNext}
                onPrev={handlePrev}
                isFirst={isFirst}
                isLast={isLast}
                onComplete={handleComplete}
              />
            )}

            <div className="mt-12 text-center border-t border-slate-200 dark:border-slate-800 pt-8">
              <button 
                onClick={onBack}
                className="text-sm font-bold text-brand-secondary dark:text-slate-500 hover:text-brand-primary dark:hover:text-brand-accent transition-colors uppercase tracking-widest"
              >
                ← Salir y volver al inicio
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseView;