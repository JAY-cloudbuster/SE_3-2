import React, { useState, useCallback, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, Cpu, IndianRupee, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

// ─── Constants ───────────────────────────────────────────────────────────────

const CROPS = [
  'Apple', 'Bajra', 'Banana', 'Ladies Finger', 'Brinjal', 'Cabbage',
  'Carrot', 'Cauliflower', 'Cotton', 'Garlic', 'Ginger', 'Green Chilli',
  'Green Gram', 'Groundnut', 'Jaggery', 'Jowar', 'Maize', 'Mango',
  'Mustard', 'Soyabean', 'Wheat',
];

const RECOMMENDATION_META = {
  BUY: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: TrendingUp, label: 'Buy Now' },
  WAIT: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: Minus, label: 'Wait' },
  HOLD: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: TrendingUp, label: 'Hold' },
  'SELL NOW': { color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', icon: TrendingDown, label: 'Sell Now' },
};

function formatCurrency(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 'No data';
  }

  return `₹${value.toLocaleString('en-IN')}`;
}

function getTrendLabel(chartData, predictedPrice) {
  const historicalData = Array.isArray(chartData) ? chartData.filter((point) => !point.isPrediction) : [];
  const latestHistorical = historicalData.at(-1)?.price;

  if (typeof latestHistorical !== 'number' || typeof predictedPrice !== 'number') {
    return {
      value: 'No live trend',
      subValue: 'Dataset did not return enough recent points',
      colorClass: 'text-slate-500',
      bgClass: 'bg-slate-50',
      borderClass: 'border-slate-100',
    };
  }

  if (predictedPrice > latestHistorical) {
    return {
      value: 'Upward ↑',
      subValue: `Latest observed price: ${formatCurrency(latestHistorical)}`,
      colorClass: 'text-emerald-600',
      bgClass: 'bg-emerald-50',
      borderClass: 'border-emerald-100',
    };
  }

  if (predictedPrice < latestHistorical) {
    return {
      value: 'Downward ↓',
      subValue: `Latest observed price: ${formatCurrency(latestHistorical)}`,
      colorClass: 'text-rose-500',
      bgClass: 'bg-rose-50',
      borderClass: 'border-rose-100',
    };
  }

  return {
    value: 'Stable →',
    subValue: `Latest observed price: ${formatCurrency(latestHistorical)}`,
    colorClass: 'text-amber-600',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-100',
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SummaryCardSkeleton() {
  return (
    <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm animate-pulse">
      <div className="h-3 w-24 bg-stone-200 rounded mb-4" />
      <div className="h-8 w-32 bg-stone-200 rounded mb-2" />
      <div className="h-3 w-16 bg-stone-100 rounded" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm animate-pulse">
      <div className="h-4 w-40 bg-stone-200 rounded mb-6" />
      <div className="h-64 bg-stone-100 rounded-xl" />
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, subValue, colorClass = 'text-emerald-600', bgClass = 'bg-emerald-50', borderClass = 'border-emerald-100' }) {
  return (
    <div className={`rounded-2xl border ${borderClass} bg-white p-5 shadow-sm flex gap-4 items-start`}>
      <div className={`${bgClass} rounded-xl p-2.5 mt-0.5`}>
        <Icon size={18} className={colorClass} />
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
        <p className={`text-2xl font-black mt-0.5 ${colorClass}`}>{value}</p>
        {subValue && <p className="text-xs text-slate-400 mt-0.5 font-medium">{subValue}</p>}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const point = payload[0].payload;
    return (
      <div className="bg-white border border-stone-200 rounded-xl shadow-lg px-4 py-3 text-sm">
        <p className="font-bold text-slate-700">{label}</p>
        <p className="text-emerald-600 font-black text-base">₹{payload[0].value?.toLocaleString('en-IN')}</p>
        {point.isPrediction && (
          <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 border border-violet-100 rounded-full px-2 py-0.5">
            AI Predicted
          </span>
        )}
      </div>
    );
  }
  return null;
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MarketPrices() {
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCropData = useCallback(async (crop) => {
    setSelectedCrop(crop);
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await api.get('/decision', { params: { crop } });
      setData(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch market data. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCropData(CROPS[0]);
  }, [fetchCropData]);

  // Derive chart split index for styling historical vs predicted points
  const predictionStartIndex = data?.chartData
    ? data.chartData.findIndex((d) => d.isPrediction)
    : -1;

  const historicalPoints = data?.chartData?.filter((point) => !point.isPrediction) ?? [];
  const trendInfo = getTrendLabel(data?.chartData, data?.predictedPrice);
  const recommendationKey = data?.recommendation || 'WAIT';
  const recMeta = RECOMMENDATION_META[recommendationKey] ?? RECOMMENDATION_META.WAIT;
  const recommendationText = data?.recommendationLabel || recMeta.label;
  const hasMarketData = historicalPoints.length > 0 && typeof data?.predictedPrice === 'number';

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden bg-stone-50 rounded-2xl border border-stone-100 shadow-sm">

      {/* ── Left Sidebar ──────────────────────────────────────────────────── */}
      <aside className="w-60 shrink-0 flex flex-col border-r border-stone-100 bg-white">
        <div className="px-4 py-5 border-b border-stone-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Market Prices</p>
          <h2 className="text-lg font-black text-slate-800 mt-0.5">Select Crop</h2>
        </div>
        <ul className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-stone-200">
          {CROPS.map((crop) => (
            <li key={crop}>
              <button
                onClick={() => fetchCropData(crop)}
                className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-all rounded-none
                  ${selectedCrop === crop
                    ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500'
                    : 'text-slate-600 hover:bg-stone-50 hover:text-slate-900'
                  }`}
              >
                {crop}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* Empty state */}
        {!selectedCrop && !loading && (
          <div className="h-full flex flex-col items-center justify-center text-center gap-3">
            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
              <BarChart2 size={40} className="text-emerald-400 mx-auto" />
            </div>
            <h3 className="text-xl font-black text-slate-700">Select a crop to begin</h3>
            <p className="text-sm text-slate-400 max-w-xs">
              Click any crop from the sidebar to view AI-powered price predictions and market trends.
            </p>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <>
            <div className="h-6 w-48 bg-stone-200 rounded animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SummaryCardSkeleton /><SummaryCardSkeleton /><SummaryCardSkeleton />
            </div>
            <ChartSkeleton />
          </>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="rounded-2xl bg-rose-50 border border-rose-100 p-6 text-center">
            <p className="text-rose-600 font-bold">{error}</p>
            <button
              onClick={() => fetchCropData(selectedCrop)}
              className="mt-3 text-xs font-black uppercase tracking-wider text-rose-600 hover:underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Data loaded */}
        {data && !loading && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Decision Engine</p>
                <h2 className="text-2xl font-black text-slate-800">{selectedCrop}</h2>
              </div>
              {recMeta && (
                <span className={`inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full border ${recMeta.bg} ${recMeta.color} ${recMeta.border}`}>
                  <recMeta.icon size={13} />
                  {recMeta.label}
                </span>
              )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SummaryCard
                icon={TrendingUp}
                label="Current Trend"
                value={trendInfo.value}
                subValue={trendInfo.subValue}
                colorClass={trendInfo.colorClass}
                bgClass={trendInfo.bgClass}
                borderClass={trendInfo.borderClass}
              />
              <SummaryCard
                icon={IndianRupee}
                label="Predicted Price"
                value={formatCurrency(data.predictedPrice)}
                subValue={`3-day projection: ${formatCurrency(data.projectedPrice3Days)}`}
                colorClass="text-violet-600"
                bgClass="bg-violet-50"
                borderClass="border-violet-100"
              />
              <SummaryCard
                icon={recMeta?.icon ?? Cpu}
                label="AI Recommendation"
                value={recommendationText}
                subValue={data.explanation ? `${data.explanation.slice(0, 60)}${data.explanation.length > 60 ? '…' : ''}` : 'Live recommendation unavailable'}
                colorClass={recMeta?.color ?? 'text-amber-600'}
                bgClass={recMeta?.bg ?? 'bg-amber-50'}
                borderClass={recMeta?.border ?? 'border-amber-100'}
              />
            </div>

            {/* Line Chart */}
            <div className="rounded-2xl border border-stone-100 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price Trend</p>
                  <h3 className="text-base font-black text-slate-700">7-Day Price Movement</h3>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-0.5 bg-emerald-500 rounded" /> Historical
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-0.5 bg-violet-400 rounded border-dashed border-t-2 border-violet-400" /> Predicted
                  </span>
                </div>
              </div>
              {hasMarketData ? (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={data.chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset={`${predictionStartIndex >= 0 && data.chartData.length > 1 ? Math.round((predictionStartIndex / (data.chartData.length - 1)) * 100) : 100}%`} stopColor="#10b981" />
                        <stop offset={`${predictionStartIndex >= 0 && data.chartData.length > 1 ? Math.round((predictionStartIndex / (data.chartData.length - 1)) * 100) : 100}%`} stopColor="#a78bfa" />
                        <stop offset="100%" stopColor="#a78bfa" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`}
                      width={55}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {predictionStartIndex > 0 && (
                      <ReferenceLine
                        x={data.chartData[predictionStartIndex]?.day}
                        stroke="#c4b5fd"
                        strokeDasharray="4 3"
                        label={{ value: 'Forecast', position: 'insideTopRight', fontSize: 10, fill: '#7c3aed', fontWeight: 700 }}
                      />
                    )}
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="url(#priceGradient)"
                      strokeWidth={2.5}
                      dot={(props) => {
                        const { cx, cy, payload } = props;
                        return (
                          <circle
                            key={`dot-${payload.day}`}
                            cx={cx}
                            cy={cy}
                            r={4}
                            fill={payload.isPrediction ? '#a78bfa' : '#10b981'}
                            stroke="white"
                            strokeWidth={2}
                          />
                        );
                      }}
                      activeDot={{ r: 6, strokeWidth: 2, stroke: 'white' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-65 rounded-xl border border-dashed border-stone-200 bg-stone-50 flex items-center justify-center text-center px-6">
                  <div>
                    <p className="text-sm font-bold text-slate-600">No live trend available for {selectedCrop}</p>
                    <p className="mt-1 text-xs text-slate-400">The dataset did not return enough recent observations to draw a price curve.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Explanation */}
            {data.explanation && (
              <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-sm flex gap-3">
                <div className="bg-slate-50 rounded-xl p-2.5 h-fit">
                  <Cpu size={16} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">AI Analysis</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{data.explanation}</p>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
