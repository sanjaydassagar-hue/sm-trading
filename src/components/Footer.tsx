import React from 'react';
import { AlertTriangle, TrendingUp, ShieldCheck, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 pt-10 pb-20 xl:pb-10 text-slate-600 dark:text-slate-400 text-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Important Statutory Disclaimer Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 dark:text-slate-100 text-xs block mb-1">
              আইনগত ও শিক্ষামূলক ডিসক্লেইমার (Statutory Educational Disclaimer)
            </span>
            <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
              "SM TRADING একটি শিক্ষামূলক প্ল্যাটফর্ম। এখানে প্রদত্ত তথ্য শুধুমাত্র শিক্ষার উদ্দেশ্যে। কোনো তথ্যকে ব্যক্তিগত আর্থিক পরামর্শ হিসেবে বিবেচনা করবেন না। শেয়ার বাজারে Trading ও Investment ঝুঁকিপূর্ণ এবং কোনো নির্দিষ্ট লাভের নিশ্চয়তা নেই।"
            </p>
          </div>
        </div>

        {/* Footer Navigation & Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-2">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white font-mono text-base">
                SM TRADING
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              বাংলায় সহজ ভাষায় শেয়ার বাজার, ক্যান্ডেলস্টিক, টেকনিক্যাল এনালাইসিস ও রিস্ক ম্যানেজমেন্ট শেখার বিশ্বস্ত প্ল্যাটফর্ম।
            </p>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>১০০% ভার্চুয়াল পেপার ট্রেডিং</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider mb-3">
              কোর্স ও লেসন
            </h5>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('courses')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
                >
                  শেয়ার বাজারের প্রাথমিক ধারণা
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('courses')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
                >
                  Trading কীভাবে কাজ করে?
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('courses')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
                >
                  Candlestick শেখা
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('courses')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
                >
                  Technical Analysis
                </button>
              </li>
            </ul>
          </div>

          {/* Interactive Tools */}
          <div>
            <h5 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider mb-3">
              টুলস ও অনুশীলন
            </h5>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('paper-trading')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
                >
                  পেপার ট্রেডিং (₹১,০০,০০০ ব্যালেন্স)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
                >
                  কোর্সভিত্তিক কুইজ ও স্কোর
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('glossary')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
                >
                  বাংলা-ইংরেজি ট্রেডিং শব্দকোষ
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('progress')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
                >
                  আমার শেখার অগ্রগতি
                </button>
              </li>
            </ul>
          </div>

          {/* Guidelines */}
          <div>
            <h5 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wider mb-3">
              নির্দেশিকা ও নীতি
            </h5>
            <p className="text-xs text-slate-500 leading-relaxed">
              এই প্ল্যাটফর্ম কোনো সেবি রেজিস্টার্ড এডভাইজরি বা ফান্ড ম্যানেজার নয়। এখানে কোনো আসল টাকার বিনিয়োগ বা রিয়েল ট্রেড এক্সিকিউট হয় না।
            </p>
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400">
              © {new Date().getFullYear()} SM TRADING. সকল স্বত্ব সংরক্ষিত।
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
