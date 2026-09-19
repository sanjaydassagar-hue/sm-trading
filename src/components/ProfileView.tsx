import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Shield,
  Award,
  BookOpen,
  HelpCircle,
  Key,
  LogOut,
  Edit2,
  Check,
  X,
  Camera,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    changePassword,
    logout,
    getUserProgress,
    certificates,
    courses,
    openLoginModal,
    showToast,
  } = useApp();

  const userProg = getUserProgress();

  // Edit profile modal state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFullName, setEditFullName] = useState(currentUser?.fullName || '');
  const [editEmail, setEditEmail] = useState(currentUser?.email || '');
  const [editMobile, setEditMobile] = useState(currentUser?.mobile || '');

  // Change password modal state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  if (!currentUser) {
    return (
      <div className="text-center py-20 space-y-4">
        <User className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          প্রোফাইল দেখার জন্য লগইন করুন
        </h3>
        <button
          onClick={openLoginModal}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer shadow-md"
        >
          লগইন / সাইন আপ
        </button>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      fullName: editFullName,
      email: editEmail,
      mobile: editMobile,
    });
    setIsEditingProfile(false);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      showToast('নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না।', 'error');
      return;
    }
    if (newPass.length < 6) {
      showToast('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।', 'error');
      return;
    }

    const success = changePassword(currentPass, newPass);
    if (success) {
      setIsChangingPassword(false);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    }
  };

  const userCerts = certificates.filter(
    c => c.userId === currentUser.id || c.userId === 'user-demo'
  );

  const quizScores = Object.values(userProg.quizScores);
  const avgQuizScore = quizScores.length > 0 ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Profile Card Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative">
          <img
            src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser.fullName}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
          />
          <button
            onClick={() => showToast('প্রোফাইল ছবি পরিবর্তন ফিচার ডেমো ভার্সনে সংরক্ষিত।', 'info')}
            className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition cursor-pointer shadow-sm"
            title="ছবি পরিবর্তন"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
              {currentUser.fullName}
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {currentUser.role === 'admin' ? 'এডমিন পরিচালক' : 'শিক্ষার্থী (Student)'}
            </span>
          </div>

          <p className="text-xs text-slate-400 font-mono">@{currentUser.username}</p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <button
              onClick={() => {
                setEditFullName(currentUser.fullName);
                setEditEmail(currentUser.email);
                setEditMobile(currentUser.mobile);
                setIsEditingProfile(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>তথ্য সম্পাদনা (Edit Profile)</span>
            </button>

            <button
              onClick={() => setIsChangingPassword(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <Key className="w-3.5 h-3.5" />
              <span>পাসওয়ার্ড পরিবর্তন</span>
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-semibold hover:bg-rose-600 hover:text-white transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>
      </div>

      {/* Account Info Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Contact Details */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
            ব্যক্তিগত তথ্য (Profile Details)
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <User className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-slate-400 block text-[10px]">পূর্ণ নাম</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{currentUser.fullName}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <Mail className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-slate-400 block text-[10px]">ইমেইল এড্রেস</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{currentUser.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <Phone className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-slate-400 block text-[10px]">মোবাইল নম্বর</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{currentUser.mobile}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <GraduationCap className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-slate-400 block text-[10px]">লার্নিং লেভেল</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {currentUser.learningLevel || 'Beginner'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Records */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
            শিক্ষাগত পারফরম্যান্স ও সনদ
          </h3>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <BookOpen className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <span className="text-[11px] text-slate-500 block">কোর্স সমাপ্তি</span>
              <span className="text-xl font-black font-mono text-emerald-700 dark:text-emerald-300">
                {userProg.completedCourseIds.length} / {courses.length}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <HelpCircle className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <span className="text-[11px] text-slate-500 block">কুইজ গড় স্কোর</span>
              <span className="text-xl font-black font-mono text-amber-700 dark:text-amber-300">
                {avgQuizScore}%
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
              <Award className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <span className="text-[11px] text-slate-500 block">অর্জিত সনদপত্র</span>
              <span className="text-xl font-black font-mono text-purple-700 dark:text-purple-300">
                {userCerts.length}টি
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <Shield className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <span className="text-[11px] text-slate-500 block">লেসন শেষ</span>
              <span className="text-xl font-black font-mono text-blue-700 dark:text-blue-300">
                {userProg.completedLessonIds.length}টি
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Edit Profile */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                প্রোফাইল তথ্য সম্পাদনা
              </h4>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  পূর্ণ নাম (Full Name)
                </label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={e => setEditFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  ইমেইল (Email)
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  মোবাইল নম্বর (Mobile Number)
                </label>
                <input
                  type="tel"
                  required
                  value={editMobile}
                  onChange={e => setEditMobile(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Change Password */}
      {isChangingPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                পাসওয়ার্ড পরিবর্তন করুন
              </h4>
              <button
                onClick={() => setIsChangingPassword(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  বর্তমান পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  required
                  value={currentPass}
                  onChange={e => setCurrentPass(e.target.value)}
                  placeholder="বর্তমান পাসওয়ার্ড দিন"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  নতুন পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  required
                  value={newPass}
                  onChange={e => setNewPass(e.target.value)}
                  placeholder="কমপক্ষে ৬ অক্ষর"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  কনফার্ম নতুন পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  required
                  value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)}
                  placeholder="নতুন পাসওয়ার্ডটি আবার দিন"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition cursor-pointer"
                >
                  পাসওয়ার্ড আপডেট করুন
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
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
