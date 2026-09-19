import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Toast: React.FC = () => {
  const { toast, clearToast } = useApp();

  if (!toast) return null;

  const bgStyles = {
    success: 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-900/20',
    error: 'bg-rose-600 text-white border-rose-500 shadow-rose-900/20',
    info: 'bg-blue-600 text-white border-blue-500 shadow-blue-900/20',
  }[toast.type];

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  }[toast.type];

  return (
    <div
      id="app-toast-container"
      className="fixed top-5 right-5 z-50 max-w-md w-full px-4 animate-in fade-in slide-in-from-top-4 duration-200"
    >
      <div
        className={`flex items-center gap-3 p-4 rounded-xl border shadow-lg ${bgStyles} transition-all`}
        role="alert"
      >
        <Icon className="w-5 h-5 shrink-0" />
        <p className="text-sm font-medium leading-relaxed flex-1">{toast.message}</p>
        <button
          onClick={clearToast}
          className="p-1 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
