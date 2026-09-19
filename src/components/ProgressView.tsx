import React from 'react';
import {
  LineChart,
  CheckCircle2,
  Award,
  BookOpen,
  GraduationCap,
  BarChart3,
  Sparkles,
  TrendingUp,
  Target,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProgressView: React.FC = () => {
  const {
    courses,
    lessons,
    getUserProgress,
    userPortfolio,
    certificates,
    setActiveCertificate,
    currentUser,
    setActiveTab,
    startCourse,
  } = useApp();

  const userProg = getUserProgress();
  const completedLessons = userProg.completedLessonIds.length;
  const totalLessons = lessons.length;
  const overallPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const quizScores = Object.values(userProg.quizScores);
  const avgQuizScore = quizScores.length > 0 ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : 0;

  const userCerts = certificates.filter(
    c => c.userId === currentUser?.id || c.userId === 'user-demo'
  );

  // Milestones badges
  const milestones = [
    {
      title: 'প্রথম পদক্ষেপ',
      desc: 'কমপক্ষে ১টি লেসন সফলভাবে পড়া সম্পন্ন হয়েছে',
      achieved: completedLessons >= 1,
      icon: '🌱',
    },
    {
      title: 'ক্যান্ডেলস্টিক অনুসন্ধানী',
      desc: 'ক্যান্ডেলস্টিক পাঠ সম্পন্ন ও চার্ট ডায়াগ্রাম পর্যালোচনা',
      achieved: userProg.completedLessonIds.includes('c3-l1'),
      icon: '🕯️',
    },
    {
      title: 'সক্রিয় পেপার ট্রেডার',
      desc: 'ভার্চুয়াল পেপার ট্রেডিংয়ে অন্তত ১টি অর্ডার এক্সিকিউট করা',
      achieved: userPortfolio.orders.length >= 1,
      icon: '📈',
    },
    {
      title: 'কুইজ পারফর্মার',
      desc: 'যেকোনো কোর্সের কুইজে ৮০% বা তদূর্ধ্ব স্কোর অর্জন',
      achieved: Object.values(userProg.quizScores).some(score => score >= 80),
      icon: '🎯',
    },
    {
      title: 'সার্টিফাইড ট্রেডার',
      desc: 'প্রথম অফিসিয়াল কোর্স সার্টিফিকেট অর্জন',
      achieved: userCerts.length >= 1,
      icon: '🏆',
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
          <LineChart className="w-3.5 h-3.5" />
          <span>শেখার পরিসংখ্যান ও অগ্রগতি (Learning Analytics)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          আমার সামগ্রিক অগ্রগতি
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          আপনার সম্পন্ন করা কোর্স, কুইজ পারফরম্যান্স, পেপার ট্রেডিং অনুশীলন ও অর্জিত সার্টিফিকেটের পূর্ণাঙ্গ ট্র্যাকিং।
        </p>
      </div>

      {/* Primary KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Completion */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-slate-500">সামগ্রিক সিলেবাস সমাপ্তি</span>
          <div className="my-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {overallPercentage}%
            </span>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mt-2">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${overallPercentage}%` }}
              ></div>
            </div>
          </div>
          <span className="text-[11px] text-slate-400">{completedLessons}/{totalLessons}টি পাঠ সমাপ্ত</span>
        </div>

        {/* Courses Completed */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-slate-500">সম্পূর্ণ কৃত কোর্স</span>
          <div className="my-2">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100 font-mono">
              {userProg.completedCourseIds.length} / {courses.length}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">বাকি আছে {courses.length - userProg.completedCourseIds.length}টি কোর্স</span>
        </div>

        {/* Quiz Average */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-slate-500">কুইজ পরীক্ষার গড় স্কোর</span>
          <div className="my-2">
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {avgQuizScore}%
            </span>
          </div>
          <span className="text-[11px] text-slate-400">{quizScores.length}টি পরীক্ষায় অংশগ্রহণ করেছেন</span>
        </div>

        {/* Paper Trading Orders */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-slate-500">ভার্চুয়াল ট্রেডিং প্র্যাকটিস</span>
          <div className="my-2">
            <span className="text-3xl font-black text-teal-600 dark:text-teal-400 font-mono">
              {userPortfolio.orders.length}
            </span>
            <span className="text-xs text-slate-400 ml-1">টি অর্ডার</span>
          </div>
          <span className="text-[11px] text-slate-400">ক্যাশ: ₹{userPortfolio.virtualBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
        </div>
      </div>

      {/* Course-by-Course Progress Breakdown */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          কোর্সভিত্তিক অগ্রগতি ও মূল্যায়ন
        </h3>

        <div className="space-y-3">
          {courses.map(course => {
            const courseLessons = lessons.filter(l => l.courseId === course.id);
            const completedCount = courseLessons.filter(l =>
              userProg.completedLessonIds.includes(l.id)
            ).length;
            const pct = courseLessons.length > 0 ? Math.round((completedCount / courseLessons.length) * 100) : 0;
            const score = userProg.quizScores[course.id];

            return (
              <div
                key={course.id}
                className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                      {course.title}
                    </h4>
                    {pct === 100 && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                        সম্পূর্ণ
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    {completedCount}/{courseLessons.length}টি লেসন শেষ হয়েছে
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  {/* Progress bar */}
                  <div className="w-36">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>সিলেবাস</span>
                      <span className="font-semibold font-mono">{pct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Quiz score badge */}
                  <div className="text-right w-24">
                    <span className="text-[10px] text-slate-400 block">কুইজ স্কোর</span>
                    <span className="text-xs font-bold font-mono text-slate-800 dark:text-slate-200">
                      {score !== undefined ? `${score}%` : 'দেওয়া হয়নি'}
                    </span>
                  </div>

                  <button
                    onClick={() => startCourse(course.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:bg-emerald-600 hover:text-white transition cursor-pointer"
                  >
                    চালিয়ে যান
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Earned Certificates List */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              অর্জিত সার্টিফিকেটসমূহ ({userCerts.length})
            </h3>
          </div>
        </div>

        {userCerts.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-2">
            <Award className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              এখনও কোনো সার্টিফিকেট অর্জিত হয়নি।
            </p>
            <p className="text-[11px] text-slate-400">
              একটি কোর্সের সব লেসন শেষ করে কুইজে ৬০% নম্বর পেলে আপনার সনদপত্র তৈরি হবে।
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {userCerts.map(cert => (
              <div
                key={cert.id}
                className="p-5 rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20 flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400">
                    ID: {cert.certificateId}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {cert.courseName}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    ইস্যু তারিখ: {cert.completionDate}
                  </span>
                </div>

                <button
                  onClick={() => setActiveCertificate(cert)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition cursor-pointer shadow-xs shrink-0"
                >
                  সার্টিফিকেট দেখুন
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Milestones & Badges */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 uppercase tracking-wider">
          লার্নিং মাইলস্টোন ও ব্যাজ
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition flex items-start gap-3 ${
                m.achieved
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/80'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 opacity-60'
              }`}
            >
              <span className="text-2xl">{m.icon}</span>
              <div>
                <div className="flex items-center gap-1.5">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {m.title}
                  </h5>
                  {m.achieved && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {m.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
