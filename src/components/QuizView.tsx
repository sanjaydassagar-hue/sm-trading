import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const QuizView: React.FC = () => {
  const {
    courses,
    quizzes,
    selectedCourseId,
    setSelectedCourseId,
    submitQuizScore,
    getUserProgress,
    setActiveCertificate,
    certificates,
    currentUser,
    setActiveTab,
  } = useApp();

  const userProg = getUserProgress();
  const currentCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const currentQuiz = quizzes.find(q => q.courseId === currentCourse.id);
  const courseQuizzes = currentQuiz?.questions || [];

  // User answers state: questionId -> selectedOptionIndex
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizScoreResult, setQuizScoreResult] = useState<{
    correctCount: number;
    totalCount: number;
    percentage: number;
    grade: string;
  } | null>(null);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return; // locked after submission
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(selectedAnswers).length < courseQuizzes.length) {
      if (!confirm('আপনি এখনও সব প্রশ্নের উত্তর দেননি। জমা দিতে চান?')) {
        return;
      }
    }

    let correctCount = 0;
    courseQuizzes.forEach(q => {
      const correctIdx = q.correctAnswerIndex !== undefined ? q.correctAnswerIndex : q.correctOptionIndex;
      if (selectedAnswers[q.id] === correctIdx) {
        correctCount++;
      }
    });

    const totalCount = courseQuizzes.length;
    const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    let grade = 'F';
    if (percentage >= 90) grade = 'A+ (অসাধারণ)';
    else if (percentage >= 80) grade = 'A (চমৎকার)';
    else if (percentage >= 70) grade = 'B (ভালো)';
    else if (percentage >= 50) grade = 'C (পাস)';
    else grade = 'D (পুনরায় অনুশীলন প্রয়োজন)';

    setQuizScoreResult({
      correctCount,
      totalCount,
      percentage,
      grade,
    });
    setIsSubmitted(true);

    // Save to context and potentially award certificate
    submitQuizScore(currentCourse.id, percentage);
  };

  const handleRetryQuiz = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setQuizScoreResult(null);
  };

  const handleSwitchCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedAnswers({});
    setIsSubmitted(false);
    setQuizScoreResult(null);
  };

  // Check if certificate exists for this course
  const earnedCert = certificates.find(
    c => c.courseId === currentCourse.id && (c.userId === currentUser?.id || c.userId === 'user-demo')
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>কুইজ ও জ্ঞান মূল্যায়ন (Knowledge Check)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          কুইজ অনুশীলন ও পরীক্ষা
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          প্রতিটি কোর্সে ১০টি করে প্রশ্ন রয়েছে। সঠিক উত্তর দিলে পাবেন সাথে সাথে নির্ভুল ব্যাখ্যা ও সার্টিফিকেট অর্জনের সুযোগ।
        </p>
      </div>

      {/* Course Selection Horizontal Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {courses.map(course => {
          const isSelected = course.id === currentCourse.id;
          const prevScore = userProg.quizScores[course.id];
          return (
            <button
              key={course.id}
              onClick={() => handleSwitchCourse(course.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold shrink-0 transition cursor-pointer flex items-center gap-2 border ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
              }`}
            >
              <span>{course.title}</span>
              {prevScore !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  {prevScore}%
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Result Card (When submitted) */}
      {isSubmitted && quizScoreResult && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xl space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-white/20 text-white">
                কুইজ সমাপ্তি রিপোর্ট
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-2">
                "আপনার Quiz সফলভাবে সম্পন্ন হয়েছে।"
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100">
                কোর্স: {currentCourse.title}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRetryQuiz}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>আবার চেষ্টা করুন</span>
              </button>

              {earnedCert && (
                <button
                  onClick={() => setActiveCertificate(earnedCert)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition cursor-pointer shadow-md"
                >
                  <Award className="w-4 h-4" />
                  <span>সার্টিফিকেট দেখুন</span>
                </button>
              )}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs">
              <span className="text-xs text-emerald-200 block">সঠিক উত্তর</span>
              <p className="text-2xl font-black font-mono mt-1">
                {quizScoreResult.correctCount} / {quizScoreResult.totalCount}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs">
              <span className="text-xs text-emerald-200 block">প্রাপ্ত নম্বর</span>
              <p className="text-2xl font-black font-mono mt-1">
                {quizScoreResult.percentage}%
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs">
              <span className="text-xs text-emerald-200 block">ফলাফল গ্রেড</span>
              <p className="text-lg font-bold mt-1 truncate">
                {quizScoreResult.grade}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs">
              <span className="text-xs text-emerald-200 block">স্ট্যাটাস</span>
              <p className="text-lg font-bold mt-1">
                {quizScoreResult.percentage >= 60 ? 'পাস (কৃতকার্য)' : 'পুনরায় চেষ্টা করুন'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 10 Questions List */}
      <div className="space-y-6">
        {courseQuizzes.map((quiz, qIdx) => {
          const correctIdx = quiz.correctAnswerIndex !== undefined ? quiz.correctAnswerIndex : quiz.correctOptionIndex;
          const userAnswer = selectedAnswers[quiz.id];
          const hasAnswered = userAnswer !== undefined;
          const isCorrect = isSubmitted && userAnswer === correctIdx;
          const isWrong = isSubmitted && hasAnswered && userAnswer !== correctIdx;

          return (
            <div
              key={quiz.id}
              className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border transition ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-500/80 bg-emerald-50/20 dark:bg-emerald-950/20'
                    : isWrong
                    ? 'border-rose-500/80 bg-rose-50/20 dark:bg-rose-950/20'
                    : 'border-slate-200 dark:border-slate-800'
                  : 'border-slate-200 dark:border-slate-800 shadow-xs'
              }`}
            >
              {/* Question header */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {qIdx + 1}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {quiz.question}
                  </h3>
                </div>

                {isSubmitted && (
                  <div>
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-4 h-4" />
                        সঠিক
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-950 px-2.5 py-1 rounded-full">
                        <XCircle className="w-4 h-4" />
                        ভুল
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* 4 Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {quiz.options.map((option, optIdx) => {
                  const isOptionSelected = userAnswer === optIdx;
                  const isRightOption = isSubmitted && optIdx === correctIdx;
                  const isWrongOption = isSubmitted && isOptionSelected && !isRightOption;

                  let optionStyles = 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700';

                  if (isOptionSelected && !isSubmitted) {
                    optionStyles = 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold shadow-xs';
                  } else if (isRightOption) {
                    optionStyles = 'border-emerald-600 bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 font-bold';
                  } else if (isWrongOption) {
                    optionStyles = 'border-rose-500 bg-rose-100/70 dark:bg-rose-950/60 text-rose-950 dark:text-rose-200 font-bold';
                  }

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleSelectOption(quiz.id, optIdx)}
                      className={`p-3.5 rounded-2xl border text-xs sm:text-sm cursor-pointer transition flex items-center justify-between ${optionStyles}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center text-xs font-semibold shrink-0">
                          {['ক', 'খ', 'গ', 'ঘ'][optIdx]}
                        </span>
                        <span className="leading-relaxed">{option}</span>
                      </div>
                      {isRightOption && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      {isWrongOption && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                    </div>
                  );
                })}
              </div>

              {/* Bengali Explanation (Always shown after submit) */}
              {isSubmitted && (
                <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 block mb-0.5">
                      ব্যাখ্যা (Explanation):
                    </span>
                    <p className="leading-relaxed">{quiz.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quiz Submit Button at bottom */}
      {!isSubmitted && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md sticky bottom-16 sm:bottom-4 z-20">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            উত্তর দিয়েছেন: {Object.keys(selectedAnswers).length} / {courseQuizzes.length}টি প্রশ্ন
          </div>
          <button
            onClick={handleSubmitQuiz}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>কুইজ জমা দিন (Submit Quiz)</span>
          </button>
        </div>
      )}
    </div>
  );
};
