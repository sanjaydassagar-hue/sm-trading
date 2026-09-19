import React from 'react';
import {
  TrendingUp,
  BookOpen,
  GraduationCap,
  HelpCircle,
  BarChart3,
  LineChart,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Award,
  Zap,
  PlayCircle,
  DollarSign,
  TrendingDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HomeView: React.FC = () => {
  const {
    courses,
    lessons,
    setActiveTab,
    startCourse,
    openLesson,
    userPortfolio,
    stocks,
    setSelectedStockSymbol,
    getUserProgress,
    currentUser,
    openSignUpModal,
  } = useApp();

  const userProg = getUserProgress();
  const todayLesson = lessons.find(l => l.id === 'c3-l1') || lessons[0]; // Candlestick anatomy as featured
  const todayCourse = courses.find(c => c.id === todayLesson.courseId);

  // Overall percentage
  const progressPct = courses.length > 0
    ? Math.round((userProg.completedLessonIds.length / lessons.length) * 100)
    : 0;

  return (
    <div className="space-y-12 pb-12">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-emerald-900/90 via-slate-900 to-slate-950 text-white p-6 sm:p-10 md:p-14 border border-emerald-800/40 shadow-2xl">
        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>১০০% শিক্ষামূলক ও ভার্চুয়াল পেপার ট্রেডিং প্ল্যাটফর্ম</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white font-mono">
              SM TRADING
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-300">
              "বাংলায় Trading শিখুন, অনুশীলন করুন"
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            শেয়ার বাজার, ক্যান্ডেলস্টিক, টেকনিক্যাল এনালাইসিস এবং রিস্ক ম্যানেজমেন্টের খুটিনাটি শিখুন মাতৃভাষায়। কোনো আসল টাকার ঝুঁকি ছাড়া ₹১,০০,০০০ ভার্চুয়াল ক্যাপিটাল নিয়ে প্র্যাকটিস করুন।
          </p>

          {/* Quick Action Navigation Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                if (currentUser) {
                  setActiveTab('learn');
                } else {
                  openSignUpModal();
                }
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition cursor-pointer"
            >
              <span>শুরু করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700 transition cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Trading Courses</span>
            </button>

            <button
              onClick={() => openLesson(todayLesson.id, todayLesson.courseId)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700 transition cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>আজকের Lesson</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700 transition cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-sky-400" />
              <span>Quiz</span>
            </button>

            <button
              onClick={() => setActiveTab('paper-trading')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700 transition cursor-pointer"
            >
              <BarChart3 className="w-4 h-4 text-teal-400" />
              <span>Paper Trading</span>
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-700 transition cursor-pointer"
            >
              <LineChart className="w-4 h-4 text-purple-400" />
              <span>My Progress</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Statutory Disclaimer Banner (Mandatory Display) */}
      <section className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-900/70 flex items-start gap-3.5 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block mb-0.5">
            সতর্কীকরণ ও শিক্ষামূলক বার্তা:
          </span>
          <p className="text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed">
            "SM TRADING একটি শিক্ষামূলক প্ল্যাটফর্ম। এখানে দেওয়া তথ্য শুধুমাত্র শিক্ষার উদ্দেশ্যে। Trading ও Investment-এ ঝুঁকি রয়েছে এবং লাভের কোনো নিশ্চয়তা নেই।"
          </p>
        </div>
      </section>

      {/* 3. Live Simulated Stock Ticker */}
      <section className="overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 shadow-xs">
        <div className="flex items-center justify-between px-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              সিমুলেটেড মার্কেট ওয়াচলিস্ট (Live Ticker)
            </span>
          </div>
          <span className="text-[10px] text-slate-400">প্রতি ৪ সেকেন্ডে আপডেট হয়</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {stocks.map(stock => {
            const isPositive = stock.change >= 0;
            return (
              <div
                key={stock.symbol}
                onClick={() => {
                  setSelectedStockSymbol(stock.symbol);
                  setActiveTab('paper-trading');
                }}
                className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100 font-mono">
                    {stock.symbol}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1 rounded ${
                      isPositive
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {stock.changePercent.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                    ₹{stock.currentPrice.toFixed(2)}
                  </span>
                  <span className="text-[9px] text-slate-400 truncate max-w-[65px]">
                    {stock.nameBn}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Featured: আজকের Lesson & Paper Trading Quick Card */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Featured Lesson */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                ⭐ আজকের Lesson
              </span>
              <span className="text-xs text-slate-500 font-medium">
                সময়: {todayLesson.durationMinutes} মিনিট
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {todayLesson.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              কোর্স: {todayCourse?.title}
            </p>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 mb-4">
              {todayLesson.explanation}
            </p>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 mb-4">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                📌 সহজ বাস্তব উদাহরণ:
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                "{todayLesson.simpleExamples[0]}"
              </p>
            </div>
          </div>

          <button
            onClick={() => openLesson(todayLesson.id, todayLesson.courseId)}
            className="w-full sm:w-auto self-start flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-sm"
          >
            <PlayCircle className="w-4 h-4" />
            <span>আজকের পাঠ শুরু করুন</span>
          </button>
        </div>

        {/* Paper Trading Spotlight */}
        <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-400" />
                <span className="font-bold text-sm text-slate-100">ভার্চুয়াল পেপার ট্রেডিং</span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                সিমুলেশন
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              আসল টাকা নষ্ট না করে রিয়েল-লাইক স্টক মার্কেটে বাই ও সেল করার অভিজ্ঞতা অর্জন করুন।
            </p>

            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>উপলব্ধ ক্যাশ ব্যালেন্স:</span>
                <span className="text-[10px] text-emerald-400">ভার্চুয়াল তহবিল</span>
              </div>
              <p className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                ₹{userPortfolio.virtualBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-slate-700/60 text-xs">
                <span className="text-slate-400">হোল্ডিংস: {userPortfolio.holdings.length}টি স্টক</span>
                <span className="text-slate-300 font-medium">অর্ডার সংখ্যা: {userPortfolio.orders.length}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('paper-trading')}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md"
          >
            <span>ট্রেডিং প্র্যাকটিস শুরু করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 5. Trading Courses Showcase */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              Trading Courses (কোর্সসমূহ)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              নতুনদের জন্য সাজানো ৬টি সম্পূর্ণ প্র্যাকটিক্যাল কোর্স
            </p>
          </div>
          <button
            onClick={() => setActiveTab('courses')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            সব কোর্স দেখুন
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map(course => {
            const courseLessons = lessons.filter(l => l.courseId === course.id);
            const completedCount = courseLessons.filter(l =>
              userProg.completedLessonIds.includes(l.id)
            ).length;
            const pct = courseLessons.length > 0
              ? Math.round((completedCount / courseLessons.length) * 100)
              : 0;
            const isCompleted = userProg.completedCourseIds.includes(course.id);

            return (
              <div
                key={course.id}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {course.badgeBn}
                    </span>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        সম্পূর্ণ
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">{course.duration}</span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {course.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-4">
                    {course.description}
                  </p>

                  {/* Topics list preview */}
                  <div className="space-y-1 mb-4">
                    <span className="text-[11px] font-semibold text-slate-400">প্রধান টপিকস:</span>
                    <div className="flex flex-wrap gap-1">
                      {course.topics.slice(0, 3).map((t, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700/60"
                        >
                          {t}
                        </span>
                      ))}
                      {course.topics.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 text-slate-400">
                          +{course.topics.length - 3} আরও
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>অগ্রগতি: {completedCount}/{courseLessons.length} পাঠ</span>
                      <span className="font-semibold">{pct}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => startCourse(course.id)}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white dark:bg-slate-800 dark:hover:bg-emerald-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
                >
                  {completedCount > 0 ? 'পড়া চালিয়ে যান' : 'কোর্স শুরু করুন'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. My Progress Overview Snippet */}
      <section className="rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-200 dark:border-emerald-900/40 p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              আপনার শেখার অগ্রগতি: {progressPct}%
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl">
              প্রতিটি কোর্স শেষ করে কুইজে অংশ নিন এবং আপনার অফিসিয়াল "Certificate of Completion" আনলক করুন।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('progress')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-sm"
            >
              <LineChart className="w-4 h-4" />
              <span>অগ্রগতি বিস্তারিত</span>
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>কুইজ অনুশীলন</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
