import React from 'react';
import { Award, CheckCircle2, Download, Printer, Share2, X, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CertificateModal: React.FC = () => {
  const { activeCertificate, setActiveCertificate, showToast } = useApp();

  if (!activeCertificate) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(activeCertificate.certificateId);
    showToast('সার্টিফিকেট আইডি কপি করা হয়েছে!', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[95vh] flex flex-col">
        {/* Header / Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 no-print">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
              কোর্স সমাপনী সার্টিফিকেট
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              প্রিন্ট / PDF সেভ
            </button>
            <button
              onClick={() => setActiveCertificate(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="p-6 md:p-10 overflow-y-auto flex items-center justify-center bg-slate-100 dark:bg-slate-950">
          <div
            id="printable-certificate"
            className="w-full bg-white text-slate-900 p-8 md:p-12 rounded-xl border-8 border-double border-amber-600/60 shadow-xl relative overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(circle at center, rgba(251, 191, 36, 0.03) 0%, transparent 70%)',
            }}
          >
            {/* Top decorative badge */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[10px] uppercase tracking-widest font-black px-6 py-1 rounded-b-md shadow-sm">
              Official Educational Certificate
            </div>

            <div className="text-center space-y-6">
              {/* Institution Header */}
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold tracking-wider">SM TRADING ACADEMY</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                  SM TRADING
                </h1>
                <p className="text-xs text-slate-500 font-medium tracking-wider uppercase mt-1">
                  বাংলায় শেয়ার বাজার শিক্ষা ও গবেষণা প্ল্যাটফর্ম
                </p>
              </div>

              {/* Title */}
              <div className="py-2 border-y border-amber-200/80">
                <span className="text-sm uppercase tracking-widest text-amber-700 font-semibold block">
                  Certificate of Completion
                </span>
                <p className="text-xs text-slate-600 mt-1">
                  এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, সফলতার সাথে সম্পূর্ণ কোর্স সম্পন্ন করেছেন:
                </p>
              </div>

              {/* Student Details */}
              <div className="space-y-1">
                <p className="text-2xl md:text-3xl font-bold text-emerald-700 underline decoration-amber-400 decoration-2 underline-offset-8">
                  {activeCertificate.studentName}
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  Username: @{activeCertificate.username}
                </p>
              </div>

              {/* Course Title */}
              <div className="max-w-lg mx-auto bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-medium block">কোর্সের নাম (Course Name):</span>
                <p className="text-lg font-bold text-slate-800 mt-0.5">
                  "{activeCertificate.courseName}"
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  তত্ত্বীয় পাঠ, ক্যান্ডেলস্টিক চার্ট বিশ্লেষণ ও মূল্যায়নী কুইজ সফলভাবে সমাপ্তির স্বীকৃতিস্বরূপ।
                </p>
              </div>

              {/* Footer Credentials */}
              <div className="pt-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-left border-t border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">Completion Date:</span>
                  <p className="font-semibold text-slate-700">{activeCertificate.completionDate}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Certificate ID:</span>
                  <div className="flex items-center gap-1.5">
                    <p className="font-mono font-bold text-slate-800">{activeCertificate.certificateId}</p>
                    <button
                      onClick={handleCopyId}
                      className="text-emerald-600 hover:text-emerald-700 cursor-pointer no-print text-[11px]"
                      title="Copy ID"
                    >
                      কপি
                    </button>
                  </div>
                </div>
                <div className="col-span-2 md:col-span-1 flex items-center justify-end">
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>যাচাইকৃত (Verified)</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">SM Trading Directorate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
