import React from 'react';
import { Home, BookOpen, GraduationCap, HelpCircle, BarChart3, LineChart, User, Shield } from 'lucide-react';
import { useApp, NavigationTab } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser } = useApp();

  const mobileNav = [
    { id: 'home' as NavigationTab, label: 'হোম', icon: Home },
    { id: 'courses' as NavigationTab, label: 'কোর্স', icon: BookOpen },
    { id: 'learn' as NavigationTab, label: 'শিখুন', icon: GraduationCap },
    { id: 'quiz' as NavigationTab, label: 'কুইজ', icon: HelpCircle },
    { id: 'paper-trading' as NavigationTab, label: 'ট্রেডিং', icon: BarChart3 },
    { id: 'progress' as NavigationTab, label: 'অগ্রগতি', icon: LineChart },
  ];

  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1 shadow-lg no-print">
      <div className="flex items-center justify-around">
        {mobileNav.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition cursor-pointer min-w-[50px] ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}

        {/* Profile or Admin */}
        {currentUser?.role === 'admin' ? (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition cursor-pointer min-w-[50px] ${
              activeTab === 'admin'
                ? 'text-amber-600 dark:text-amber-400 font-bold scale-105'
                : 'text-slate-500 dark:text-slate-400 font-medium'
            }`}
          >
            <Shield className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">এডমিন</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition cursor-pointer min-w-[50px] ${
              activeTab === 'profile'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold scale-105'
                : 'text-slate-500 dark:text-slate-400 font-medium'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">প্রোফাইল</span>
          </button>
        )}
      </div>
    </div>
  );
};
