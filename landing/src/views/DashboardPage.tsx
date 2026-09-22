"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Chart from 'chart.js/auto';
import { Activity, CheckCircle2, XCircle, Clock, Zap, ArrowRight } from 'lucide-react';

interface HistoryItem {
  id: number;
  code: string;
  success: boolean;
  execution_time_ms: number;
  output: string | null;
  error: string | null;
  created_at: string | null;
}

interface AnalyticsSummary {
  total_runs: number;
  successes: number;
  failures: number;
  success_rate: number;
  avg_execution_ms: number;
}

interface DailyItem {
  date: string;
  success: number;
  failure: number;
  avg_execution_ms: number;
  total_execution_ms: number;
}

export default function DashboardPage() {
  const router = useRouter();

  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [daily, setDaily] = useState<DailyItem[]>([]);
  const [loading, setLoading] = useState(true);

  const pieCanvasRef = useRef<HTMLCanvasElement>(null);
  const runsCanvasRef = useRef<HTMLCanvasElement>(null);
  const timeCanvasRef = useRef<HTMLCanvasElement>(null);

  const pieChartRef = useRef<Chart | null>(null);
  const runsChartRef = useRef<Chart | null>(null);
  const timeChartRef = useRef<Chart | null>(null);

  // Compute analytics directly from local storage (Zero database, Zero login)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('pahadi_execution_history');
      const items: HistoryItem[] = raw ? JSON.parse(raw) : [];

      const total = items.length;
      const successes = items.filter((e) => e.success).length;
      const failures = total - successes;
      const avgMs =
        total > 0
          ? items.reduce((acc, curr) => acc + curr.execution_time_ms, 0) / total
          : 0;

      setSummary({
        total_runs: total,
        successes,
        failures,
        success_rate: total > 0 ? successes / total : 0,
        avg_execution_ms: Math.round(avgMs * 100) / 100,
      });

      // Build daily timeline from recent runs (chronological order)
      const chronological = [...items].reverse();
      const dailyMap = new Map<string, { success: number; failure: number; total_ms: number; count: number }>();

      for (const item of chronological) {
        let label = 'Run';
        if (item.created_at) {
          try {
            const d = new Date(item.created_at);
            label = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
          } catch {
            label = 'Run';
          }
        }
        const existing = dailyMap.get(label) || { success: 0, failure: 0, total_ms: 0, count: 0 };
        if (item.success) {
          existing.success += 1;
        } else {
          existing.failure += 1;
        }
        existing.total_ms += item.execution_time_ms;
        existing.count += 1;
        dailyMap.set(label, existing);
      }

      const dailyItems: DailyItem[] = Array.from(dailyMap.entries()).slice(-15).map(([date, val]) => ({
        date,
        success: val.success,
        failure: val.failure,
        total_execution_ms: Math.round(val.total_ms * 100) / 100,
        avg_execution_ms: Math.round((val.total_ms / (val.count || 1)) * 100) / 100,
      }));

      setDaily(dailyItems);
    } catch (e) {
      console.error('Error computing metrics from localStorage:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Construct charts
  useEffect(() => {
    if (loading || !summary) return;

    // 1. Doughnut Success/Failure Chart
    if (pieCanvasRef.current && (summary.successes > 0 || summary.failures > 0)) {
      if (pieChartRef.current) pieChartRef.current.destroy();
      pieChartRef.current = new Chart(pieCanvasRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Success', 'Failure'],
          datasets: [
            {
              data: [summary.successes, summary.failures],
              backgroundColor: ['rgba(16, 185, 129, 0.85)', 'rgba(244, 63, 94, 0.85)'],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          aspectRatio: 2.2,
          plugins: {
            legend: {
              labels: {
                color: '#6f6f6f',
                font: { family: 'Inter' },
              },
            },
          },
        },
      });
    }

    // 2. Execution Runs Stacked Bar Chart
    if (runsCanvasRef.current && daily.length > 0) {
      if (runsChartRef.current) runsChartRef.current.destroy();
      runsChartRef.current = new Chart(runsCanvasRef.current, {
        type: 'bar',
        data: {
          labels: daily.map((d) => d.date),
          datasets: [
            {
              label: 'Success',
              data: daily.map((d) => d.success),
              backgroundColor: 'rgba(16, 185, 129, 0.85)',
              borderRadius: 4,
            },
            {
              label: 'Failure',
              data: daily.map((d) => d.failure),
              backgroundColor: 'rgba(244, 63, 94, 0.85)',
              borderRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              stacked: true,
              ticks: { color: '#6f6f6f', font: { family: 'Inter' } },
              grid: { color: 'rgba(0,0,0,0.04)' },
            },
            y: {
              stacked: true,
              ticks: { color: '#6f6f6f', font: { family: 'Inter' } },
              grid: { color: 'rgba(0,0,0,0.04)' },
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              labels: {
                color: '#6f6f6f',
                font: { family: 'Inter' },
              },
            },
          },
        },
      });
    }

    // 3. Execution Time Line Chart
    if (timeCanvasRef.current && daily.length > 0) {
      if (timeChartRef.current) timeChartRef.current.destroy();
      timeChartRef.current = new Chart(timeCanvasRef.current, {
        type: 'line',
        data: {
          labels: daily.map((d) => d.date),
          datasets: [
            {
              label: 'Avg Execution (ms)',
              data: daily.map((d) => d.avg_execution_ms),
              borderColor: 'rgba(16, 185, 129, 0.9)',
              backgroundColor: 'rgba(16, 185, 129, 0.05)',
              borderWidth: 2,
              tension: 0.3,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              ticks: { color: '#6f6f6f', font: { family: 'Inter' } },
              grid: { color: 'rgba(0,0,0,0.04)' },
            },
            y: {
              ticks: { color: '#6f6f6f', font: { family: 'Inter' } },
              grid: { color: 'rgba(0,0,0,0.04)' },
              beginAtZero: true,
            },
          },
          plugins: {
            legend: {
              labels: {
                color: '#6f6f6f',
                font: { family: 'Inter' },
              },
            },
          },
        },
      });
    }

    return () => {
      if (pieChartRef.current) pieChartRef.current.destroy();
      if (runsChartRef.current) runsChartRef.current.destroy();
      if (timeChartRef.current) timeChartRef.current.destroy();
    };
  }, [loading, summary, daily]);

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-[#6F6F6F]">
        Loading dashboard metrics...
      </div>
    );
  }

  const hasRuns = summary && summary.total_runs > 0;

  return (
    <div className="space-y-8 animate-fade-rise max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-normal text-black">
            Compiler Dashboard & Analytics
          </h1>
          <p className="text-sm text-[#6F6F6F] mt-1">
            Real-time execution metrics, compiler speed, and success statistics.
          </p>
        </div>
        <button
          onClick={() => router.push('/editor')}
          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-black text-white hover:scale-[1.03] transition-transform text-xs font-medium self-start sm:self-auto"
        >
          <span>Open Editor</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-black/10 bg-white/90 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6F6F6F] mb-2 font-medium">
            <span>Total Runs</span>
            <Activity className="w-4 h-4 text-black/60" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-semibold text-black">
            {summary?.total_runs || 0}
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-black/10 bg-white/90 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6F6F6F] mb-2 font-medium">
            <span>Success Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-semibold text-emerald-600">
            {summary ? Math.round(summary.success_rate * 100) : 0}%
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-black/10 bg-white/90 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6F6F6F] mb-2 font-medium">
            <span>Failures</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-semibold text-rose-500">
            {summary?.failures || 0}
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-black/10 bg-white/90 backdrop-blur-md shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6F6F6F] mb-2 font-medium">
            <span>Avg Speed</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-semibold text-black">
            {summary?.avg_execution_ms || 0} <span className="text-sm font-sans text-[#6F6F6F]">ms</span>
          </div>
        </div>
      </div>

      {!hasRuns ? (
        <div className="p-12 rounded-3xl border border-black/10 bg-white/90 text-center shadow-lg">
          <Zap className="w-8 h-8 text-amber-500 mx-auto mb-3" />
          <h3 className="text-lg font-display text-black">No Program Executions Yet</h3>
          <p className="text-xs text-[#6F6F6F] mt-1 max-w-md mx-auto">
            Write and execute a PahadiScript program in the editor. Your compile analytics will appear here automatically.
          </p>
          <button
            onClick={() => router.push('/editor')}
            className="mt-6 rounded-full px-6 py-2.5 bg-black text-white text-xs font-medium hover:scale-[1.03] transition-transform"
          >
            Launch Editor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Doughnut Chart */}
          <div className="p-6 rounded-3xl border border-black/10 bg-white/90 backdrop-blur-md shadow-sm">
            <h3 className="text-sm font-semibold text-black uppercase tracking-wider mb-4">
              Success vs Failure Ratio
            </h3>
            <div className="h-64 flex items-center justify-center">
              <canvas ref={pieCanvasRef} />
            </div>
          </div>

          {/* Execution Time Line Chart */}
          <div className="p-6 rounded-3xl border border-black/10 bg-white/90 backdrop-blur-md shadow-sm">
            <h3 className="text-sm font-semibold text-black uppercase tracking-wider mb-4">
              Execution Speed Timeline
            </h3>
            <div className="h-64">
              <canvas ref={timeCanvasRef} />
            </div>
          </div>

          {/* Runs Bar Chart */}
          <div className="p-6 rounded-3xl border border-black/10 bg-white/90 backdrop-blur-md shadow-sm lg:col-span-2">
            <h3 className="text-sm font-semibold text-black uppercase tracking-wider mb-4">
              Recent Run Activity
            </h3>
            <div className="h-72">
              <canvas ref={runsCanvasRef} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
