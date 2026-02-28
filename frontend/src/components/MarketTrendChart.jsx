/**
 * @fileoverview MarketTrendChart — Module 5 Visualisation
 *
 * Fetches price-trend + AI recommendation from /api/decision
 * and renders a Recharts <LineChart> with a visually distinct
 * prediction point (dashed segment + different dot colour).
 *
 * Props:
 *   crop  {string}  — Commodity name (e.g. "Wheat")
 *
 * @component MarketTrendChart
 */

import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import api from '../services/api';

/* ── Custom dot renderer: orange for prediction, emerald for actual ── */
function CustomDot(props) {
  const { cx, cy, payload } = props;
  if (!payload) return null;
  if (payload.isPrediction) {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill="#f59e0b"
        stroke="#fff"
        strokeWidth={2}
      />
    );
  }
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill="#10b981"
      stroke="#fff"
      strokeWidth={2}
    />
  );
}

export default function MarketTrendChart({ crop, state, data: externalData }) {
  const [chartData, setChartData] = useState([]);
  const [recommendation, setRecommendation] = useState('');
  const [recommendationLabel, setRecommendationLabel] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If parent passes data directly (e.g. from SmartPostModal), use it
    if (externalData) {
      setChartData(externalData.chartData || []);
      setRecommendation(externalData.recommendation || '');
      setRecommendationLabel(externalData.recommendationLabel || externalData.recommendation || '');
      setExplanation(externalData.explanation || '');
      return;
    }

    if (!crop) return;

    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(
          `/decision?crop=${encodeURIComponent(crop)}`
        );
        const d = res.data;
        setChartData(d.chartData || []);
        setRecommendation(d.recommendation || '');
        setRecommendationLabel(d.recommendationLabel || d.recommendation || '');
        setExplanation(d.explanation || '');
      } catch (err) {
        console.error('MarketTrendChart fetch error:', err);
        setError('Unable to load market data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [crop, externalData]);

  /* ── Badge colour by recommendation ── */
  const badgeColour = {
    WAIT: 'bg-amber-100 text-amber-700 border-amber-300',
    'SELL NOW': 'bg-rose-100 text-rose-700 border-rose-300',
    HOLD: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  }[recommendation] || 'bg-slate-100 text-slate-600';

  if (loading) {
    return (
      <div className="text-center py-10 text-slate-400 text-sm font-medium animate-pulse">
        Analysing market trends…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-rose-500 text-sm font-medium">{error}</div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="text-center py-10 text-slate-400 text-sm">
        Select a crop to view market trends.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Recommendation badge + explanation */}
      {recommendation && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span
            className={`inline-block px-3 py-1 rounded-lg text-xs font-black border ${badgeColour}`}
          >
            {recommendationLabel || recommendation}
          </span>
          <p className="text-sm text-slate-600">{explanation}</p>
        </div>
      )}

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="day"
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickFormatter={(v) => `₹${v}`}
          />
          <Tooltip
            formatter={(value, _name, props) => [
              `₹${value}`,
              props.payload.isPrediction ? 'Predicted' : 'Actual',
            ]}
            contentStyle={{
              borderRadius: '0.75rem',
              border: '1px solid #d1fae5',
              fontSize: '0.8rem',
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={<CustomDot />}
            strokeDasharray={(idx) => ''}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-6 justify-center text-xs text-slate-500 font-medium">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
          Actual Price
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
          AI Prediction
        </span>
      </div>
    </div>
  );
}
