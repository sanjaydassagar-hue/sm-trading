import React from 'react';
import {
  BookOpen,
  CheckCircle,
  GraduationCap,
  Award,
  BarChart3,
  TrendingUp,
  LineChart,
  PlayCircle,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    courses,
    lessons,
    getUserProgress,
    userPortfolio,
    setActiveTab,
    startCourse,
    openLesson,
    certificates,
    setActiveCertificate,
    openLoginModal,
  } = useApp();

  const userProg = getUserProgress();
  const completedLessonsCount = userProg.completedLessonIds.length;
  const totalLessonsCount = lessons.length;
  const learningProgressPct = totalLessonsCount > 0
    ? Math.round((completedLessonsCount / totalLessonsCount) * 100)
    : 0;

  // Average quiz score calculation
  const quizScoreValues = Object.values(userProg.quizScores);
  const avgQuizScore = quizScoreValues.length > 0
    ? Math.round(quizScoreValues.reduce((a, b) => a + b, 0) / quizScoreValues.length)
    : 0;

  // Find next pending lesson to continue
  const nextPendingLesson = lessons.find(l => !userProg.completedLessonIds.includes(l.id)) || lessons[0];
  const nextLessonCourse = courses.find(c => c.id === nextPendingLesson?.courseId);

  // User's earned certificates
  const userCerts = certificates.filter(
    c => c.userId === currentUser?.id || c.userId === 'user-demo'
  );

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Welcome Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-900 text-white shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
              ড্যাশবোর্ড ওভারভিউ
            </span>
            <span className="text-xs text-emerald-200">
              লেভেল: {currentUser?.learningLevel || 'Beginner'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            স্বাগতম, {currentUser?.fullName || 'সুমন দাশ'} (@{currentUser?.username || 'demo_user'})
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
            SM TRADING এডুকেশনে আপনার আজকের শেখার লক্ষ্য পূরণ করুন ও পেপার ট্রেডিং অনুশীলন করুন।
          </p>
        </div>

        {/* Continue Learning button */}
        {nextPendingLesson && (
          <button
            onClick={() => openLesson(nextPendingLesson.id, nextPendingLesson.courseId)}
            className="self-start sm:self-center flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-950 font-bold text-xs shadow-md hover:bg-emerald-50 transition cursor-pointer shrink-0"
          >
            <PlayCircle className="w-4 h-4 text-emerald-600" />
            <span>শেখা চালিয়ে যান</span>
          </button>
        )}
      </div>

      {/* 2. Six Primary Dashboard Cards Required by Spec */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: আমার কোর্স */}
        <div
          onClick={() => setActiveTab('courses')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 group-hover:text-emerald-600 transition">
              কোর্সগুলো দেখুন <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              আমার কোর্স
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                {userProg.completedCourseIds.length} / {courses.length}
              </span>
              <span className="text-xs text-slate-400">কোর্স সম্পন্ন</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              মোট ৬টি সিলেবাসের মধ্যে চলমান কোর্সসমূহ
            </p>
          </div>
        </div>

        {/* Card 2: Learning Progress */}
        <div
          onClick={() => setActiveTab('progress')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <LineChart className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {learningProgressPct}%
            </span>
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Learning Progress
            </span>
            <div className="mt-1">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                {learningProgressPct}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-3">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${learningProgressPct}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 3: Completed Lessons */}
        <div
          onClick={() => setActiveTab('learn')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 group-hover:text-emerald-600 transition">
              লেসন খুলুন <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Completed Lessons
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                {completedLessonsCount} / {totalLessonsCount}
              </span>
              <span className="text-xs text-slate-400">পাঠ সম্পন্ন</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              বাকি আছে {totalLessonsCount - completedLessonsCount}টি পাঠ
            </p>
          </div>
        </div>

        {/* Card 4: Quiz Score */}
        <div
          onClick={() => setActiveTab('quiz')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 group-hover:text-emerald-600 transition">
              কুইজ দিন <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Quiz Score
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                {avgQuizScore}%
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                গড় মূল্যায়ন
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              {quizScoreValues.length}টি কোর্সের কুইজ সমাপ্ত হয়েছে
            </p>
          </div>
        </div>

        {/* Card 5: Paper Trading */}
        <div
          onClick={() => setActiveTab('paper-trading')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 group-hover:text-emerald-600 transition">
              ট্রেড টার্মিনাল <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Paper Trading (ভার্চুয়াল)
            </span>
            <div className="mt-1">
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                ₹{userPortfolio.virtualBalance.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              হোল্ডিংস: {userPortfolio.holdings.length}টি স্টক | অর্ডার: {userPortfolio.orders.length}
            </p>
          </div>
        </div>

        {/* Card 6: Certificates */}
        <div
          onClick={() => {
            if (userCerts.length > 0) {
              setActiveCertificate(userCerts[0]);
            } else {
              setActiveTab('courses');
            }
          }}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 group-hover:text-emerald-600 transition">
              সার্টিফিকেট দেখুন <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Certificates (সনদপত্র)
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
                {userCerts.length}
              </span>
              <span className="text-xs text-slate-400">টি অর্জিত</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              {userCerts.length > 0
                ? 'যাচাইযোগ্য অফিসিয়াল সার্টিফিকেট প্রস্তুত'
                : 'কোর্স শেষ করে সার্টিফিকেট আনলক করুন'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Next Lesson Recommendation & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Next Lesson Box */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                পরবর্তী সুপারিশকৃত পাঠ (Next Lesson)
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              {nextLessonCourse?.title}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                টপিক #{nextPendingLesson.topicIndex + 1}
              </span>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">
                {nextPendingLesson.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {nextPendingLesson.explanation}
              </p>
            </div>

            <button
              onClick={() => openLesson(nextPendingLesson.id, nextPendingLesson.courseId)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition cursor-pointer shrink-0 shadow-sm"
            >
              <span>পাঠ শুরু করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Paper Portfolio Balance Mini-Widget */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                পেপার পোর্টফোলিও স্ট্যাটাস
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                সক্রিয়
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">নগদ ভার্চুয়াল ক্যাশ:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  ₹{userPortfolio.virtualBalance.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">মোট হোল্ডিংস মূল্য:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  ₹{userPortfolio.holdings.reduce((sum, h) => sum + h.currentValue, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('paper-trading')}
            className="mt-4 w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition cursor-pointer"
          >
            ফুল পেপার ট্রেডিং টার্মিনাল খুলুন
          </button>
        </div>
      </div>
    </div>
  );
};
