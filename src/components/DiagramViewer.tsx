import React, { useState } from 'react';
import { DiagramType } from '../types';
import { TrendingUp, ArrowUpRight, ArrowDownRight, ShieldCheck, Target, AlertTriangle } from 'lucide-react';

interface DiagramViewerProps {
  type?: DiagramType;
  title?: string;
  description?: string;
}

export const DiagramViewer: React.FC<DiagramViewerProps> = ({
  type = 'candlestick_anatomy',
  title,
  description,
}) => {
  // State for interactive Risk-Reward calculator inside diagram
  const [entryPrice, setEntryPrice] = useState<number>(100);
  const [stopLoss, setStopLoss] = useState<number>(95);
  const [targetRatio, setTargetRatio] = useState<number>(2); // 1:2

  const riskPerShare = Math.max(0.5, entryPrice - stopLoss);
  const targetPrice = entryPrice + riskPerShare * targetRatio;

  return (
    <div className="my-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-5 shadow-sm overflow-hidden">
      {title && (
        <div className="mb-4 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-base">
              📊 {title}
            </h4>
            {description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {description}
              </p>
            )}
          </div>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            ইন্টারেক্টিভ ডায়াগ্রাম
          </span>
        </div>
      )}

      {/* Candlestick Anatomy Diagram */}
      {type === 'candlestick_anatomy' && (
        <div className="flex flex-col md:flex-row items-center justify-around gap-6 py-4">
          {/* Bullish Candle */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
              বুলিশ ক্যান্ডেল (দাম বৃদ্ধি)
            </span>
            <div className="relative w-28 h-56 flex flex-col items-center justify-center">
              {/* Upper Shadow */}
              <div className="w-0.5 h-10 bg-emerald-600 dark:bg-emerald-400"></div>
              {/* Real Body */}
              <div className="w-14 h-28 bg-emerald-500 border-2 border-emerald-600 rounded-sm flex flex-col justify-between py-1 px-1 shadow-md">
                <span className="text-[10px] text-white font-bold text-center">Close (সমাপ্তি)</span>
                <span className="text-[9px] text-emerald-100 text-center font-medium">Real Body</span>
                <span className="text-[10px] text-white font-bold text-center">Open (শুরু)</span>
              </div>
              {/* Lower Shadow */}
              <div className="w-0.5 h-12 bg-emerald-600 dark:bg-emerald-400"></div>

              {/* Labels */}
              <div className="absolute top-0 right-0 text-[10px] font-mono text-slate-600 dark:text-slate-300">
                High (সর্বোচ্চ)
              </div>
              <div className="absolute bottom-0 right-0 text-[10px] font-mono text-slate-600 dark:text-slate-300">
                Low (সর্বনিম্ন)
              </div>
            </div>
            <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2 max-w-[160px]">
              ক্লোজিং প্রাইস ওপেনিং প্রাইসের চেয়ে ওপরে বন্ধ হয় (সবুজ)।
            </p>
          </div>

          {/* Bearish Candle */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-2">
              বিয়ারিশ ক্যান্ডেল (দাম পতন)
            </span>
            <div className="relative w-28 h-56 flex flex-col items-center justify-center">
              {/* Upper Shadow */}
              <div className="w-0.5 h-10 bg-rose-600 dark:bg-rose-400"></div>
              {/* Real Body */}
              <div className="w-14 h-28 bg-rose-500 border-2 border-rose-600 rounded-sm flex flex-col justify-between py-1 px-1 shadow-md">
                <span className="text-[10px] text-white font-bold text-center">Open (শুরু)</span>
                <span className="text-[9px] text-rose-100 text-center font-medium">Real Body</span>
                <span className="text-[10px] text-white font-bold text-center">Close (সমাপ্তি)</span>
              </div>
              {/* Lower Shadow */}
              <div className="w-0.5 h-12 bg-rose-600 dark:bg-rose-400"></div>

              {/* Labels */}
              <div className="absolute top-0 right-0 text-[10px] font-mono text-slate-600 dark:text-slate-300">
                High (সর্বোচ্চ)
              </div>
              <div className="absolute bottom-0 right-0 text-[10px] font-mono text-slate-600 dark:text-slate-300">
                Low (সর্বনিম্ন)
              </div>
            </div>
            <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2 max-w-[160px]">
              ক্লোজিং প্রাইস ওপেনিং প্রাইসের চেয়ে নিচে বন্ধ হয় (লাল)।
            </p>
          </div>
        </div>
      )}

      {/* Bullish & Bearish Comparison */}
      {type === 'bullish_bearish' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          <div className="p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-300 font-semibold text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>বুলিশ ক্যান্ডেলের বৈশিষ্ট্য (Bulls in Control)</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-4">
              <li>ক্রেতাদের ব্যাপক উপস্থিতি থাকে (Buying Dominance)।</li>
              <li>দামের নিম্নস্তর থেকে ঘুরে দাঁড়ানোর ইঙ্গিত দেয়।</li>
              <li>সাপোর্টে তৈরি হলে একটি শক্তিশালী বাই সিগন্যাল হিসেবে গণ্য হয়।</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
            <div className="flex items-center gap-2 mb-2 text-rose-700 dark:text-rose-300 font-semibold text-sm">
              <ArrowDownRight className="w-4 h-4" />
              <span>বিয়ারিশ ক্যান্ডেলের বৈশিষ্ট্য (Bears in Control)</span>
            </div>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-4">
              <li>বিক্রেতারা বাজারে আক্রমণাত্মকভাবে সক্রিয় থাকে।</li>
              <li>রেজিস্ট্যান্স লেভেলে তৈরি হলে মুনাফা বুকিং বা পতনের বার্তা দেয়।</li>
              <li>পরবর্তী সম্ভাব্য পতনের পূর্বাভাস প্রদান করে।</li>
            </ul>
          </div>
        </div>
      )}

      {/* Hammer & Doji Diagram */}
      {type === 'hammer_doji' && (
        <div className="flex flex-wrap items-center justify-around gap-6 py-4">
          {/* Hammer */}
          <div className="flex flex-col items-center bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm w-44">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2">
              হ্যামার (Hammer)
            </span>
            <div className="flex flex-col items-center my-2">
              <div className="w-10 h-7 bg-emerald-500 rounded-sm border border-emerald-600"></div>
              <div className="w-0.5 h-20 bg-emerald-600"></div>
            </div>
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 text-center">
              নিচে লম্বা উইক (২-৩ গুণ)
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              বুলিশ রিভার্সাল সংকেত
            </span>
          </div>

          {/* Doji */}
          <div className="flex flex-col items-center bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm w-44">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 mb-2">
              দোজি (Doji)
            </span>
            <div className="flex flex-col items-center my-2">
              <div className="w-0.5 h-10 bg-slate-500"></div>
              <div className="w-10 h-1 bg-slate-700 dark:bg-slate-300"></div>
              <div className="w-0.5 h-10 bg-slate-500"></div>
            </div>
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 text-center">
              ওপেন ও ক্লোজ সমান
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
              মার্কেটে সিদ্ধান্তহীনতা
            </span>
          </div>

          {/* Shooting Star */}
          <div className="flex flex-col items-center bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm w-44">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-2">
              শুটিং স্টার (Shooting Star)
            </span>
            <div className="flex flex-col items-center my-2">
              <div className="w-0.5 h-20 bg-rose-600"></div>
              <div className="w-10 h-7 bg-rose-500 rounded-sm border border-rose-600"></div>
            </div>
            <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 text-center">
              উপরে লম্বা উইক
            </span>
            <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold mt-1">
              বিয়ারিশ রিভার্সাল সংকেত
            </span>
          </div>
        </div>
      )}

      {/* Support & Resistance Visualization */}
      {type === 'support_resistance' && (
        <div className="py-2">
          <div className="relative h-52 w-full bg-slate-900 rounded-xl p-4 overflow-hidden border border-slate-800">
            {/* Resistance line */}
            <div className="absolute top-10 left-0 right-0 border-b-2 border-dashed border-rose-500/80 flex justify-between px-3">
              <span className="text-[10px] font-mono text-rose-400 bg-rose-950/80 px-1.5 py-0.5 rounded">
                রেজিস্ট্যান্স লেভেল (ছাদ / বিক্রেতাদের প্রাচুর্য)
              </span>
              <span className="text-[10px] font-mono text-rose-400">₹৫০০.০০</span>
            </div>

            {/* SVG Bounce Path */}
            <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
              <path
                d="M 20 120 Q 80 30 140 120 T 260 120 T 380 30 T 480 20"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
              />
              {/* Points */}
              <circle cx="80" cy="35" r="5" fill="#f43f5e" />
              <circle cx="140" cy="120" r="5" fill="#10b981" />
              <circle cx="260" cy="120" r="5" fill="#10b981" />
              <circle cx="380" cy="35" r="5" fill="#f43f5e" />
              <circle cx="480" cy="20" r="6" fill="#fbbf24" />
            </svg>

            {/* Support line */}
            <div className="absolute bottom-10 left-0 right-0 border-b-2 border-dashed border-emerald-500/80 flex justify-between px-3">
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded">
                সাপোর্ট লেভেল (মেঝে / ক্রেতাদের বাউন্স)
              </span>
              <span className="text-[10px] font-mono text-emerald-400">₹৪২০.০০</span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2 px-1">
            <span>সাপোর্টে ক্রয় (Buy on Support)</span>
            <span className="font-semibold text-amber-500">ব্রেকআউট (Breakout)</span>
            <span>রেজিস্ট্যান্সে প্রফিট বুক (Sell on Resistance)</span>
          </div>
        </div>
      )}

      {/* Moving Average Trend */}
      {type === 'moving_average' && (
        <div className="py-2">
          <div className="relative h-44 w-full bg-slate-900 rounded-xl p-4 overflow-hidden border border-slate-800">
            <svg className="w-full h-full" viewBox="0 0 500 140" preserveAspectRatio="none">
              {/* Price bars */}
              <path
                d="M 10 120 L 60 100 L 110 110 L 160 85 L 210 90 L 260 65 L 310 70 L 360 45 L 410 40 L 480 15"
                fill="none"
                stroke="#64748b"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              {/* 50 EMA Fast (Gold) */}
              <path
                d="M 10 125 Q 180 90 280 60 T 480 20"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="2.5"
              />
              {/* 200 EMA Slow (Blue) */}
              <path
                d="M 10 115 Q 180 100 280 75 T 480 45"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2.5"
              />
              {/* Crossover point */}
              <circle cx="210" cy="85" r="6" fill="#10b981" />
            </svg>
            <div className="absolute top-2 right-3 flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> 50 EMA (দ্রুত)
              </span>
              <span className="flex items-center gap-1 text-blue-400">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span> 200 EMA (ধীর)
              </span>
            </div>
            <div className="absolute bottom-2 left-3 text-[10px] text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded">
              Golden Cross (বুলিশ ট্রেন্ড রিভার্সাল)
            </div>
          </div>
        </div>
      )}

      {/* Interactive Risk / Reward Calculator */}
      {type === 'risk_reward' && (
        <div className="space-y-4 py-2">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-3">
              ইন্টারেক্টিভ রিস্ক-টু-রিওয়ার্ড ক্যালকুলেটর:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                  এন্ট্রি প্রাইস (Entry ₹)
                </label>
                <input
                  type="number"
                  value={entryPrice}
                  onChange={e => setEntryPrice(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                  স্টপ লস (Stop Loss ₹)
                </label>
                <input
                  type="number"
                  value={stopLoss}
                  onChange={e => setStopLoss(Math.min(entryPrice - 0.5, Number(e.target.value)))}
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono text-rose-600 dark:text-rose-400"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                  টার্গেট রেশিও (RR Ratio)
                </label>
                <select
                  value={targetRatio}
                  onChange={e => setTargetRatio(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                >
                  <option value={1.5}>১:১.৫ (স্বল্পমেয়াদী)</option>
                  <option value={2}>১:২ (স্ট্যান্ডার্ড আদর্শ)</option>
                  <option value={3}>১:৩ (উচ্চ ফলনশীল)</option>
                </select>
              </div>
            </div>

            {/* Visual ratio bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-rose-500 shrink-0" />
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">প্রতি শেয়ারে সর্বোচ্চ ঝুঁকি:</span>
                  <p className="text-sm font-bold text-rose-600 dark:text-rose-400">
                    ₹{riskPerShare.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">প্রত্যাশিত প্রফিট টার্গেট প্রাইস:</span>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{targetPrice.toFixed(2)} (লাভ: ₹{(riskPerShare * targetRatio).toFixed(2)})
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Psychology Cycle */}
      {type === 'psychology_cycle' && (
        <div className="py-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 block">১. আশাবাদ ও লোভ</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">"শেয়ারটি আরও বাড়বে, এখনই আরও বেশি কিনি!"</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center">
              <span className="text-xs font-bold text-rose-700 dark:text-rose-300 block">২. ভয় ও অস্বীকৃতি</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">"দাম পড়ছে, তবে নিশ্চই আবার আগের দামে ফিরবে।"</p>
            </div>
            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-700 text-center">
              <span className="text-xs font-bold text-red-700 dark:text-red-300 block">৩. প্যানিক সেল</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">"সব শেষ! এখনই লসে সব বেচে পালিয়ে যাই।"</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block">৪. পেশাদার শৃঙ্খলা</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">"ইমোশন মুক্ত হয়ে স্টপ লস ও নিয়ম মেনে ট্রেড করা।"</p>
            </div>
          </div>
        </div>
      )}

      {/* Market structure fallback */}
      {type === 'market_structure' && (
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 py-4 text-xs font-semibold">
          <div className="px-3 py-2 rounded-xl bg-blue-500 text-white shadow-sm">
            কোম্পানি (IPO)
          </div>
          <span className="text-slate-400">➔</span>
          <div className="px-3 py-2 rounded-xl bg-indigo-500 text-white shadow-sm">
            স্টক এক্সচেঞ্জ (NSE / BSE)
          </div>
          <span className="text-slate-400">➔</span>
          <div className="px-3 py-2 rounded-xl bg-emerald-600 text-white shadow-sm">
            রেজিস্টার্ড ব্রোকার
          </div>
          <span className="text-slate-400">➔</span>
          <div className="px-3 py-2 rounded-xl bg-amber-500 text-white shadow-sm">
            ডিম্যাট অ্যাকাউন্ট ও ট্রেডার
          </div>
        </div>
      )}
    </div>
  );
};
