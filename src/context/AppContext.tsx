import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  Course,
  Lesson,
  Quiz,
  QuizResult,
  QuizAnswerRecord,
  UserProgress,
  StockQuote,
  PaperPortfolio,
  PaperOrder,
  PaperHolding,
  Certificate,
  NotificationItem,
  TradingTerm,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_COURSES,
  INITIAL_LESSONS,
  INITIAL_QUIZZES,
  INITIAL_STOCKS,
  TRADING_GLOSSARY,
} from '../data/initialData';

export type NavigationTab = 
  | 'home'
  | 'courses'
  | 'learn'
  | 'quiz'
  | 'paper-trading'
  | 'progress'
  | 'glossary'
  | 'profile'
  | 'admin';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  // Navigation & UI
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  toast: ToastMessage | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  clearToast: () => void;

  // Authentication
  currentUser: User | null;
  login: (identifier: string, pass: string, rememberMe?: boolean) => { success: boolean; message: string };
  signUp: (data: {
    fullName: string;
    username: string;
    email: string;
    mobile: string;
    password: string;
  }) => { success: boolean; message: string };
  logout: () => void;
  allUsers: User[];
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  openLoginModal: () => void;
  openSignUpModal: () => void;

  // Learning & Courses
  courses: Course[];
  lessons: Lesson[];
  quizzes: Quiz[];
  currentCourseId: string;
  selectedCourseId: string;
  setCurrentCourseId: (id: string) => void;
  setSelectedCourseId: (id: string) => void;
  currentLessonId: string;
  selectedLessonId: string;
  setCurrentLessonId: (id: string) => void;
  setSelectedLessonId: (id: string) => void;
  currentQuizCourseId: string;
  setCurrentQuizCourseId: (id: string) => void;
  startCourse: (courseId: string) => void;
  openLesson: (lessonId: string, courseId: string) => void;
  markLessonComplete: (lessonId: string, courseId: string) => void;
  getUserProgress: (userId?: string) => UserProgress;
  glossary: TradingTerm[];

  // Quiz
  submitQuiz: (courseId: string, answers: QuizAnswerRecord[]) => QuizResult;
  submitQuizScore: (courseId: string, score: number) => void;
  quizResults: QuizResult[];

  // Certificates
  certificates: Certificate[];
  activeCertificate: Certificate | null;
  setActiveCertificate: (cert: Certificate | null) => void;
  generateCertificate: (courseId: string) => Certificate;

  // Paper Trading
  stocks: StockQuote[];
  selectedStockSymbol: string;
  setSelectedStockSymbol: (sym: string) => void;
  userPortfolio: PaperPortfolio;
  executePaperTrade: (params: {
    symbol: string;
    stockName?: string;
    type: 'BUY' | 'SELL';
    quantity: number;
    orderType: 'MARKET' | 'LIMIT';
    limitPrice?: number;
  }) => { success: boolean; message: string };
  resetPaperTradingBalance: () => void;
  resetPaperBalance: () => void;

  // User & Profile
  updateUserProfile: (data: { fullName: string; email: string; mobile: string }) => void;
  changePassword: (currentPass: string, newPass: string) => boolean;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  sendNotification: (title: string, message: string, type?: NotificationItem['type'], targetUserId?: string) => void;
  broadcastNotification: (title: string, message: string) => void;

  // Admin Actions
  addCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (courseId: string) => void;
  addLesson: (lesson: Lesson) => void;
  updateLesson: (lesson: Lesson) => void;
  deleteLesson: (lessonId: string) => void;
  addQuizQuestion: (courseId: string, question: Quiz['questions'][0]) => void;
  deleteQuizQuestion: (courseId: string, questionId: string) => void;
}

const STORAGE_KEY_PREFIX = 'sm_trading_v1_';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}theme`);
    return (saved as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}theme`, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  // Toast
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, type, message });
    setTimeout(() => {
      setToast(curr => (curr?.id === id ? null : curr));
    }, 4500);
  }, []);

  const clearToast = () => setToast(null);

  // Navigation state
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  const openLoginModal = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const openSignUpModal = () => {
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  };

  // Users database
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}users`);
    return stored ? JSON.parse(stored) : INITIAL_USERS;
  });

  // Current active user
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}active_user`);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    // Default to demo_user for immediate convenient exploration
    return INITIAL_USERS[0];
  });

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}active_user`, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}active_user`);
    }
  }, [currentUser]);

  // Courses & Lessons & Quizzes
  const [courses, setCourses] = useState<Course[]>(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}courses`);
    return stored ? JSON.parse(stored) : INITIAL_COURSES;
  });

  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}lessons`);
    return stored ? JSON.parse(stored) : INITIAL_LESSONS;
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}quizzes`);
    return stored ? JSON.parse(stored) : INITIAL_QUIZZES;
  });

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}courses`, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}lessons`, JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}quizzes`, JSON.stringify(quizzes));
  }, [quizzes]);

  // Active navigation pointers
  const [currentCourseId, setCurrentCourseId] = useState<string>('course-1');
  const [currentLessonId, setCurrentLessonId] = useState<string>('c1-l1');
  const [currentQuizCourseId, setCurrentQuizCourseId] = useState<string>('course-1');

  // User Progress table: Record<userId, UserProgress>
  const [userProgressMap, setUserProgressMap] = useState<Record<string, UserProgress>>(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}progress`);
    if (stored) return JSON.parse(stored);
    // Initial progress for demo user:
    return {
      'user-demo': {
        userId: 'user-demo',
        completedLessonIds: ['c1-l1', 'c1-l2', 'c1-l3', 'c1-l4', 'c2-l1'],
        completedCourseIds: [],
        quizScores: {
          'course-1': 80,
        },
        lastActiveCourseId: 'course-1',
        lastActiveLessonId: 'c1-l5',
        updatedAt: new Date().toISOString(),
      },
    };
  });

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}progress`, JSON.stringify(userProgressMap));
  }, [userProgressMap]);

  const getUserProgress = useCallback((userId?: string): UserProgress => {
    const uid = userId || currentUser?.id || 'guest';
    if (userProgressMap[uid]) {
      return userProgressMap[uid];
    }
    return {
      userId: uid,
      completedLessonIds: [],
      completedCourseIds: [],
      quizScores: {},
      updatedAt: new Date().toISOString(),
    };
  }, [currentUser, userProgressMap]);

  // Quiz results
  const [quizResults, setQuizResults] = useState<QuizResult[]>(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}quiz_results`);
    return stored ? JSON.parse(stored) : [
      {
        id: 'qr-sample-1',
        userId: 'user-demo',
        quizId: 'quiz-course-1',
        courseId: 'course-1',
        courseTitle: 'শেয়ার বাজারের প্রাথমিক ধারণা',
        score: 8,
        totalQuestions: 10,
        percentage: 80,
        completedAt: '২০২৫-০২-১০ ১০:৩০',
        answers: [],
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}quiz_results`, JSON.stringify(quizResults));
  }, [quizResults]);

  // Certificates
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}certificates`);
    return stored ? JSON.parse(stored) : [];
  });

  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}certificates`, JSON.stringify(certificates));
  }, [certificates]);

  // Paper Trading Stocks & Live tick simulator
  const [stocks, setStocks] = useState<StockQuote[]>(INITIAL_STOCKS);
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<string>('RELIANCE');

  // Simulated live ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev =>
        prev.map(stock => {
          // Slight random tick -0.3% to +0.3%
          const delta = (Math.random() - 0.48) * (stock.currentPrice * 0.003);
          const newPrice = Math.max(10, +(stock.currentPrice + delta).toFixed(2));
          const change = +(newPrice - stock.previousClose).toFixed(2);
          const changePercent = +((change / stock.previousClose) * 100).toFixed(2);
          const high = Math.max(stock.high, newPrice);
          const low = Math.min(stock.low, newPrice);

          return {
            ...stock,
            currentPrice: newPrice,
            change,
            changePercent,
            high,
            low,
          };
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Portfolios: Record<userId, PaperPortfolio>
  const [portfolios, setPortfolios] = useState<Record<string, PaperPortfolio>>(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}portfolios`);
    if (stored) return JSON.parse(stored);
    return {
      'user-demo': {
        userId: 'user-demo',
        virtualBalance: 85297.50,
        initialBalance: 100000,
        holdings: [
          {
            symbol: 'RELIANCE',
            stockName: 'Reliance Industries Ltd.',
            quantity: 5,
            averageBuyPrice: 2940.50,
            currentPrice: 2940.50,
            totalInvested: 14702.50,
            currentValue: 14702.50,
            unrealizedPnL: 0,
            unrealizedPnLPercent: 0,
          },
        ],
        orders: [
          {
            id: 'ord-init-1',
            userId: 'user-demo',
            symbol: 'RELIANCE',
            stockName: 'Reliance Industries Ltd.',
            type: 'BUY',
            orderType: 'MARKET',
            quantity: 5,
            price: 2940.50,
            totalAmount: 14702.50,
            timestamp: '২০২৫-০২-১২ ১০:১৫',
            status: 'EXECUTED',
          }
        ],
      }
    };
  });

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}portfolios`, JSON.stringify(portfolios));
  }, [portfolios]);

  // Compute live current portfolio for active user
  const userPortfolio: PaperPortfolio = React.useMemo(() => {
    const uid = currentUser?.id || 'guest';
    const basePortfolio = portfolios[uid] || {
      userId: uid,
      virtualBalance: 100000,
      initialBalance: 100000,
      holdings: [],
      orders: [],
    };

    // Update currentPrice and PnL for each holding according to current stock prices
    const enrichedHoldings: PaperHolding[] = basePortfolio.holdings.map(holding => {
      const liveStock = stocks.find(s => s.symbol === holding.symbol);
      const curPrice = liveStock ? liveStock.currentPrice : holding.averageBuyPrice;
      const currentValue = +(curPrice * holding.quantity).toFixed(2);
      const unrealizedPnL = +(currentValue - holding.totalInvested).toFixed(2);
      const unrealizedPnLPercent = holding.totalInvested > 0
        ? +((unrealizedPnL / holding.totalInvested) * 100).toFixed(2)
        : 0;

      return {
        ...holding,
        currentPrice: curPrice,
        currentValue,
        unrealizedPnL,
        unrealizedPnLPercent,
      };
    });

    return {
      ...basePortfolio,
      holdings: enrichedHoldings,
    };
  }, [currentUser, portfolios, stocks]);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}notifications`);
    return stored ? JSON.parse(stored) : [
      {
        id: 'notif-1',
        userId: 'all',
        title: 'স্বাগতম SM TRADING-এ!',
        message: 'বাংলায় সহজ ভাষায় শেয়ার বাজার শেখা শুরু করুন। প্রথম কোর্সটি এখনই ভিজিট করুন।',
        type: 'course',
        read: false,
        timestamp: '১০ মিনিট আগে',
        targetTab: 'courses',
      },
      {
        id: 'notif-2',
        userId: 'all',
        title: '₹১,০০,০০০ পেপার ট্রেডিং ব্যালেন্স প্রস্তুত',
        message: 'বিনা ঝুঁকিতে ভার্চুয়াল টাকা দিয়ে রিলায়েন্স ও টিসিএস-এ ট্রেড প্র্যাকটিস করুন।',
        type: 'reminder',
        read: false,
        timestamp: '১ ঘণ্টা আগে',
        targetTab: 'paper-trading',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}notifications`, JSON.stringify(notifications));
  }, [notifications]);

  const unreadNotificationCount = notifications.filter(
    n => !n.read && (n.userId === 'all' || n.userId === currentUser?.id)
  ).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev =>
      prev.map(n =>
        n.userId === 'all' || n.userId === currentUser?.id ? { ...n, read: true } : n
      )
    );
  };

  const sendNotification = (
    title: string,
    message: string,
    type: NotificationItem['type'] = 'system',
    targetUserId: string = 'all'
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: targetUserId,
      title,
      message,
      type,
      read: false,
      timestamp: 'এখনই',
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Auth Methods
  const login = (identifier: string, pass: string) => {
    const cleanIdent = identifier.trim().toLowerCase();
    const userFound = users.find(
      u =>
        (u.username.toLowerCase() === cleanIdent || u.email.toLowerCase() === cleanIdent) &&
        u.password === pass
    );

    if (!userFound) {
      showToast('Username অথবা Password ভুল হয়েছে।', 'error');
      return { success: false, message: 'Username অথবা Password ভুল হয়েছে।' };
    }

    setCurrentUser(userFound);
    setIsAuthModalOpen(false);
    showToast('স্বাগতম! SM TRADING-এ আপনার Learning Dashboard প্রস্তুত।', 'success');
    return { success: true, message: 'স্বাগতম! SM TRADING-এ আপনার Learning Dashboard প্রস্তুত।' };
  };

  const signUp = (data: {
    fullName: string;
    username: string;
    email: string;
    mobile: string;
    password: string;
  }) => {
    const cleanUsername = data.username.trim().toLowerCase();
    const cleanEmail = data.email.trim().toLowerCase();

    // Check duplicate
    if (users.some(u => u.username.toLowerCase() === cleanUsername)) {
      showToast('এই Username ইতিপূর্বে ব্যবহার করা হয়েছে।', 'error');
      return { success: false, message: 'এই Username ইতিপূর্বে ব্যবহার করা হয়েছে।' };
    }
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      showToast('এই Email দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা আছে।', 'error');
      return { success: false, message: 'এই Email দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা আছে।' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName: data.fullName.trim(),
      username: data.username.trim(),
      email: data.email.trim(),
      mobile: data.mobile.trim(),
      password: data.password,
      role: 'user',
      createdAt: new Date().toISOString().split('T')[0],
      learningLevel: 'Beginner',
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);

    // Initialize clean portfolio with ₹1,00,000
    setPortfolios(prev => ({
      ...prev,
      [newUser.id]: {
        userId: newUser.id,
        virtualBalance: 100000,
        initialBalance: 100000,
        holdings: [],
        orders: [],
      },
    }));

    showToast('আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।', 'success');
    sendNotification(
      'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে',
      `স্বাগতম ${newUser.fullName}! SM TRADING-এ আপনার শেখার যাত্রা শুরু করুন।`,
      'reminder',
      newUser.id
    );

    return { success: true, message: 'আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।' };
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveTab('home');
    showToast('সফলভাবে লগআউট হয়েছে।', 'info');
  };

  // Learning actions
  const startCourse = (courseId: string) => {
    setCurrentCourseId(courseId);
    const firstLesson = lessons.find(l => l.courseId === courseId && l.topicIndex === 0);
    if (firstLesson) {
      setCurrentLessonId(firstLesson.id);
    }
    setActiveTab('learn');
  };

  const openLesson = (lessonId: string, courseId: string) => {
    setCurrentCourseId(courseId);
    setCurrentLessonId(lessonId);
    setActiveTab('learn');
  };

  // Generate certificate
  const generateCertificate = useCallback((courseId: string): Certificate => {
    const course = courses.find(c => c.id === courseId);
    const courseName = course ? course.title : 'ট্রেডিং কোর্স';
    const studentName = currentUser ? currentUser.fullName : 'সুমন দাশ';
    const username = currentUser ? currentUser.username : 'demo_user';
    const certId = `SM-${courseId.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      certificateId: certId,
      userId: currentUser?.id || 'guest',
      studentName,
      username,
      courseId,
      courseName,
      completionDate: new Date().toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      issueDate: new Date().toISOString(),
      verificationCode: `VERIFIED-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    };

    setCertificates(prev => {
      // Don't duplicate if already earned
      const exists = prev.find(c => c.userId === newCert.userId && c.courseId === courseId);
      if (exists) return prev;
      return [...prev, newCert];
    });

    return newCert;
  }, [courses, currentUser]);

  const markLessonComplete = (lessonId: string, courseId: string) => {
    const uid = currentUser?.id || 'guest';
    const currentProgress = getUserProgress(uid);
    const alreadyDone = currentProgress.completedLessonIds.includes(lessonId);
    const updatedCompletedLessons = alreadyDone
      ? currentProgress.completedLessonIds
      : [...currentProgress.completedLessonIds, lessonId];

    // Check if all lessons of this course are complete
    const courseLessons = lessons.filter(l => l.courseId === courseId);
    const allCourseLessonsDone = courseLessons.every(l =>
      updatedCompletedLessons.includes(l.id)
    );

    let updatedCompletedCourses = [...currentProgress.completedCourseIds];
    let courseJustCompleted = false;

    if (allCourseLessonsDone && !updatedCompletedCourses.includes(courseId)) {
      updatedCompletedCourses.push(courseId);
      courseJustCompleted = true;
    }

    setUserProgressMap(prev => ({
      ...prev,
      [uid]: {
        ...currentProgress,
        completedLessonIds: updatedCompletedLessons,
        completedCourseIds: updatedCompletedCourses,
        lastActiveCourseId: courseId,
        lastActiveLessonId: lessonId,
        updatedAt: new Date().toISOString(),
      },
    }));

    if (courseJustCompleted) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
      });
      showToast('অভিনন্দন! আপনি এই Course সম্পূর্ণ করেছেন।', 'success');
      const cert = generateCertificate(courseId);
      setActiveCertificate(cert);
      sendNotification(
        'কোর্স সম্পন্ন হয়েছে!',
        `অভিনন্দন! আপনি "${courses.find(c => c.id === courseId)?.title}" কোর্সটি সফলভাবে শেষ করে সার্টিফিকেট অর্জন করেছেন।`,
        'certificate',
        uid
      );
    } else {
      showToast('লেসনটি সম্পন্ন হিসেবে চিহ্নিত করা হয়েছে।', 'success');
    }
  };

  // Submit quiz
  const submitQuiz = (courseId: string, answers: QuizAnswerRecord[]): QuizResult => {
    const course = courses.find(c => c.id === courseId);
    const quiz = quizzes.find(q => q.courseId === courseId);
    const total = quiz ? quiz.questions.length : answers.length;
    const correctCount = answers.filter(a => a.isCorrect).length;
    const percentage = Math.round((correctCount / total) * 100);

    const result: QuizResult = {
      id: `qr-${Date.now()}`,
      userId: currentUser?.id || 'guest',
      quizId: quiz?.id || `quiz-${courseId}`,
      courseId,
      courseTitle: course ? course.title : 'ট্রেডিং কুইজ',
      score: correctCount,
      totalQuestions: total,
      percentage,
      completedAt: new Date().toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }) + ' ' + new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
      answers,
    };

    setQuizResults(prev => [result, ...prev]);

    // Update user quiz score in progress
    const uid = currentUser?.id || 'guest';
    setUserProgressMap(prev => {
      const currProg = prev[uid] || {
        userId: uid,
        completedLessonIds: [],
        completedCourseIds: [],
        quizScores: {},
        updatedAt: new Date().toISOString(),
      };
      const existingScore = currProg.quizScores[courseId] || 0;
      return {
        ...prev,
        [uid]: {
          ...currProg,
          quizScores: {
            ...currProg.quizScores,
            [courseId]: Math.max(existingScore, percentage),
          },
          updatedAt: new Date().toISOString(),
        },
      };
    });

    if (percentage >= 70) {
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 },
      });
    }

    showToast('আপনার Quiz সফলভাবে সম্পন্ন হয়েছে।', 'success');
    return result;
  };

  // Paper trade executor
  const executePaperTrade = ({
    symbol,
    type,
    quantity,
    orderType,
    limitPrice,
  }: {
    symbol: string;
    type: 'BUY' | 'SELL';
    quantity: number;
    orderType: 'MARKET' | 'LIMIT';
    limitPrice?: number;
  }) => {
    const uid = currentUser?.id || 'guest';
    const liveStock = stocks.find(s => s.symbol === symbol);
    if (!liveStock) {
      return { success: false, message: 'স্টকটি খুঁজে পাওয়া যায়নি।' };
    }

    const execPrice = orderType === 'LIMIT' && limitPrice ? limitPrice : liveStock.currentPrice;
    const totalAmount = +(execPrice * quantity).toFixed(2);
    const curPortfolio = userPortfolio;

    if (type === 'BUY') {
      if (curPortfolio.virtualBalance < totalAmount) {
        showToast('ভার্চুয়াল ব্যালেন্স অপ্রতুল! আপনার পর্যাপ্ত তহবিল নেই।', 'error');
        return { success: false, message: 'ভার্চুয়াল ব্যালেন্স অপ্রতুল!' };
      }

      // Update cash & holdings
      const newBalance = +(curPortfolio.virtualBalance - totalAmount).toFixed(2);
      const existingHoldingIndex = curPortfolio.holdings.findIndex(h => h.symbol === symbol);

      let newHoldings = [...curPortfolio.holdings];
      if (existingHoldingIndex >= 0) {
        const existing = newHoldings[existingHoldingIndex];
        const newQty = existing.quantity + quantity;
        const newTotalInvested = +(existing.totalInvested + totalAmount).toFixed(2);
        const newAvgPrice = +(newTotalInvested / newQty).toFixed(2);

        newHoldings[existingHoldingIndex] = {
          ...existing,
          quantity: newQty,
          averageBuyPrice: newAvgPrice,
          totalInvested: newTotalInvested,
        };
      } else {
        newHoldings.push({
          symbol,
          stockName: liveStock.name,
          quantity,
          averageBuyPrice: execPrice,
          currentPrice: execPrice,
          totalInvested: totalAmount,
          currentValue: totalAmount,
          unrealizedPnL: 0,
          unrealizedPnLPercent: 0,
        });
      }

      const order: PaperOrder = {
        id: `ord-${Date.now()}`,
        userId: uid,
        symbol,
        stockName: liveStock.name,
        type: 'BUY',
        orderType,
        quantity,
        price: execPrice,
        totalAmount,
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
        status: 'EXECUTED',
      };

      setPortfolios(prev => ({
        ...prev,
        [uid]: {
          ...curPortfolio,
          virtualBalance: newBalance,
          holdings: newHoldings,
          orders: [order, ...(curPortfolio.orders || [])],
        },
      }));

      showToast(`সফলভাবে ${quantity}টি ${symbol} শেয়ার ক্রয় করা হয়েছে!`, 'success');
      return { success: true, message: `সফলভাবে ${quantity}টি ${symbol} শেয়ার ক্রয় করা হয়েছে!` };
    } else {
      // SELL
      const existingHoldingIndex = curPortfolio.holdings.findIndex(h => h.symbol === symbol);
      if (existingHoldingIndex < 0 || curPortfolio.holdings[existingHoldingIndex].quantity < quantity) {
        showToast('আপনার পোর্টফোলিওতে পর্যাপ্ত শেয়ার নেই!', 'error');
        return { success: false, message: 'পর্যাপ্ত শেয়ার নেই!' };
      }

      const existing = curPortfolio.holdings[existingHoldingIndex];
      const newBalance = +(curPortfolio.virtualBalance + totalAmount).toFixed(2);
      let newHoldings = [...curPortfolio.holdings];

      if (existing.quantity === quantity) {
        // Sold all
        newHoldings.splice(existingHoldingIndex, 1);
      } else {
        const remainingQty = existing.quantity - quantity;
        const newTotalInvested = +(existing.averageBuyPrice * remainingQty).toFixed(2);
        newHoldings[existingHoldingIndex] = {
          ...existing,
          quantity: remainingQty,
          totalInvested: newTotalInvested,
        };
      }

      const order: PaperOrder = {
        id: `ord-${Date.now()}`,
        userId: uid,
        symbol,
        stockName: liveStock.name,
        type: 'SELL',
        orderType,
        quantity,
        price: execPrice,
        totalAmount,
        timestamp: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
        status: 'EXECUTED',
      };

      setPortfolios(prev => ({
        ...prev,
        [uid]: {
          ...curPortfolio,
          virtualBalance: newBalance,
          holdings: newHoldings,
          orders: [order, ...(curPortfolio.orders || [])],
        },
      }));

      showToast(`সফলভাবে ${quantity}টি ${symbol} শেয়ার বিক্রি করা হয়েছে!`, 'success');
      return { success: true, message: `সফলভাবে ${quantity}টি ${symbol} শেয়ার বিক্রি করা হয়েছে!` };
    }
  };

  const resetPaperTradingBalance = () => {
    const uid = currentUser?.id || 'guest';
    setPortfolios(prev => ({
      ...prev,
      [uid]: {
        userId: uid,
        virtualBalance: 100000,
        initialBalance: 100000,
        holdings: [],
        orders: [],
      },
    }));
    showToast('পেপার ট্রেডিং ব্যালেন্স ₹১,০০,০০০-এ পুনরায় সেট করা হয়েছে।', 'info');
  };

  // Admin handlers
  const addCourse = (course: Course) => {
    setCourses(prev => [...prev, course]);
    showToast('নতুন কোর্স সফলভাবে যুক্ত করা হয়েছে।', 'success');
  };

  const updateCourse = (course: Course) => {
    setCourses(prev => prev.map(c => (c.id === course.id ? course : c)));
    showToast('কোর্স সফলভাবে আপডেট করা হয়েছে।', 'success');
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    setLessons(prev => prev.filter(l => l.courseId !== courseId));
    showToast('কোর্সটি মুছে ফেলা হয়েছে।', 'info');
  };

  const addLesson = (lesson: Lesson) => {
    setLessons(prev => [...prev, lesson]);
    showToast('নতুন লেসন যুক্ত হয়েছে।', 'success');
  };

  const updateLesson = (lesson: Lesson) => {
    setLessons(prev => prev.map(l => (l.id === lesson.id ? lesson : l)));
    showToast('লেসন আপডেট করা হয়েছে।', 'success');
  };

  const deleteLesson = (lessonId: string) => {
    setLessons(prev => prev.filter(l => l.id !== lessonId));
    showToast('লেসন মুছে ফেলা হয়েছে।', 'info');
  };

  const addQuizQuestion = (courseId: string, question: Quiz['questions'][0]) => {
    setQuizzes(prev =>
      prev.map(q => {
        if (q.courseId === courseId) {
          return {
            ...q,
            questions: [...q.questions, question],
          };
        }
        return q;
      })
    );
    showToast('কুইজে নতুন প্রশ্ন যুক্ত হয়েছে।', 'success');
  };

  const deleteQuizQuestion = (courseId: string, questionId: string) => {
    setQuizzes(prev =>
      prev.map(q => {
        if (q.courseId === courseId) {
          return {
            ...q,
            questions: q.questions.filter(item => item.id !== questionId),
          };
        }
        return q;
      })
    );
    showToast('প্রশ্নটি অপসারিত হয়েছে।', 'info');
  };

  const submitQuizScore = (courseId: string, score: number) => {
    const uid = currentUser?.id || 'guest';
    setUserProgressMap(prev => {
      const currProg = prev[uid] || {
        userId: uid,
        completedLessonIds: [],
        completedCourseIds: [],
        quizScores: {},
        updatedAt: new Date().toISOString(),
      };
      const prevBest = currProg.quizScores[courseId] || 0;
      return {
        ...prev,
        [uid]: {
          ...currProg,
          quizScores: {
            ...currProg.quizScores,
            [courseId]: Math.max(prevBest, score),
          },
          updatedAt: new Date().toISOString(),
        },
      };
    });

    if (score >= 60) {
      const cert = generateCertificate(courseId);
      setActiveCertificate(cert);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      showToast('অভিনন্দন! কুইজে উত্তীর্ণ হওয়ায় সার্টিফিকেট প্রস্তুত হয়েছে।', 'success');
    }
  };

  const updateUserProfile = (data: { fullName: string; email: string; mobile: string }) => {
    if (!currentUser) return;
    const updatedUser: User = {
      ...currentUser,
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      mobile: data.mobile.trim(),
    };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
    showToast('প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে।', 'success');
  };

  const changePassword = (currentPass: string, newPass: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.password && currentUser.password !== currentPass) {
      showToast('বর্তমান পাসওয়ার্ড ভুল হয়েছে।', 'error');
      return false;
    }
    const updatedUser: User = {
      ...currentUser,
      password: newPass,
    };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
    showToast('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।', 'success');
    return true;
  };

  const broadcastNotification = (title: string, message: string) => {
    sendNotification(title, message, 'system', 'all');
    showToast('সকল শিক্ষার্থীর কাছে বিজ্ঞপ্তি পাঠানো হয়েছে।', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        theme,
        toggleTheme,
        toast,
        showToast,
        clearToast,
        currentUser,
        login,
        signUp,
        logout,
        allUsers: users,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        openLoginModal,
        openSignUpModal,
        courses,
        lessons,
        quizzes,
        currentCourseId,
        selectedCourseId: currentCourseId,
        setCurrentCourseId,
        setSelectedCourseId: setCurrentCourseId,
        currentLessonId,
        selectedLessonId: currentLessonId,
        setCurrentLessonId,
        setSelectedLessonId: setCurrentLessonId,
        currentQuizCourseId,
        setCurrentQuizCourseId,
        startCourse,
        openLesson,
        markLessonComplete,
        getUserProgress,
        glossary: TRADING_GLOSSARY,
        submitQuiz,
        submitQuizScore,
        quizResults,
        certificates,
        activeCertificate,
        setActiveCertificate,
        generateCertificate,
        stocks,
        selectedStockSymbol,
        setSelectedStockSymbol,
        userPortfolio,
        executePaperTrade,
        resetPaperTradingBalance,
        resetPaperBalance: resetPaperTradingBalance,
        updateUserProfile,
        changePassword,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        sendNotification,
        broadcastNotification,
        addCourse,
        updateCourse,
        deleteCourse,
        addLesson,
        updateLesson,
        deleteLesson,
        addQuizQuestion,
        deleteQuizQuestion,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
