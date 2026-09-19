import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  ArrowLeft,
  List,
  Sparkles,
  HelpCircle,
  Award,
  Lightbulb,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DiagramViewer } from './DiagramViewer';

export const LessonView: React.FC = () => {
  const {
    courses,
    lessons,
    selectedCourseId,
    selectedLessonId,
    openLesson,
    markLessonComplete,
    getUserProgress,
    setActiveTab,
    setSelectedCourseId,
  } = useApp();

  const userProg = getUserProgress();
  const [showTopicDrawer, setShowTopicDrawer] = useState(false);

  // Active course and lesson
  const currentCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const courseLessons = lessons.filter(l => l.courseId === currentCourse.id);
  const currentLesson = courseLessons.find(l => l.id === selectedLessonId) || courseLessons[0] || lessons[0];

  const currentIdx = courseLessons.findIndex(l => l.id === currentLesson?.id);
  const prevLesson = currentIdx > 0 ? courseLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < courseLessons.length - 1 ? courseLessons[currentIdx + 1] : null;

  const isCompleted = userProg.completedLessonIds.includes(currentLesson.id);

  const handleMarkComplete = () => {
    markLessonComplete(currentLesson.id, currentCourse.id);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('courses')}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>সকল কোর্স</span>
          </button>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            {currentCourse.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTopicDrawer(!showTopicDrawer)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
          >
            <List className="w-4 h-4 text-emerald-600" />
            <span>টপিক তালিকা ({currentIdx + 1}/{courseLessons.length})</span>
          </button>

          <button
            onClick={() => {
              setSelectedCourseId(currentCourse.id);
              setActiveTab('quiz');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-semibold transition cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>কুইজ অনুশীলন</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Topic Drawer (if open) and Lesson Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Topics / Syllabus */}
        {showTopicDrawer && (
          <div className="lg:col-span-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3 h-fit">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {currentCourse.title} - পাঠ্যসূচি
            </h4>
            <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
              {courseLessons.map((l, idx) => {
                const isItemActive = l.id === currentLesson.id;
                const isItemDone = userProg.completedLessonIds.includes(l.id);
                return (
                  <div
                    key={l.id}
                    onClick={() => {
                      openLesson(l.id, currentCourse.id);
                      setShowTopicDrawer(false);
                    }}
                    className={`p-2.5 rounded-xl text-xs cursor-pointer flex items-center justify-between transition ${
                      isItemActive
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <span className="truncate max-w-[200px]">{l.title}</span>
                    </div>
                    {isItemDone && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Lesson Reading Area */}
        <div className={`${showTopicDrawer ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-6`}>
          <article className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xs space-y-8">
            {/* Lesson Title Header */}
            <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  টপিক #{currentLesson.topicIndex + 1}
                </span>
                <span className="text-xs text-slate-400">
                  সময়: {currentLesson.durationMinutes} মিনিট পাঠ
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                {currentLesson.title}
              </h1>
            </div>

            {/* Main Explanation */}
            <div className="space-y-4 text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed">
              <p className="whitespace-pre-line leading-loose">
                {currentLesson.explanation}
              </p>
            </div>

            {/* Interactive Diagram / Visual Representation */}
            {currentLesson.diagramType && (
              <DiagramViewer
                type={currentLesson.diagramType}
                title={currentLesson.diagramTitle}
                description={currentLesson.diagramDescription}
              />
            )}

            {/* Simple Real-World Examples */}
            {currentLesson.simpleExamples && currentLesson.simpleExamples.length > 0 && (
              <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-3">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  <span>বাস্তব উদাহরণ (Real-Life Examples)</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {currentLesson.simpleExamples.map((example, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span className="leading-relaxed">{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Important Points (জরুরি টিপস ও গোল্ডেন রুলস) */}
            {currentLesson.importantPoints && currentLesson.importantPoints.length > 0 && (
              <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span>জরুরি পয়েন্ট ও নিয়ম (Golden Rules)</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {currentLesson.importantPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mark as complete button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                {isCompleted ? (
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>পাঠটি সম্পন্ন হয়েছে</span>
                  </div>
                ) : (
                  <button
                    onClick={handleMarkComplete}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>সম্পন্ন হিসেবে চিহ্নিত করুন</span>
                  </button>
                )}
              </div>

              {/* Next / Previous Navigation */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                {prevLesson ? (
                  <button
                    onClick={() => openLesson(prevLesson.id, currentCourse.id)}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>পূর্ববর্তী পাঠ</span>
                  </button>
                ) : (
                  <div />
                )}

                {nextLesson ? (
                  <button
                    onClick={() => openLesson(nextLesson.id, currentCourse.id)}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-emerald-600 text-white dark:text-slate-900 dark:hover:bg-emerald-500 text-xs font-bold transition cursor-pointer"
                  >
                    <span>পরবর্তী পাঠ</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedCourseId(currentCourse.id);
                      setActiveTab('quiz');
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition cursor-pointer shadow-sm"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>কোর্সের কুইজ দিন</span>
                  </button>
                )}
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};
