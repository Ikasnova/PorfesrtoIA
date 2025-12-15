import React, { useState } from 'react';
import { UserInput } from '../types';
import { LEVELS, FORMATS, STAGES } from '../constants';
import { BookOpen, Loader2, Sparkles, Moon, Sun, GraduationCap } from 'lucide-react';

interface Props {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const CourseForm: React.FC<Props> = ({ onSubmit, isLoading, darkMode, toggleDarkMode }) => {
  const [formData, setFormData] = useState<UserInput>({
    topic: '',
    stage: 'Educación Secundaria Obligatoria (ESO)',
    level: 'Medio / Ordinario',
    profile: '',
    goal: '',
    time: '',
    format: 'Situaciones de Aprendizaje',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors duration-300 font-sans">
      
      {/* Top Right Toggle */}
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleDarkMode}
          className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-md text-brand-secondary hover:text-brand-primary dark:text-slate-400 dark:hover:text-brand-accent transition-all transform hover:scale-110"
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      <div className="max-w-4xl w-full my-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-brand-primary p-5 rounded-2xl shadow-xl shadow-brand-primary/20 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-7xl font-bold text-brand-dark dark:text-white mb-6 tracking-tighter uppercase">
            Profesor<span className="text-brand-primary dark:text-brand-accent">IA</span>
          </h1>
          <p className="text-2xl text-brand-secondary dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-normal">
            Diseñador instruccional adaptado al <span className="font-semibold text-brand-primary dark:text-brand-accent">Currículo de Navarra</span>. Genera situaciones de aprendizaje en segundos.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl dark:shadow-black/50 border border-slate-200 dark:border-slate-800 overflow-hidden transition-all">
          {/* Gradient Line using new Palette: Primary to Accent (Teal) */}
          <div className="bg-gradient-to-r from-brand-primary via-brand-primary to-brand-accent p-2 h-3"></div>
          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Topic */}
              <div className="col-span-2">
                <label className="block text-base font-bold text-brand-secondary dark:text-slate-300 mb-3 uppercase tracking-widest">Materia o Tema</label>
                <input
                  type="text"
                  name="topic"
                  required
                  placeholder="Ej. Matemáticas, La Revolución Industrial, Robótica..."
                  className="w-full px-6 py-5 text-2xl font-normal rounded-none border-b-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-brand-dark dark:text-white focus:border-brand-primary focus:bg-white dark:focus:bg-slate-800 outline-none transition-all placeholder:text-slate-400"
                  value={formData.topic}
                  onChange={handleChange}
                />
              </div>

               {/* Stage */}
               <div className="col-span-2 md:col-span-1">
                <label className="block text-base font-bold text-brand-secondary dark:text-slate-300 mb-3 uppercase tracking-widest flex items-center gap-2">
                  <GraduationCap size={20} /> Etapa Educativa
                </label>
                <div className="relative">
                  <select
                    name="stage"
                    className="w-full px-6 py-5 text-lg rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-brand-dark dark:text-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all appearance-none cursor-pointer"
                    value={formData.stage}
                    onChange={handleChange}
                  >
                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none text-brand-secondary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Level */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-base font-bold text-brand-secondary dark:text-slate-300 mb-3 uppercase tracking-widest">Nivel</label>
                <div className="relative">
                  <select
                    name="level"
                    className="w-full px-6 py-5 text-lg rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-brand-dark dark:text-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all appearance-none cursor-pointer"
                    value={formData.level}
                    onChange={handleChange}
                  >
                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none text-brand-secondary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Profile */}
              <div>
                <label className="block text-base font-bold text-brand-secondary dark:text-slate-300 mb-3 uppercase tracking-widest">Perfil Alumnado</label>
                <input
                  type="text"
                  name="profile"
                  required
                  placeholder="Ej. 3º ESO, Diverso..."
                  className="w-full px-6 py-5 text-lg rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-brand-dark dark:text-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                  value={formData.profile}
                  onChange={handleChange}
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-base font-bold text-brand-secondary dark:text-slate-300 mb-3 uppercase tracking-widest">Temporalización</label>
                <input
                  type="text"
                  name="time"
                  required
                  placeholder="Ej. 6 sesiones..."
                  className="w-full px-6 py-5 text-lg rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-brand-dark dark:text-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>

              {/* Goal */}
              <div className="col-span-2">
                <label className="block text-base font-bold text-brand-secondary dark:text-slate-300 mb-3 uppercase tracking-widest">Objetivo</label>
                <input
                  type="text"
                  name="goal"
                  required
                  placeholder="Ej. Comprender el ciclo del agua..."
                  className="w-full px-6 py-5 text-lg rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-brand-dark dark:text-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all"
                  value={formData.goal}
                  onChange={handleChange}
                />
              </div>

               {/* Format */}
               <div className="col-span-2">
                <label className="block text-base font-bold text-brand-secondary dark:text-slate-300 mb-3 uppercase tracking-widest">Metodología</label>
                <div className="relative">
                  <select
                    name="format"
                    className="w-full px-6 py-5 text-lg rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-brand-dark dark:text-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all appearance-none cursor-pointer"
                    value={formData.format}
                    onChange={handleChange}
                  >
                    {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none text-brand-secondary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 bg-brand-primary hover:bg-[#1f66b0] text-white text-xl font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-brand-primary/30 transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-4 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span>Diseñando Experiencia...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-8 h-8 text-brand-accent" />
                    <span>Generar Unidad Didáctica</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        <p className="text-center text-brand-secondary dark:text-slate-600 text-base mt-10 font-normal">
          Potenciado por Gemini 2.5 Flash & Google Search - Alineado LOMLOE Navarra
        </p>
      </div>
    </div>
  );
};

export default CourseForm;