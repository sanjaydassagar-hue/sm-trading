export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  mobile: string;
  password?: string; // Note: never exposed to admin or client logs
  role: UserRole;
  createdAt: string;
  avatarUrl?: string;
  learningLevel: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface TopicItem {
  id: string;
  title: string;
  durationMinutes: number;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  topics: string[];
  iconName: string;
  badgeBn: string;
  order: number;
}

export type DiagramType = 
  | 'candlestick_anatomy' 
  | 'bullish_bearish' 
  | 'hammer_doji' 
  | 'support_resistance' 
  | 'moving_average' 
  | 'risk_reward' 
  | 'order_types' 
  | 'psychology_cycle'
  | 'market_structure';

export interface Lesson {
  id: string;
  courseId: string;
  topicIndex: number;
  title: string;
  durationMinutes: number;
  explanation: string;
  simpleExamples: string[];
  importantPoints: string[];
  diagramType?: DiagramType;
  diagramTitle?: string;
  diagramDescription?: string;
  diagramConfig?: Record<string, any>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  correctAnswerIndex?: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

export interface QuizAnswerRecord {
  questionId: string;
  selectedOptionIndex: number;
  isCorrect: boolean;
}

export interface QuizResult {
  id: string;
  userId: string;
  quizId: string;
  courseId: string;
  courseTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
  answers: QuizAnswerRecord[];
}

export interface UserProgress {
  userId: string;
  completedLessonIds: string[];
  completedCourseIds: string[];
  quizScores: Record<string, number>; // courseId -> highest percentage
  lastActiveCourseId?: string;
  lastActiveLessonId?: string;
  updatedAt: string;
}

export interface StockQuote {
  symbol: string;
  name: string;
  nameBn: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  volume: string;
  dayHigh?: number;
  dayLow?: number;
  openPrice?: number;
  historyPrices?: number[];
  candles: {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
}

export interface PaperHolding {
  symbol: string;
  stockName: string;
  quantity: number;
  averageBuyPrice: number;
  buyPrice?: number;
  currentPrice: number;
  totalInvested: number;
  currentValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
  pnlPercent?: number;
}

export interface PaperOrder {
  id: string;
  userId: string;
  symbol: string;
  stockName: string;
  type: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT';
  quantity: number;
  price: number;
  totalAmount: number;
  timestamp: string;
  status: 'EXECUTED' | 'CANCELLED';
}

export interface PaperPortfolio {
  userId: string;
  virtualBalance: number;
  initialBalance: number;
  holdings: PaperHolding[];
  orders: PaperOrder[];
}

export interface Certificate {
  id: string;
  certificateId: string;
  userId: string;
  studentName: string;
  username: string;
  courseId: string;
  courseName: string;
  completionDate: string;
  issueDate: string;
  verificationCode: string;
}

export interface NotificationItem {
  id: string;
  userId: string; // 'all' or specific userId
  title: string;
  message: string;
  type: 'course' | 'lesson' | 'quiz' | 'certificate' | 'reminder' | 'system';
  read: boolean;
  timestamp: string;
  targetTab?: string;
  targetId?: string;
}

export interface TradingTerm {
  id: string;
  termEn: string;
  termBn: string;
  pronunciation?: string;
  definitionBn: string;
  definition?: string;
  exampleBn: string;
  example?: string;
  category: 'বেসিক' | 'অ্যানালাইসিস' | 'অর্ডার টাইপ' | 'মার্কেট' | 'সাইকোলজি' | string;
}
