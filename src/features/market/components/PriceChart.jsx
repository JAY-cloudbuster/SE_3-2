import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { priceService } from '../../../services/priceService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

export default function PriceChart({ crop = 'Tomato' }) {
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const res = await priceService.getHistoricalTrends(crop);
        const serverData = res.data || [];
        if (serverData.length) {
          setDataPoints(serverData);
        } else {
          setDataPoints([
            { date: 'Mon', price: 32 },
            { date: 'Tue', price: 35 },
            { date: 'Wed', price: 31 },
            { date: 'Thu', price: 38 },
            { date: 'Fri', price: 36 },
          ]);
        }
      } catch {
        setDataPoints([
          { date: 'Mon', price: 32 },
          { date: 'Tue', price: 35 },
          { date: 'Wed', price: 31 },
          { date: 'Thu', price: 38 },
          { date: 'Fri', price: 36 },
        ]);
      }
    };
    fetchTrends();
  }, [crop]);

  const chartData = {
    labels: dataPoints.map((p) => p.date),
    datasets: [
      {
        label: `${crop} price (₹/kg)`,
        data: dataPoints.map((p) => p.price),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        tension: 0.35,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#10b981',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#e5e7eb',
        bodyColor: '#e5e7eb',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.2)',
        },
        ticks: {
          callback: (value) => `₹${value}`,
        },
      },
    },
  };

  return (
    <div className="glass-card p-6 space-y-3">
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-black text-emerald-900 tracking-tight">
          Market Trend
        </h3>
        <span className="text-[10px] font-black uppercase text-slate-400">
          Last 5 days
        </span>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
}

