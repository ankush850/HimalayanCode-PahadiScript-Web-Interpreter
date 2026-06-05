import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function SharePage() {
  const { share_id } = useParams<{ share_id: string }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSharedCode = async () => {
      try {
        const res = await fetch(`/api/share/${share_id}`);
        const data = await res.json();
        if (data.ok) {
          setCode(data.code);
        } else {
          setError(data.error || 'Shared snippet not found');
        }
      } catch (err) {
        console.error('Error fetching shared code:', err);
        setError('Failed to fetch shared snippet');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedCode();
  }, [share_id]);

  const handleEdit = () => {
    sessionStorage.setItem('pahadi_rerun_code', code);
    navigate('/editor');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  return (
    <div className="max-w-[720px] mx-auto py-12 animate-fade-rise">
      <div className="glass p-8 rounded-[24px]">
        <h1 className="text-4xl font-display font-normal text-black mb-2">
          Shared Code
        </h1>
        <p className="text-sm text-[#6F6F6F] mb-6">
          Shared snippet from a fellow mountain programmer.
        </p>

        {loading ? (
          <div className="py-20 text-center text-sm text-[#6F6F6F]">
            Loading code...
          </div>
        ) : error ? (
          <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg p-4 text-center">
            {error}
          </div>
        ) : (
          <>
            <pre className="share-code text-[#111111] font-mono text-sm leading-relaxed p-5 border border-black/5 bg-[#F7F7F7] rounded-2xl max-h-[50vh] overflow-auto whitespace-pre-wrap word-break-all select-text">
              {code}
            </pre>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleEdit}
                className="rounded-full px-6 py-2.5 bg-black text-white hover:scale-[1.03] transition-transform text-sm font-medium"
              >
                Open in Editor
              </button>
              <button
                onClick={handleCopyLink}
                className="rounded-full px-6 py-2.5 bg-transparent border border-black/10 text-black hover:bg-black/5 transition-colors text-sm font-medium"
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
