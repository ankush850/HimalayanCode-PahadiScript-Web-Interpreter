import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { useAuth } from '../context/AuthContext';

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
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [daily, setDaily] = useState<DailyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const pieCanvasRef = useRef<HTMLCanvasElement>(null);
  const runsCanvasRef = useRef<HTMLCanvasElement>(null);
  const timeCanvasRef = useRef<HTMLCanvasElement>(null);

  const pieChartRef = useRef<Chart | null>(null);
  const runsChartRef = useRef<Chart | null>(null);
  const timeChartRef = useRef<Chart | null>(null);

  // Authenticate user check
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Fetch dashboard analytics data
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const res = await fetch('/api/analytics');
        const anaData = await res.json();

        if (anaData.ok) {
          setSummary(anaData.summary);
          setDaily(anaData.daily);
        } else {
          setError('Failed to fetch analytics metrics');
        }
      } catch (err) {
        console.error('Error fetching dashboard info:', err);
        setError('Failed to connect to the backend server');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Construct charts
  useEffect(() => {
    if (loading || error || !summary || daily.length === 0) return;

    // 1. Doughnut Success/Failure Chart
    if (pieCanvasRef.current) {
      if (pieChartRef.current) pieChartRef.current.destroy();
      pieChartRef.current = new Chart(pieCanvasRef.current, {
        type: 'doughnut',
        data: {
          labels: ['Success', 'Failure'],
          datasets: [
            {
              data: [summary.successes, summary.failures],
              backgroundColor: ['rgba(46, 204, 113, 0.85)', 'rgba(231, 76, 60, 0.85)'],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          aspectRatio: 2.5,
          plugins: { 
            legend: { 
              labels: { 
                color: '#6f6f6f',
                font: { family: 'Inter' }
              } 
            } 
          },
        },
      });
    }

    const labels = daily.map((d) => d.date);

    // 2. Runs Success/Failure Timeline Chart
    if (runsCanvasRef.current) {
      if (runsChartRef.current) runsChartRef.current.destroy();
      runsChartRef.current = new Chart(runsCanvasRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Success',
              data: daily.map((d) => d.success),
              borderColor: 'rgba(46, 204, 113, 0.9)',
              backgroundColor: 'rgba(46, 204, 113, 0.05)',
              borderWidth: 2,
              tension: 0.4,
              fill: true,
            },
            {
              label: 'Failure',
              data: daily.map((d) => d.failure),
              borderColor: 'rgba(231, 76, 60, 0.9)',
              backgroundColor: 'rgba(231, 76, 60, 0.05)',
              borderWidth: 2,
              tension: 0.4,
              fill: true,
            }
          ],
        },
        options: {
          responsive: true,
          aspectRatio: 3,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          scales: {
            x: { 
              ticks: { color: '#6f6f6f', font: { family: 'Inter' } }, 
              grid: { color: 'rgba(0,0,0,0.04)' } 
            },
            y: { 
              ticks: { color: '#6f6f6f', font: { family: 'Inter' } }, 
              grid: { color: 'rgba(0,0,0,0.04)' }, 
              beginAtZero: true 
            },
          },
          plugins: { 
            legend: { 
              labels: { 
                color: '#6f6f6f',
                font: { family: 'Inter' }
              } 
            } 
          },
        },
      });
    }

    // 3. Execution Time (Total vs Avg) Line Chart
    if (timeCanvasRef.current) {
      if (timeChartRef.current) timeChartRef.current.destroy();
      timeChartRef.current = new Chart(timeCanvasRef.current, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Total Execution (ms)',
              data: daily.map((d) => d.total_execution_ms),
              borderColor: 'rgba(241, 196, 15, 0.9)',
              backgroundColor: 'rgba(241, 196, 15, 0.05)',
              borderWidth: 2,
              tension: 0.4,
              fill: true,
            },
            {
              label: 'Avg Execution (ms)',
              data: daily.map((d) => d.avg_execution_ms),
              borderColor: 'rgba(52, 152, 219, 0.9)',
              backgroundColor: 'rgba(52, 152, 219, 0.05)',
              borderWidth: 2,
              tension: 0.4,
              fill: false,
            }
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          scales: {
            x: { 
              ticks: { color: '#6f6f6f', font: { family: 'Inter' } }, 
              grid: { color: 'rgba(0,0,0,0.04)' } 
            },
            y: { 
              ticks: { color: '#6f6f6f', font: { family: 'Inter' } }, 
              grid: { color: 'rgba(0,0,0,0.04)' }, 
              beginAtZero: true 
            },
          },
          plugins: { 
            legend: { 
              labels: { 
                color: '#6f6f6f',
                font: { family: 'Inter' }
              } 
            } 
          },
        },
      });
    }

    return () => {
      if (pieChartRef.current) pieChartRef.current.destroy();
      if (runsChartRef.current) runsChartRef.current.destroy();
      if (timeChartRef.current) timeChartRef.current.destroy();
    };
  }, [loading, error, summary, daily]);

  if (authLoading || (user && loading)) {
    return (
      <div className="py-20 text-center text-sm text-[#6F6F6F]">
        Loading dashboard metrics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg p-4 text-center my-10">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-rise">
      {/* Title */}
      <div className="dash-hero">
        <h1 className="text-4xl font-display font-normal text-black">
          Dashboard
        </h1>
        <p className="text-sm text-[#6F6F6F]">
          Analytical review of your Himalayan coding runs.
        </p>
      </div>

      {/* Counters Metrics Row */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-[24px] flex flex-col justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-[#6F6F6F]">
              Total Runs
            </span>
            <span className="text-5xl font-display font-normal text-black mt-2">
              {summary.total_runs}
            </span>
          </div>

          <div className="glass p-6 rounded-[24px] flex flex-col justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-[#6F6F6F]">
              Success Rate
            </span>
            <span className="text-5xl font-display font-normal text-black mt-2">
              {(summary.success_rate * 100).toFixed(1)}%
            </span>
          </div>

          <div className="glass p-6 rounded-[24px] flex flex-col justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-[#6F6F6F]">
              Avg Execution Time
            </span>
            <span className="text-5xl font-display font-normal text-black mt-2">
              {summary.avg_execution_ms.toFixed(1)}<span className="text-sm font-sans ml-1 text-[#6F6F6F]">ms</span>
            </span>
          </div>
        </div>
      )}

      {/* Chart Layout Blocks */}
      {summary && summary.total_runs > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Doughnut Success Ratio Chart */}
          <div className="glass p-6 rounded-[24px] lg:col-span-1 flex flex-col justify-between">
            <h2 className="text-2xl font-display font-normal text-black mb-4">
              Success vs Failure
            </h2>
            <div className="flex-1 flex items-center justify-center p-2">
              <canvas ref={pieCanvasRef} />
            </div>
          </div>

          {/* Time Series Analytics Charts */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass p-6 rounded-[24px]">
              <h2 className="text-2xl font-display font-normal text-black mb-4">
                Executions Over Time
              </h2>
              <canvas ref={runsCanvasRef} />
            </div>

            <div className="glass p-6 rounded-[24px]">
              <h2 className="text-2xl font-display font-normal text-black mb-4">
                Latency Over Time (ms)
              </h2>
              <div 
                className="p-4 rounded-xl flex items-center justify-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  minHeight: '320px',
                  height: '350px',
                  position: 'relative',
                  width: '100%',
                }}
              >
                <canvas ref={timeCanvasRef} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
