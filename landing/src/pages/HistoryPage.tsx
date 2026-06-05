import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface HistoryItem {
  id: number;
  code: string;
  success: boolean;
  execution_time_ms: number;
  output: string | null;
  error: string | null;
  created_at: string | null;
}

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Authenticate user check
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Fetch execution history timeline data
  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/history');
        const data = await res.json();

        if (data.ok) {
          setHistory(data.items);
        } else {
          setError(data.error || 'Failed to fetch execution history');
        }
      } catch (err) {
        console.error('Error fetching history:', err);
        setError('Failed to connect to the backend server');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const handleRerun = (codeString: string) => {
    sessionStorage.setItem('pahadi_rerun_code', codeString);
    navigate('/editor');
  };

  const formatDate = (isoString: string | null) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + date.toLocaleDateString();
    } catch {
      return isoString;
    }
  };

  if (authLoading || (user && loading)) {
    return (
      <div className="py-20 text-center text-sm text-[#6F6F6F]">
        Loading history timeline...
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
    <div className="space-y-8 animate-fade-rise max-w-[800px] mx-auto">
      {/* Title */}
      <div className="dash-hero">
        <h1 className="text-4xl font-display font-normal text-black">
          Execution History
        </h1>
        <p className="text-sm text-[#6F6F6F]">
          Timeline review of your compile runs, outputs, and performance.
        </p>
      </div>

      {/* History timeline container */}
      <div className="glass p-8 rounded-[24px]">
        {history.length === 0 ? (
          <p className="text-sm text-[#6F6F6F] py-8 text-center">
            No scripts executed yet. Run code in the editor to see your timeline here.
          </p>
        ) : (
          <div className="space-y-4">
            {history.map((row) => (
              <div
                key={row.id}
                className="flex items-center justify-between gap-4 p-4 border border-black/5 bg-[#FAF9F6] rounded-2xl hover:border-black/20 transition-all"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <span
                    className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                      row.success ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <code className="text-xs text-[#222222] font-mono block truncate max-h-[1.5rem] overflow-hidden mb-1 select-text">
                      {row.code}
                    </code>
                    <div className="text-[11px] text-[#6F6F6F]">
                      {formatDate(row.created_at)} · {row.execution_time_ms.toFixed(2)} ms
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRerun(row.code)}
                  className="rounded-full px-4 py-1.5 bg-transparent border border-black/10 text-black text-xs font-medium hover:bg-black hover:text-white transition-all flex-shrink-0"
                >
                  Rerun
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
