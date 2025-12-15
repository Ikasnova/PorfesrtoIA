import React, { useState } from 'react';
import { CourseData, Question } from '../types';
import { Trophy, Check, Book, ExternalLink, Target, Star } from 'lucide-react';

interface Props {
  data: CourseData;
  sources: { title?: string; uri: string }[];
}

const FinalSection: React.FC<Props> = ({ data, sources }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    let correct = 0;
    data.finalAssessment.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswerIndex) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  const scorePercentage = Math.round((score / data.finalAssessment.length) * 100);

  return (
    <div className="space-y-16 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Header */}
      <div className="text-center space-y-6 py-10">
        <div className="inline-flex items-center justify-center p-8 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full mb-2 shadow-inner">
          <Trophy size={64} fill="currentColor" className="opacity-80" />
        </div>
        <div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-6">Evaluación Final</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-normal">
            Has completado todas las lecciones. Demuestra lo que has aprendido para obtener tu certificado virtual.
          </p>
        </div>
      </div>

      {/* Assessment */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl dark:shadow-black/20 border border-slate-200 dark:border-slate-800 p-10 md:p-14">
        <div className="flex items-center gap-4 mb-10 pb-8 border-b border-slate-100 dark:border-slate-800">
          <div className="bg-violet-100 dark:bg-violet-900/30 p-3 rounded-lg text-violet-600 dark:text-violet-400">
            <Check size={28} strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Test de Conocimientos</h2>
        </div>
        
        {submitted ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-12 border border-slate-100 dark:border-slate-700">
            <p className="text-base text-slate-500 dark:text-slate-400 uppercase font-bold tracking-widest mb-4">Tu Resultado Final</p>
            <div className="text-8xl font-black text-violet-600 dark:text-violet-400 mb-6 tracking-tighter">{scorePercentage}%</div>
            <p className="text-slate-700 dark:text-slate-300 text-2xl">
              Has acertado <span className="font-bold text-slate-900 dark:text-white">{score}</span> de <span className="font-bold text-slate-900 dark:text-white">{data.finalAssessment.length}</span> preguntas.
            </p>
            {scorePercentage > 70 && (
               <div className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-bold text-lg">
                 <Star size={20} fill="currentColor" /> ¡Excelente trabajo!
               </div>
            )}
          </div>
        ) : null}

        <div className="space-y-12">
          {data.finalAssessment.map((q: Question, idx: number) => {
             return (
              <div key={idx} className="space-y-6">
                <p className="font-bold text-xl text-slate-800 dark:text-slate-200">{idx + 1}. {q.question}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {q.options.map((opt, optIdx) => {
                    let btnClass = "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750";
                    
                    if (answers[idx] === optIdx) {
                       btnClass = "border-violet-500 dark:border-violet-500 bg-violet-50 dark:bg-violet-900/20 text-violet-900 dark:text-violet-100 ring-2 ring-violet-500";
                    }
                    
                    if (submitted) {
                      if (optIdx === q.correctAnswerIndex) btnClass = "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-100 font-bold ring-2 ring-green-500";
                      else if (answers[idx] === optIdx) btnClass = "border-red-300 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200";
                      else btnClass = "opacity-40 border-slate-100 dark:border-slate-800 grayscale";
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => !submitted && setAnswers(prev => ({ ...prev, [idx]: optIdx }))}
                        disabled={submitted}
                        className={`text-left p-6 rounded-2xl border transition-all duration-200 text-lg font-normal ${btnClass}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {!submitted && (
          <div className="mt-14 pt-10 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < data.finalAssessment.length}
              className="w-full py-6 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xl rounded-xl shadow-xl shadow-violet-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-[0.99]"
            >
              Finalizar y Ver Resultados
            </button>
          </div>
        )}
      </div>

      {/* Projects */}
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white px-2 mt-12">Proyectos Recomendados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {data.finalProjects.map((project, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-10 flex flex-col h-full hover:shadow-lg transition-shadow">
            <div className="mb-8">
              <div className="inline-flex p-4 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-xl mb-5">
                <Target size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{project.title}</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 flex-grow leading-relaxed text-xl font-normal">
              {project.description}
            </p>
          </div>
        ))}
      </div>

      {/* Sources */}
      {sources.length > 0 && (
        <div className="bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 md:p-12">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-8 flex items-center gap-4">
            <Book size={24} className="text-slate-400" />
            Fuentes y Referencias
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sources.map((source, idx) => (
              <li key={idx}>
                <a 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 hover:border-violet-300 dark:hover:border-violet-700 transition-colors text-base truncate group"
                >
                  <ExternalLink size={18} className="flex-shrink-0" />
                  <span className="truncate">{source.title || source.uri}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FinalSection;