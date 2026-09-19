import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { AuthModal } from './components/AuthModal';
import { CertificateModal } from './components/CertificateModal';

// Views
import { HomeView } from './components/HomeView';
import { CoursesView } from './components/CoursesView';
import { LessonView } from './components/LessonView';
import { QuizView } from './components/QuizView';
import { PaperTradingView } from './components/PaperTradingView';
import { ProgressView } from './components/ProgressView';
import { GlossaryView } from './components/GlossaryView';
import { ProfileView } from './components/ProfileView';
import { AdminPanelView } from './components/AdminPanelView';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {activeTab === 'home' && <HomeView />}
      {activeTab === 'courses' && <CoursesView />}
      {activeTab === 'learn' && <LessonView />}
      {activeTab === 'quiz' && <QuizView />}
      {activeTab === 'paper-trading' && <PaperTradingView />}
      {activeTab === 'progress' && <ProgressView />}
      {activeTab === 'glossary' && <GlossaryView />}
      {activeTab === 'profile' && <ProfileView />}
      {activeTab === 'admin' && <AdminPanelView />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white transition-colors duration-200">
        {/* Global Toast Alert */}
        <Toast />

        {/* Auth Modal (Login / Sign Up) */}
        <AuthModal />

        {/* Certificate Modal */}
        <CertificateModal />

        {/* Sticky Desktop/Mobile Navigation */}
        <Navbar />

        {/* Dynamic Main View */}
        <MainContent />

        {/* Statutory Legal & Educational Disclaimer Footer */}
        <Footer />

        {/* Mobile Navigation Bar */}
        <BottomNav />
      </div>
    </AppProvider>
  );
}
