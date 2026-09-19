import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  DollarSign,
  Activity,
  Layers,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PaperTradingView: React.FC = () => {
  const {
    stocks,
    selectedStockSymbol,
    setSelectedStockSymbol,
    userPortfolio,
    executePaperTrade,
    resetPaperBalance,
    showToast,
  } = useApp();

  const selectedStock = stocks.find(s => s.symbol === selectedStockSymbol) || stocks[0];

  // Order Form State
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [quantity, setQuantity] = useState<number>(10);
  const [limitPrice, setLimitPrice] = useState<number>(selectedStock.currentPrice);
  const [activeTimeframe, setActiveTimeframe] = useState<'1D' | '1W' | '1M' | '1Y'>('1D');
  const [activeTab, setActivePortfolioTab] = useState<'holdings' | 'orders'>('holdings');

  const executionPrice = orderType === 'MARKET' ? selectedStock.currentPrice : (limitPrice || selectedStock.currentPrice);
  const estimatedTotal = executionPrice * quantity;

  // Find user's current holding for this stock if any
  const currentHolding = userPortfolio.holdings.find(h => h.symbol === selectedStock.symbol);

  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) {
      showToast('শেয়ার সংখ্যা ১ বা তার বেশি হতে হবে।', 'error');
      return;
    }

    const success = executePaperTrade({
      symbol: selectedStock.symbol,
      stockName: selectedStock.nameBn,
      type: tradeType,
      orderType,
      quantity,
      price: executionPrice,
    });

    if (success) {
      // Keep quantity as is or reset
    }
  };

  const handleQuickSell = (symbol: string, qty: number, price: number) => {
    const stockObj = stocks.find(s => s.symbol === symbol);
    executePaperTrade({
      symbol,
      stockName: stockObj?.nameBn || symbol,
      type: 'SELL',
      orderType: 'MARKET',
      quantity: qty,
      price,
    });
  };

  // SVG Chart path calculation for historical prices
  const chartData = selectedStock.historyPrices || [100, 102, 101, 105, 104, 108];
  const minPrice = Math.min(...chartData) * 0.995;
  const maxPrice = Math.max(...chartData) * 1.005;
  const priceRange = maxPrice - minPrice || 1;

  const points = chartData.map((val: number, idx: number) => {
    const x = (idx / (chartData.length - 1)) * 500;
    const y = 140 - ((val - minPrice) / priceRange) * 120;
    return `${x},${y}`;
  });

  const svgPath = `M ${points.join(' L ')}`;
  const areaPath = `M ${points[0]} L ${points.join(' L ')} L 500,150 L 0,150 Z`;

  const isPositiveChange = selectedStock.change >= 0;

  // Portfolio aggregates
  const totalInvested = userPortfolio.holdings.reduce((sum, h) => sum + h.totalInvested, 0);
  const totalCurrentValue = userPortfolio.holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalUnrealizedPnL = totalCurrentValue - totalInvested;
  const totalPnLPercent = totalInvested > 0 ? (totalUnrealizedPnL / totalInvested) * 100 : 0;

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Prominent Paper Trading Warning Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-amber-700/60 flex items-start gap-3.5">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block">
            ভার্চুয়াল পেপার ট্রেডিং নির্দেশিকা:
          </span>
          <p className="text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed font-semibold">
            "এটি Paper Trading। এখানে কোনো আসল টাকা ব্যবহার করা হয় না।"
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            ট্রেডিং স্ট্র্যাটেজি ও ক্যান্ডেলস্টিক প্যাটার্ন বাস্তবে যাচাই করার জন্য আপনাকে সম্পূর্ণ ঝুঁকিমুক্ত ভার্চুয়াল ফান্ড প্রদান করা হয়েছে।
          </p>
        </div>
      </div>

      {/* 2. Top Metric Bar: Virtual Balance, Invested, Portfolio P&L */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Virtual Cash Balance */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>উপলব্ধ ক্যাশ ব্যালেন্স</span>
            <button
              onClick={resetPaperBalance}
              title="ভার্চুয়াল ব্যালেন্স রিসেট করুন"
              className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center gap-1 text-[11px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>রিসেট</span>
            </button>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              ₹{userPortfolio.virtualBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">ভার্চুয়াল টাকা (Simulated Cash)</span>
          </div>
        </div>

        {/* Total Invested */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-slate-500">মোট ক্রয়মূল্য (Invested)</span>
          <div className="mt-2">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
              ₹{totalInvested.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">{userPortfolio.holdings.length}টি স্টকে বিনিয়োগকৃত</span>
          </div>
        </div>

        {/* Current Portfolio Value */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-slate-500">বর্তমান হোল্ডিং মূল্য (Current Value)</span>
          <div className="mt-2">
            <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
              ₹{totalCurrentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">লাইভ মার্কেট রেটে সমন্বিত</span>
          </div>
        </div>

        {/* Total Unrealized P&L */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-xs text-slate-500">অব্যাহত লাভ/ক্ষতি (P&L)</span>
          <div className="mt-2">
            <span
              className={`text-2xl font-black font-mono flex items-center gap-1 ${
                totalUnrealizedPnL >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {totalUnrealizedPnL >= 0 ? '+' : ''}
              ₹{totalUnrealizedPnL.toFixed(2)}
            </span>
            <span
              className={`text-xs font-bold ${
                totalUnrealizedPnL >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {totalUnrealizedPnL >= 0 ? '+' : ''}
              {totalPnLPercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Trading Stage: Watchlist, Live Chart, & Order Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Watchlist (3 cols) */}
        <div className="lg:col-span-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              ওয়াচলিস্ট (Watchlist)
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
              LIVE
            </span>
          </div>

          <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
            {stocks.map(stock => {
              const isSelected = stock.symbol === selectedStock.symbol;
              const isPositive = stock.change >= 0;
              return (
                <div
                  key={stock.symbol}
                  onClick={() => {
                    setSelectedStockSymbol(stock.symbol);
                    setLimitPrice(stock.currentPrice);
                  }}
                  className={`p-3 rounded-xl cursor-pointer transition flex items-center justify-between border ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 shadow-xs'
                      : 'border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100 font-mono">
                      {stock.symbol}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate max-w-[110px]">
                      {stock.nameBn}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      ₹{stock.currentPrice.toFixed(2)}
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        isPositive ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle Column: Interactive Chart (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            {/* Stock Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 font-mono">
                    {selectedStock.symbol}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    NSE / BSE
                  </span>
                </div>
                <p className="text-xs text-slate-500">{selectedStock.nameBn}</p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100 block">
                  ₹{selectedStock.currentPrice.toFixed(2)}
                </span>
                <span
                  className={`text-xs font-bold inline-flex items-center gap-0.5 ${
                    isPositiveChange ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {isPositiveChange ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {isPositiveChange ? '+' : ''}
                  {selectedStock.change.toFixed(2)} ({selectedStock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>

            {/* Timeframe Selector Buttons */}
            <div className="flex items-center gap-1.5 my-3">
              {(['1D', '1W', '1M', '1Y'] as const).map(tf => (
                <button
                  key={tf}
                  onClick={() => setActiveTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    activeTimeframe === tf
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Visual SVG Chart */}
            <div className="relative h-48 w-full bg-slate-950 rounded-xl p-3 overflow-hidden border border-slate-800 my-2">
              <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isPositiveChange ? '#10b981' : '#f43f5e'} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={isPositiveChange ? '#10b981' : '#f43f5e'} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Area fill */}
                <path d={areaPath} fill="url(#chartGradient)" />

                {/* Stroke Line */}
                <path
                  d={svgPath}
                  fill="none"
                  stroke={isPositiveChange ? '#10b981' : '#f43f5e'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>

              {/* High & Low markers */}
              <div className="absolute top-2 right-3 text-[10px] font-mono text-slate-400">
                High: ₹{selectedStock.dayHigh.toFixed(2)}
              </div>
              <div className="absolute bottom-2 right-3 text-[10px] font-mono text-slate-400">
                Low: ₹{selectedStock.dayLow.toFixed(2)}
              </div>
            </div>

            {/* Daily stats row */}
            <div className="grid grid-cols-3 gap-2 text-[11px] pt-3 text-slate-500">
              <div>
                <span>দিন শুরু (Open):</span>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  ₹{selectedStock.openPrice.toFixed(2)}
                </p>
              </div>
              <div>
                <span>ভলিউম (Vol):</span>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {selectedStock.volume}
                </p>
              </div>
              <div>
                <span>আগের বন্ধ (Prev):</span>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  ₹{selectedStock.previousClose.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Placement Form (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <form onSubmit={handleExecuteTrade} className="space-y-4">
            {/* BUY / SELL Switcher */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setTradeType('BUY')}
                className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  tradeType === 'BUY'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                BUY (ক্রয়)
              </button>
              <button
                type="button"
                onClick={() => setTradeType('SELL')}
                className={`py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  tradeType === 'SELL'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                SELL (বিক্রয়)
              </button>
            </div>

            {/* Current Holding info */}
            {currentHolding && (
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs flex justify-between">
                <span className="text-slate-500">আপনার বর্তমান হোল্ডিং:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {currentHolding.quantity}টি শেয়ার (গড় ₹{currentHolding.buyPrice.toFixed(2)})
                </span>
              </div>
            )}

            {/* Order Type: Market vs Limit */}
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                অর্ডারের ধরন (Order Type)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType('MARKET')}
                  className={`py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                    orderType === 'MARKET'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  মার্কেট অর্ডার
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('LIMIT')}
                  className={`py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                    orderType === 'LIMIT'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  লিমিট অর্ডার
                </button>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <label className="font-medium text-slate-700 dark:text-slate-300">
                  শেয়ার সংখ্যা (Quantity)
                </label>
                <span className="text-slate-400">লট: ১</span>
              </div>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Price (if limit) */}
            {orderType === 'LIMIT' && (
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                  নির্দিষ্ট লিমিট প্রাইস (₹)
                </label>
                <input
                  type="number"
                  step="0.05"
                  required
                  value={limitPrice}
                  onChange={e => setLimitPrice(parseFloat(e.target.value) || selectedStock.currentPrice)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}

            {/* Estimated Cost Summary */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>একক মূল্য:</span>
                <span className="font-mono">₹{executionPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>ব্রোকারেজ ও ট্যাক্স (Paper):</span>
                <span className="text-emerald-600 font-bold">₹০.০০ (ফ্রি)</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 dark:text-slate-100 pt-1 border-t border-slate-200 dark:border-slate-700">
                <span>মোট প্রয়োজনীয় তহবিল:</span>
                <span className="font-mono text-sm">
                  ₹{estimatedTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Submit Trade Button */}
            <button
              type="submit"
              className={`w-full py-3 rounded-xl text-white font-bold text-xs shadow-md transition cursor-pointer ${
                tradeType === 'BUY'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20'
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/20'
              }`}
            >
              {tradeType === 'BUY'
                ? `BUY অর্ডার নিশ্চিত করুন (₹${estimatedTotal.toFixed(2)})`
                : `SELL অর্ডার নিশ্চিত করুন`}
            </button>
          </form>
        </div>
      </div>

      {/* 4. Portfolio Section: Holdings vs Order History */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePortfolioTab('holdings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'holdings'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              পোর্টফোলিও হোল্ডিংস ({userPortfolio.holdings.length})
            </button>
            <button
              onClick={() => setActivePortfolioTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              অর্ডার হিস্টোরি ({userPortfolio.orders.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Holdings Table */}
        {activeTab === 'holdings' && (
          <div className="overflow-x-auto">
            {userPortfolio.holdings.length === 0 ? (
              <div className="text-center py-10 space-y-2">
                <BarChart3 className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500">আপনার পোর্টফোলিওতে কোনো সক্রিয় শেয়ার নেই।</p>
                <p className="text-[11px] text-emerald-600 font-semibold">
                  উপরের প্যানেল থেকে যেকোনো স্টক সিলেক্ট করে বাই করুন।
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">স্টক নাম</th>
                    <th className="py-2.5 px-3">সংখ্যা</th>
                    <th className="py-2.5 px-3">গড় ক্রয়মূল্য</th>
                    <th className="py-2.5 px-3">বর্তমান মূল্য</th>
                    <th className="py-2.5 px-3">বিনিয়োগ</th>
                    <th className="py-2.5 px-3">বর্তমান মূল্যায়ন</th>
                    <th className="py-2.5 px-3">লাভ / ক্ষতি (P&L)</th>
                    <th className="py-2.5 px-3 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {userPortfolio.holdings.map(holding => {
                    const isProfit = holding.unrealizedPnL >= 0;
                    return (
                      <tr key={holding.symbol} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                        <td className="py-3 px-3">
                          <span className="font-bold text-slate-900 dark:text-slate-100 font-mono block">
                            {holding.symbol}
                          </span>
                          <span className="text-[10px] text-slate-400">{holding.stockName}</span>
                        </td>
                        <td className="py-3 px-3 font-mono font-semibold">{holding.quantity}টি</td>
                        <td className="py-3 px-3 font-mono">₹{holding.buyPrice.toFixed(2)}</td>
                        <td className="py-3 px-3 font-mono font-bold">₹{holding.currentPrice.toFixed(2)}</td>
                        <td className="py-3 px-3 font-mono">₹{holding.totalInvested.toFixed(2)}</td>
                        <td className="py-3 px-3 font-mono font-bold">₹{holding.currentValue.toFixed(2)}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`font-mono font-bold ${
                              isProfit ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {isProfit ? '+' : ''}
                            ₹{holding.unrealizedPnL.toFixed(2)} ({holding.pnlPercent.toFixed(2)}%)
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleQuickSell(holding.symbol, holding.quantity, holding.currentPrice)}
                            className="px-3 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900 text-xs font-semibold hover:bg-rose-600 hover:text-white transition cursor-pointer"
                          >
                            সেল করুন
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Tab 2: Orders History Table */}
        {activeTab === 'orders' && (
          <div className="overflow-x-auto">
            {userPortfolio.orders.length === 0 ? (
              <p className="text-xs text-center text-slate-400 py-8">কোনো পূর্ববর্তী অর্ডার পাওয়া যায়নি।</p>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">তারিখ ও সময়</th>
                    <th className="py-2.5 px-3">স্টক</th>
                    <th className="py-2.5 px-3">ধরন</th>
                    <th className="py-2.5 px-3">অর্ডার মোড</th>
                    <th className="py-2.5 px-3">সংখ্যা</th>
                    <th className="py-2.5 px-3">মূল্য</th>
                    <th className="py-2.5 px-3">মোট টাকা</th>
                    <th className="py-2.5 px-3">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {userPortfolio.orders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{order.timestamp}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                        {order.symbol}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                            order.type === 'BUY'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {order.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500">{order.orderType}</td>
                      <td className="py-3 px-3 font-mono">{order.quantity}টি</td>
                      <td className="py-3 px-3 font-mono">₹{order.price.toFixed(2)}</td>
                      <td className="py-3 px-3 font-mono font-bold">₹{order.totalAmount.toFixed(2)}</td>
                      <td className="py-3 px-3">
                        <span className="text-emerald-600 flex items-center gap-1 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          সম্পন্ন
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
