import { useState, useMemo, useCallback } from 'react';
import { initialExam, createEmptyExam } from './data/initialExam';
import { generateLatex } from './utils/latexGenerator';
import Header from './components/Header';
import ExamInformation from './components/ExamInformation';
import ExamBuilder from './components/ExamBuilder';
import ExamPreview from './components/ExamPreview';
import LatexOutput from './components/LatexOutput';
import IntroSplash from './components/IntroSplash';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [exam, setExam] = useState(initialExam);
  const [savedExam, setSavedExam] = useState(null);
  const [isCleared, setIsCleared] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');

  const latexCode = useMemo(() => generateLatex(exam), [exam]);

  const handleUpdateInfo = useCallback((newInfo) => {
    setExam((prev) => ({ ...prev, info: newInfo }));
  }, []);

  const handleUpdateExercises = useCallback((newExercises) => {
    setExam((prev) => ({ ...prev, exercises: newExercises }));
  }, []);

  const handleNewExam = useCallback(() => {
    setExam(createEmptyExam());
    setIsCleared(false);
  }, []);

  const handleLoadSample = useCallback(() => {
    setExam(initialExam);
    setIsCleared(false);
  }, []);

  const handleToggleClear = useCallback(() => {
    if (isCleared) {
      setExam(savedExam || initialExam);
      setSavedExam(null);
      setIsCleared(false);
    } else {
      setSavedExam(exam);
      setExam(createEmptyExam());
      setIsCleared(true);
    }
  }, [isCleared, savedExam, exam]);

  const handleDownloadTex = useCallback(() => {
    const level = exam.info.level || 'exam';
    const filename = `islamic-exam-${level.toLowerCase()}.tex`;
    const blob = new Blob([latexCode], { type: 'application/x-tex;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [latexCode, exam.info.level]);

  const handleExportPdf = useCallback(() => {
    if (activeTab !== 'preview') {
      setActiveTab('preview');
      setTimeout(() => window.print(), 80);
    } else {
      window.print();
    }
  }, [activeTab]);

  return (
    <>
      {showIntro && <IntroSplash onDone={() => setShowIntro(false)} />}

      <div className="min-h-screen flex flex-col bg-ivory text-charcoal">
        <Header
          onNewExam={handleNewExam}
          onLoadSample={handleLoadSample}
          onExportTex={handleDownloadTex}
          onExportPdf={handleExportPdf}
          isCleared={isCleared}
          onToggleClear={handleToggleClear}
        />

        <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6 print:p-0 print:max-w-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start print:block">
            {/* Exam Editor (7 cols on desktop) */}
            <div className="no-print lg:col-span-7 space-y-6">
              <ExamInformation info={exam.info} onChange={handleUpdateInfo} />

              <ExamBuilder
                exercises={exam.exercises}
                onChange={handleUpdateExercises}
              />
            </div>

            {/* Output & Preview Panel (5 cols on desktop, sticky) */}
            <aside className="lg:col-span-5 lg:sticky lg:top-20 space-y-3 print:static">
              <div className="no-print academic-panel p-1.5 flex items-center gap-1 bg-ivory-dark/50">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`flex-1 py-2 px-3 text-sm font-semibold rounded-xs transition-colors cursor-pointer ${
                    activeTab === 'preview'
                      ? 'bg-forest text-ivory'
                      : 'text-muted hover:text-charcoal'
                  }`}
                >
                  معاينة ورقة الاختبار
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('latex')}
                  className={`flex-1 py-2 px-3 text-sm font-semibold rounded-xs transition-colors cursor-pointer ${
                    activeTab === 'latex'
                      ? 'bg-forest text-ivory'
                      : 'text-muted hover:text-charcoal'
                  }`}
                >
                  كود LaTeX المولّد
                </button>
              </div>

              {activeTab === 'preview' ? (
                <ExamPreview exam={exam} />
              ) : (
                <LatexOutput latexCode={latexCode} onDownload={handleDownloadTex} />
              )}
            </aside>
          </div>
        </main>

        <footer className="no-print border-t border-border bg-paper/70 py-3 px-4 text-center text-xs text-muted">
          مُعِدّ — أداة أكاديمية لإعداد اختبارات التربية الإسلامية وتوليد شيفرة LaTeX
        </footer>
      </div>
    </>
  );
}
