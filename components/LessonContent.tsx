import React, { useEffect } from 'react';
import { Lesson } from '../types';
import { Lightbulb, Briefcase, Zap, ArrowRight, ArrowLeft, BookOpen, Image as ImageIcon } from 'lucide-react';

interface Props {
  lesson: Lesson;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  onComplete: () => void;
}

const LessonContent: React.FC<Props> = ({ lesson, onNext, onPrev, isFirst, isLast, onComplete }) => {
  
  // Reset scroll when lesson changes
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.scrollTop = 0;
  }, [lesson]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Lesson Title Card */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-10 md:p-12 shadow-sm border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
          <BookOpen size={140} />
        </div>
        <div className="relative z-10">
          <span className="inline-block px-5 py-2 bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary dark:text-brand-accent rounded-md text-sm font-bold uppercase tracking-widest mb-5">
            Lección Actual
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-dark dark:text-white leading-tight max-w-4xl uppercase tracking-tight">
            {lesson.title}
          </h1>
        </div>
      </div>

      {/* Idea Key Block (Card) WITH INFOGRAPHIC */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow">
        <div className="bg-amber-50 dark:bg-amber-900/10 border-b border-amber-100 dark:border-amber-900/20 px-10 py-6 flex items-center gap-5">
          <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg text-amber-600 dark:text-amber-400">
            <Lightbulb size={28} strokeWidth={2.5} />
          </div>
          <h3 className="font-bold text-xl text-amber-900 dark:text-amber-100 uppercase tracking-wide">{lesson.keyIdea.title || 'Fundamentos Teóricos'}</h3>
        </div>
        
        <div className="p-10">
          {/* Enhanced Text Styles for longer content */}
          <div className="text-brand-dark dark:text-slate-300 leading-relaxed text-xl font-normal mb-10 whitespace-pre-line text-justify">
            {lesson.keyIdea.content}
          </div>

          {/* Generated Infographic Image */}
          {lesson.image && (
            <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 relative group my-8">
              <div className="absolute top-5 right-5 bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <ImageIcon size={16} /> Infografía IA
              </div>
              <img 
                src={lesson.image} 
                alt={`Infografía sobre ${lesson.title}`}
                className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-700 ease-in-out"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {/* Example Block (Card) - Full Width for better reading */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
          <div className="bg-brand-secondary/10 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 px-10 py-6 flex items-center gap-5">
            <div className="bg-brand-secondary/20 dark:bg-slate-700 p-3 rounded-lg text-brand-secondary dark:text-slate-300">
              <Briefcase size={28} strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-xl text-brand-secondary dark:text-slate-200 uppercase tracking-wide">{lesson.example.title || 'Aplicación Contextualizada'}</h3>
          </div>
          <div className="p-10 text-brand-dark dark:text-slate-300 leading-relaxed flex-grow text-xl font-normal whitespace-pre-line">
            {lesson.example.content}
          </div>
        </div>

        {/* Activity Block (Card) */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
          <div className="bg-brand-accent/10 dark:bg-brand-accent/20 border-b border-brand-accent/20 dark:border-brand-accent/30 px-10 py-6 flex items-center gap-5">
            <div className="bg-brand-accent/20 dark:bg-brand-accent/30 p-3 rounded-lg text-brand-accent dark:text-brand-accent">
              <Zap size={28} strokeWidth={2.5} />
            </div>
            <h3 className="font-bold text-xl text-brand-dark dark:text-brand-accent uppercase tracking-wide">{lesson.activity.title || 'Situación de Aprendizaje'}</h3>
          </div>
          <div className="p-10 text-brand-dark dark:text-slate-300 leading-relaxed flex-grow whitespace-pre-line text-xl font-normal">
            {lesson.activity.content}
          </div>
        </div>
      </div>

      {/* Navigation Buttons - Removed Quiz Logic */}
      <div className="flex items-center justify-between pt-12">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className={`flex items-center gap-3 px-8 py-4 rounded-lg font-bold transition-colors uppercase tracking-wider text-base ${
            isFirst ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'text-brand-secondary dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 shadow-sm'
          }`}
        >
          <ArrowLeft size={24} />
          Anterior
        </button>

        <button
          onClick={() => {
            onComplete();
            onNext();
          }}
          className="flex items-center gap-4 px-10 py-5 bg-brand-primary hover:bg-[#1f66b0] text-white rounded-lg font-bold text-xl shadow-lg shadow-brand-primary/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] uppercase tracking-wider"
        >
          <span>{isLast ? 'Ir a Evaluación Final' : 'Marcar Completada y Seguir'}</span>
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default LessonContent;