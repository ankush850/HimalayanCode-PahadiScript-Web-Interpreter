"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Play, CheckCircle2, XCircle } from 'lucide-react';

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
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pahadi_execution_history');
      if (raw) {
        setHistory(JSON.parse(raw));
      }
    } catch (e) {
      console.error('Error loading history from localStorage:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your local execution history?')) {
      localStorage.removeItem('pahadi_execution_history');
      setHistory([]);
    }
  };

  const handleRerun = (codeString: string) => {
    sessionStorage.setItem('pahadi_rerun_code', codeString);
    router.push('/editor');
  };

  const formatDate = (isoString: string | null) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return (
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
        ' · ' +
        date.toLocaleDateString()
      );
    } catch {
      return isoString;
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-sm text-[#6F6F6F]">
        Loading history...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-rise max-w-[800px] mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-normal text-black">
            Execution History
          </h1>
          <p className="text-sm text-[#6F6F6F] mt-1">
            Private browser timeline of your past compile runs and outputs.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* History timeline container */}
      <div className="p-8 rounded-3xl border border-black/10 bg-white/90 backdrop-blur-xl shadow-xl">
        {history.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-base text-black font-medium">No scripts executed yet</p>
            <p className="text-xs text-[#6F6F6F] mt-1 max-w-sm mx-auto">
              Run any PahadiScript program in the editor. Your runs will be saved privately in your browser.
            </p>
            <button
              onClick={() => router.push('/editor')}
              className="mt-6 rounded-full px-6 py-2.5 bg-black text-white text-xs font-medium hover:scale-[1.03] transition-transform"
            >
              Open Editor
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((row) => (
              <div
                key={row.id}
                className="flex items-center justify-between gap-4 p-4 border border-black/5 bg-[#FAF9F6] rounded-2xl hover:border-black/20 transition-all"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {row.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                  )}
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
                  className="rounded-full px-4 py-1.5 bg-transparent border border-black/10 text-black text-xs font-medium hover:bg-black hover:text-white transition-all flex items-center gap-1 shrink-0"
                >
                  <Play className="w-3 h-3" />
                  <span>Rerun</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
