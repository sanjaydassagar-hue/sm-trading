import React, { useState } from 'react';
import {
  Shield,
  BookOpen,
  Plus,
  Trash2,
  Edit,
  Users,
  Award,
  Bell,
  HelpCircle,
  CheckCircle2,
  X,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminPanelView: React.FC = () => {
  const {
    currentUser,
    courses,
    lessons,
    quizzes,
    allUsers,
    certificates,
    addCourse,
    deleteCourse,
    addLesson,
    deleteLesson,
    addQuizQuestion,
    broadcastNotification,
    showToast,
    setActiveCertificate,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'courses' | 'lessons' | 'quizzes' | 'users' | 'certificates' | 'broadcast'>('courses');

  // Form states for adding items
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCourseBadge, setNewCourseBadge] = useState('নতুন স্পেশাল');
  const [newCourseDuration, setNewCourseDuration] = useState('১.৫ ঘণ্টা');

  const [showAddLesson, setShowAddLesson] = useState(false);
  const [selectedCourseForLesson, setSelectedCourseForLesson] = useState(courses[0]?.id || '');
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonExpl, setNewLessonExpl] = useState('');
  const [newLessonExample, setNewLessonExample] = useState('');
  const [newLessonPoint, setNewLessonPoint] = useState('');

  const [showAddQuiz, setShowAddQuiz] = useState(false);
  const [selectedCourseForQuiz, setSelectedCourseForQuiz] = useState(courses[0]?.id || '');
  const [newQuizQ, setNewQuizQ] = useState('');
  const [newQuizOpt0, setNewQuizOpt0] = useState('');
  const [newQuizOpt1, setNewQuizOpt1] = useState('');
  const [newQuizOpt2, setNewQuizOpt2] = useState('');
  const [newQuizOpt3, setNewQuizOpt3] = useState('');
  const [newQuizCorrect, setNewQuizCorrect] = useState(0);
  const [newQuizExpl, setNewQuizExpl] = useState('');

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // Admin access guard
  if (currentUser?.role !== 'admin') {
    return (
      <div className="text-center py-20 space-y-4">
        <Shield className="w-12 h-12 text-rose-500 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          এডমিন অনুমতি প্রয়োজন
        </h3>
        <p className="text-xs text-slate-500">
          এই পৃষ্ঠাটি শুধুমাত্র এডমিন অ্যাকাউন্টের (admin / Admin@12345) জন্য নির্ধারিত।
        </p>
      </div>
    );
  }

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle || !newCourseDesc) {
      showToast('কোর্সের শিরোনাম ও বিবরণ প্রদান করুন।', 'error');
      return;
    }

    addCourse({
      id: `c-custom-${Date.now()}`,
      title: newCourseTitle,
      slug: `custom-${Date.now()}`,
      badgeBn: newCourseBadge,
      level: 'Beginner',
      duration: newCourseDuration,
      description: newCourseDesc,
      topics: ['মৌলিক ধারণা', 'চার্ট স্টাডি', 'রিস্ক ম্যানেজমেন্ট'],
      iconName: 'TrendingUp',
      order: courses.length + 1,
    });

    setShowAddCourse(false);
    setNewCourseTitle('');
    setNewCourseDesc('');
  };

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLessonTitle || !newLessonExpl) {
      showToast('লেসনের শিরোনাম ও বিস্তারিত প্রদান করুন।', 'error');
      return;
    }

    const courseLessonsCount = lessons.filter(l => l.courseId === selectedCourseForLesson).length;

    addLesson({
      id: `l-custom-${Date.now()}`,
      courseId: selectedCourseForLesson,
      topicIndex: courseLessonsCount,
      title: newLessonTitle,
      durationMinutes: 15,
      explanation: newLessonExpl,
      simpleExamples: newLessonExample ? [newLessonExample] : ['বাস্তব উদাহরণ সংযুক্ত করা হয়েছে।'],
      importantPoints: newLessonPoint ? [newLessonPoint] : ['কঠোরভাবে রিস্ক ম্যানেজমেন্ট অনুসরণ করুন।'],
    });

    setShowAddLesson(false);
    setNewLessonTitle('');
    setNewLessonExpl('');
    setNewLessonExample('');
    setNewLessonPoint('');
  };

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuizQ || !newQuizOpt0 || !newQuizOpt1 || !newQuizOpt2 || !newQuizOpt3) {
      showToast('সবগুলো প্রশ্নের অপশন পূরণ করুন।', 'error');
      return;
    }

    addQuizQuestion(selectedCourseForQuiz, {
      id: `q-custom-${Date.now()}`,
      question: newQuizQ,
      options: [newQuizOpt0, newQuizOpt1, newQuizOpt2, newQuizOpt3],
      correctOptionIndex: Number(newQuizCorrect),
      correctAnswerIndex: Number(newQuizCorrect),
      explanation: newQuizExpl || 'সঠিক উত্তর যাচাই করে দেওয়া হলো।',
    });

    setShowAddQuiz(false);
    setNewQuizQ('');
    setNewQuizOpt0('');
    setNewQuizOpt1('');
    setNewQuizOpt2('');
    setNewQuizOpt3('');
    setNewQuizExpl('');
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) {
      showToast('বিজ্ঞপ্তির শিরোনাম এবং মেসেজ লিখুন।', 'error');
      return;
    }

    broadcastNotification(broadcastTitle, broadcastMessage);
    setBroadcastTitle('');
    setBroadcastMessage('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
              এডমিন কন্ট্রোল প্যানেল
            </span>
            <span className="text-xs text-amber-400">রুট এক্সেস সক্রিয়</span>
          </div>
          <h1 className="text-2xl font-black">
            SM TRADING এডমিনিস্ট্রেশন
          </h1>
          <p className="text-xs text-slate-400">
            কোর্স, পাঠ্যক্রম, কুইজ প্রশ্ন ও নিবন্ধিত শিক্ষার্থীদের অগ্রগতি ব্যবস্থাপনা করুন।
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { id: 'courses', label: 'কোর্সসমূহ', count: courses.length, icon: BookOpen },
          { id: 'lessons', label: 'পাঠ্যক্রম (Lessons)', count: lessons.length, icon: BookOpen },
          { id: 'quizzes', label: 'কুইজ প্রশ্নসমূহ', count: quizzes.length, icon: HelpCircle },
          { id: 'users', label: 'শিক্ষার্থী ও অগ্রগতি', count: allUsers.length, icon: Users },
          { id: 'certificates', label: 'ইস্যুকৃত সনদপত্র', count: certificates.length, icon: Award },
          { id: 'broadcast', label: 'সিস্টেম বিজ্ঞপ্তি প্রেরণ', icon: Bell },
        ].map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition cursor-pointer border ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-white/10">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Courses Management */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              সকল কোর্স তালিকা ({courses.length})
            </h3>
            <button
              onClick={() => setShowAddCourse(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন কোর্স তৈরি</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(course => (
              <div
                key={course.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {course.badgeBn}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">{course.id}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">
                    {course.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">{course.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">সময়: {course.duration}</span>
                  <button
                    onClick={() => {
                      if (confirm(`আপনি কি "${course.title}" কোর্সটি ডিলিট করতে চান?`)) {
                        deleteCourse(course.id);
                      }
                    }}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
                    title="কোর্স ডিলিট"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Lessons Management */}
      {activeTab === 'lessons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              সকল লেসন তালিকা ({lessons.length})
            </h3>
            <button
              onClick={() => setShowAddLesson(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন পাঠ্য যোগ করুন</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                  <th className="p-3">আইডি</th>
                  <th className="p-3">শিরোনাম</th>
                  <th className="p-3">কোর্স</th>
                  <th className="p-3">সময়</th>
                  <th className="p-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {lessons.map(lesson => {
                  const courseObj = courses.find(c => c.id === lesson.courseId);
                  return (
                    <tr key={lesson.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-mono text-slate-400">{lesson.id}</td>
                      <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                        {lesson.title}
                      </td>
                      <td className="p-3 text-slate-500">{courseObj?.title || lesson.courseId}</td>
                      <td className="p-3">{lesson.durationMinutes} মিনিট</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`আপনি কি "${lesson.title}" পাঠটি ডিলিট করতে চান?`)) {
                              deleteLesson(lesson.id);
                            }
                          }}
                          className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Quizzes Management */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              কুইজ প্রশ্ন ভাণ্ডার ({quizzes.length})
            </h3>
            <button
              onClick={() => setShowAddQuiz(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন কুইজ প্রশ্ন তৈরি</span>
            </button>
          </div>

          <div className="space-y-3">
            {quizzes.flatMap(quiz => {
              const courseObj = courses.find(c => c.id === quiz.courseId);
              return quiz.questions.map((q, idx) => {
                const correctIdx = q.correctAnswerIndex !== undefined ? q.correctAnswerIndex : q.correctOptionIndex;
                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                        {courseObj?.title || quiz.courseId}
                      </span>
                      <span className="text-[11px] text-emerald-600 font-semibold">
                        সঠিক উত্তর: অপশন #{correctIdx + 1}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {idx + 1}. {q.question}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400 pt-1">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-lg border text-[11px] ${
                            oIdx === correctIdx
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold'
                              : 'border-slate-100 dark:border-slate-800'
                          }`}
                        >
                          {['ক', 'খ', 'গ', 'ঘ'][oIdx]}. {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              });
            })}
          </div>
        </div>
      )}

      {/* TAB 4: Registered Users & Learning Progress */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            নিবন্ধিত শিক্ষার্থী তালিকা ({allUsers.length})
          </h3>

          <div className="overflow-x-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400">
                  <th className="p-3">শিক্ষার্থী নাম</th>
                  <th className="p-3">ইউজারনেম</th>
                  <th className="p-3">ইমেইল</th>
                  <th className="p-3">মোবাইল</th>
                  <th className="p-3">রোল</th>
                  <th className="p-3">লেভেল</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {allUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">
                      {u.fullName}
                    </td>
                    <td className="p-3 font-mono text-emerald-600">@{u.username}</td>
                    <td className="p-3 text-slate-500">{u.email}</td>
                    <td className="p-3 text-slate-500">{u.mobile}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'admin'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">{u.learningLevel || 'Beginner'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Certificates Management */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            ইস্যুকৃত অফিসিয়াল সার্টিফিকেটসমূহ ({certificates.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map(cert => (
              <div
                key={cert.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                    ID: {cert.certificateId}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {cert.studentName} (@{cert.username})
                  </h4>
                  <p className="text-xs text-slate-500">{cert.courseName}</p>
                  <span className="text-[10px] text-slate-400">তারিখ: {cert.completionDate}</span>
                </div>

                <button
                  onClick={() => setActiveCertificate(cert)}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition cursor-pointer"
                >
                  সার্টিফিকেট দেখুন
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Broadcast Notifications */}
      {activeTab === 'broadcast' && (
        <div className="max-w-xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              সকল শিক্ষার্থীর জন্য সাধারণ নোটিফিকেশন পাঠান
            </h3>
            <p className="text-xs text-slate-500">
              এখানে প্রেরিত নোটিফিকেশন সব ব্যবহারকারীর নোটিফিকেশন বেল আইকনে তাৎক্ষণিকভাবে পৌঁছে যাবে।
            </p>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-3 text-xs">
            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                বিজ্ঞপ্তির শিরোনাম (Title)
              </label>
              <input
                type="text"
                required
                value={broadcastTitle}
                onChange={e => setBroadcastTitle(e.target.value)}
                placeholder="যেমন: নতুন টেকনিক্যাল এনালাইসিস কুইজ যোগ করা হয়েছে!"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                বিস্তারিত বার্তা (Message)
              </label>
              <textarea
                rows={3}
                required
                value={broadcastMessage}
                onChange={e => setBroadcastMessage(e.target.value)}
                placeholder="সবাইকে জানানো যাচ্ছে যে..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition cursor-pointer"
            >
              ব্রডকাস্ট নোটিফিকেশন পাঠান
            </button>
          </form>
        </div>
      )}

      {/* Modal: Add Course */}
      {showAddCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                নতুন কোর্স তৈরি করুন
              </h4>
              <button onClick={() => setShowAddCourse(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  কোর্সের নাম (Course Title)
                </label>
                <input
                  type="text"
                  required
                  value={newCourseTitle}
                  onChange={e => setNewCourseTitle(e.target.value)}
                  placeholder="যেমন: অপশন ট্রেডিং স্ট্র্যাটেজি"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  সংক্ষিপ্ত বিবরণ (Description)
                </label>
                <textarea
                  rows={3}
                  required
                  value={newCourseDesc}
                  onChange={e => setNewCourseDesc(e.target.value)}
                  placeholder="কোর্সের শিক্ষণীয় বিষয় সংক্ষেপে লিখুন..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    ব্যাজ লেবেল
                  </label>
                  <input
                    type="text"
                    value={newCourseBadge}
                    onChange={e => setNewCourseBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                    সময়কাল
                  </label>
                  <input
                    type="text"
                    value={newCourseDuration}
                    onChange={e => setNewCourseDuration(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCourse(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600"
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Lesson */}
      {showAddLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                নতুন পাঠ (Lesson) যোগ করুন
              </h4>
              <button onClick={() => setShowAddLesson(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateLesson} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  কোর্স নির্বাচন করুন
                </label>
                <select
                  value={selectedCourseForLesson}
                  onChange={e => setSelectedCourseForLesson(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  পাঠের শিরোনাম (Lesson Title)
                </label>
                <input
                  type="text"
                  required
                  value={newLessonTitle}
                  onChange={e => setNewLessonTitle(e.target.value)}
                  placeholder="যেমন: ভলিউম এনালাইসিসের জাদু"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  বিস্তারিত ব্যাখ্যা (Explanation)
                </label>
                <textarea
                  rows={4}
                  required
                  value={newLessonExpl}
                  onChange={e => setNewLessonExpl(e.target.value)}
                  placeholder="সহজ বাংলায় বিস্তারিত ব্যাখ্যা..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                ></textarea>
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  বাস্তব উদাহরণ (Example)
                </label>
                <input
                  type="text"
                  value={newLessonExample}
                  onChange={e => setNewLessonExample(e.target.value)}
                  placeholder="যেমন: আলুর বাজারে হঠাৎ ক্রেতা বেড়ে যাওয়া..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  জরুরি নিয়ম (Important Point)
                </label>
                <input
                  type="text"
                  value={newLessonPoint}
                  onChange={e => setNewLessonPoint(e.target.value)}
                  placeholder="যেমন: কখনও ভলিউম ছাড়া ব্রেকআউট বিশ্বাস করবেন না।"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddLesson(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600"
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Quiz Question */}
      {showAddQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                নতুন কুইজ প্রশ্ন তৈরি করুন
              </h4>
              <button onClick={() => setShowAddQuiz(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateQuiz} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  কোর্স নির্বাচন করুন
                </label>
                <select
                  value={selectedCourseForQuiz}
                  onChange={e => setSelectedCourseForQuiz(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  প্রশ্নটি লিখুন (Question)
                </label>
                <input
                  type="text"
                  required
                  value={newQuizQ}
                  onChange={e => setNewQuizQ(e.target.value)}
                  placeholder="যেমন: হ্যামার ক্যান্ডেলের উইক সাধারণত শরীরের কত গুণ হয়?"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-500 block mb-0.5">অপশন ১ (ক)</label>
                  <input
                    type="text"
                    required
                    value={newQuizOpt0}
                    onChange={e => setNewQuizOpt0(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-0.5">অপশন ২ (খ)</label>
                  <input
                    type="text"
                    required
                    value={newQuizOpt1}
                    onChange={e => setNewQuizOpt1(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-0.5">অপশন ৩ (গ)</label>
                  <input
                    type="text"
                    required
                    value={newQuizOpt2}
                    onChange={e => setNewQuizOpt2(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-500 block mb-0.5">অপশন ৪ (ঘ)</label>
                  <input
                    type="text"
                    required
                    value={newQuizOpt3}
                    onChange={e => setNewQuizOpt3(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  সঠিক অপশন নির্বাচন
                </label>
                <select
                  value={newQuizCorrect}
                  onChange={e => setNewQuizCorrect(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value={0}>অপশন ১ (ক)</option>
                  <option value={1}>অপশন ২ (খ)</option>
                  <option value={2}>অপশন ৩ (গ)</option>
                  <option value={3}>অপশন ৪ (ঘ)</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  ব্যাখ্যা (Explanation)
                </label>
                <textarea
                  rows={2}
                  value={newQuizExpl}
                  onChange={e => setNewQuizExpl(e.target.value)}
                  placeholder="কেন এই উত্তরটি সঠিক তার বাংলা ব্যাখ্যা..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddQuiz(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600"
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
