import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Play,
  HelpCircle,
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BarChart,
  Shield,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CoursesView: React.FC = () => {
  const {
    courses,
    lessons,
    getUserProgress,
    startCourse,
    openLesson,
    setActiveTab,
    setSelectedCourseId,
    setActiveCertificate,
    certificates,
    currentUser,
  } = useApp();

  const userProg = getUserProgress();
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(courses[0]?.id || null);

  const toggleExpand = (courseId: string) => {
    setExpandedCourseId(prev => (prev === courseId ? null : courseId));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>সম্পূর্ণ পাঠ্যক্রম (Full Curriculum)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Trading Courses (কোর্সসমূহ)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          শেয়ার বাজারের একদম মৌলিক বিষয় থেকে শুরু করে ক্যান্ডেলস্টিক, চার্ট এনালাইসিস, রিস্ক ম্যানেজমেন্ট এবং ট্রেডার সাইকোলজি পর্যন্ত ৬টি বিস্তারিত ধাপে শিখুন।
        </p>
      </div>

      {/* Courses List */}
      <div className="space-y-4">
        {courses.map(course => {
          const courseLessons = lessons.filter(l => l.courseId === course.id);
          const completedLessonsCount = courseLessons.filter(l =>
            userProg.completedLessonIds.includes(l.id)
          ).length;
          const isCourseCompleted = userProg.completedCourseIds.includes(course.id);
          const progressPercent = courseLessons.length > 0
            ? Math.round((completedLessonsCount / courseLessons.length) * 100)
            : 0;
          const isExpanded = expandedCourseId === course.id;

          // Check if certificate earned
          const existingCert = certificates.find(
            c => c.courseId === course.id && (c.userId === currentUser?.id || c.userId === 'user-demo')
          );

          return (
            <div
              key={course.id}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition"
            >
              {/* Main Course Summary Bar */}
              <div
                onClick={() => toggleExpand(course.id)}
                className="p-5 sm:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {course.badgeBn}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <Layers className="w-3.5 h-3.5" />
                      {courseLessons.length}টি পাঠ
                    </span>
                    {isCourseCompleted && (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        কোর্স সম্পন্ন
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                    {course.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
                    {course.description}
                  </p>
                </div>

                {/* Progress Indicator & Actions */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-32 hidden sm:block">
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>অগ্রগতি</span>
                      <span className="font-semibold">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        startCourse(course.id);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{completedLessonsCount > 0 ? 'চালিয়ে যান' : 'কোর্স শুরু করুন'}</span>
                    </button>

                    <div className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Syllabus & Lesson List */}
              {isExpanded && (
                <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-5 sm:p-6 space-y-4 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      কোর্সের পাঠ্যসূচি (Course Syllabus):
                    </h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedCourseId(course.id);
                          setActiveTab('quiz');
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 transition cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>কুইজে অংশ নিন</span>
                      </button>

                      {existingCert && (
                        <button
                          onClick={() => setActiveCertificate(existingCert)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 transition cursor-pointer"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>সার্টিফিকেট দেখুন</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {courseLessons.map((lesson, idx) => {
                      const isCompleted = userProg.completedLessonIds.includes(lesson.id);
                      return (
                        <div
                          key={lesson.id}
                          onClick={() => openLesson(lesson.id, course.id)}
                          className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-700 transition cursor-pointer flex items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                                isCompleted
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-emerald-100 group-hover:text-emerald-700'
                              }`}
                            >
                              {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                            </div>
                            <div>
                              <h5 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                                {lesson.title}
                              </h5>
                              <span className="text-[11px] text-slate-400">
                                আনুমানিক {lesson.durationMinutes} মিনিট পাঠ
                              </span>
                            </div>
                          </div>

                          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 group-hover:underline">
                            পড়ুন
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
