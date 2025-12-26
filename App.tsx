import React, { useState } from 'react';
import { INITIAL_FORM_DATA, InsuranceFormData } from './types';
import InputForm from './components/InputForm';
import OutputDisplay from './components/OutputDisplay';
import { generateAnalysis } from './services/geminiService';
import { Shield } from 'lucide-react';

const App: React.FC = () => {
  const [formData, setFormData] = useState<InsuranceFormData>(INITIAL_FORM_DATA);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const generatedText = await generateAnalysis(formData);
      setResult(generatedText);
    } catch (err: any) {
      setError(err.message || 'Ein unbekannter Fehler ist aufgetreten.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded text-white">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">REMAlino MF-Offerten</h1>
                        <p className="text-xs text-slate-500">Powered by Gemini</p>
                    </div>
                </div>
            </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-10">
                {/* Left Column: Form (Full width on single page flow) */}
                <section>
                    <InputForm 
                        formData={formData} 
                        setFormData={setFormData} 
                        onSubmit={handleSubmit}
                        onReset={handleReset}
                        isLoading={isLoading}
                    />
                </section>

                {/* Result Section */}
                {result && (
                    <section id="results" className="scroll-mt-20">
                        <OutputDisplay result={result} formData={formData} />
                    </section>
                )}
            </div>
        </main>
        
        <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} REMAlino MF-Offerten. Not a real insurance offer. Demo purpose only.
        </footer>
    </div>
  );
};

export default App;