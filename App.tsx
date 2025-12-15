import React, { useState, useEffect } from 'react';
import CourseForm from './components/CourseForm';
import CourseView from './components/CourseView';
import { generateCourse } from './services/geminiService';
import { GeneratedCourse, UserInput } from './types';
import { AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [course, setCourse] = useState<GeneratedCourse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Handle Dark Mode Class on HTML tag
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleCreateCourse = async (input: UserInput) => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateCourse(input);
      setCourse(result);
    } catch (err: any) {
      setError(err.message || 'Ha ocurrido un error inesperado al generar el curso.');
    } finally {
      setLoading(false);
    }
  };

  if (course) {
    return (
      <CourseView 
        course={course} 
        onBack={() => setCourse(null)} 
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
    );
  }

  return (
    <>
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] w-full max-w-md px-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 backdrop-blur-sm">
            <AlertTriangle size={20} />
            <span className="text-sm font-medium">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 dark:hover:text-red-200">×</button>
          </div>
        </div>
      )}
      <CourseForm 
        onSubmit={handleCreateCourse} 
        isLoading={loading} 
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
    </>
  );
};

export default App;