"use client";

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import CodeMirror from '@uiw/react-codemirror';

const DEFAULT_CODE = `shuru {
  bol "Namaste PahadiScript!"
}
`;

export default function EditorPage() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [terminalOut, setTerminalOut] = useState('');
  const [status, setStatus] = useState<'Ready' | 'Running…' | 'Success' | 'Error' | 'Network' | 'File Loaded' | 'Upload Error' | 'Share failed' | 'Share Error'>('Ready');
  const [execTime, setExecTime] = useState<number | null>(null);
  
  const [shareBoxVisible, setShareBoxVisible] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load code from query parameters or session storage on mount
  useEffect(() => {
    const loadId = searchParams?.get('load');
    if (loadId) {
      setStatus('Running…');
      fetch(`/api/share/${encodeURIComponent(loadId)}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.ok && data.code) {
            setCode(data.code);
            setStatus('Ready');
          } else {
            setStatus('Error');
            setTerminalOut('Failed to load shared snippet');
          }
        })
        .catch(() => {
          setStatus('Error');
          setTerminalOut('Network error loading shared snippet');
        });
      return;
    }

    const rerun = sessionStorage.getItem('pahadi_rerun_code');
    if (rerun) {
      setCode(rerun);
      sessionStorage.removeItem('pahadi_rerun_code');
    }
  }, [searchParams]);

  const handleRun = async () => {
    setTerminalOut('');
    setStatus('Running…');
    setExecTime(null);

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      
      setExecTime(data.execution_time_ms != null ? data.execution_time_ms : null);

      if (data.ok) {
        setStatus('Success');
        setTerminalOut(data.output || '');
      } else {
        setStatus('Error');
        const parts: string[] = [];
        if (data.output) parts.push(data.output);
        if (data.error) parts.push(data.error);
        setTerminalOut(parts.join('\n') || 'Unknown error');
      }
    } catch (e) {
      setStatus('Network');
      setTerminalOut(String(e));
    }
  };

  const handleShare = async () => {
    setShareBoxVisible(false);
    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!data.ok) {
        setTerminalOut((prev) => (prev ? prev + '\n\n' : '') + (data.error || 'Share failed'));
        setStatus('Share failed');
        return;
      }
      const url = `${window.location.origin}/share/${data.share_id}`;
      setShareUrl(url);
      setShareBoxVisible(true);
    } catch (e) {
      setTerminalOut((prev) => (prev ? prev + '\n\n' : '') + 'Share Error: ' + String(e));
      setStatus('Share Error');
    }
  };

  const handleCopyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.phd')) {
      setTerminalOut('Error: Only .phd files are allowed to be uploaded.');
      setStatus('Upload Error');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setCode(e.target.result);
        setStatus('File Loaded');
        setTerminalOut(`Successfully loaded ${file.name} into the editor.`);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const statusIsError = ['Error', 'Network', 'Upload Error', 'Share failed', 'Share Error'].includes(status);
  const statusIsOk = ['Success', 'File Loaded', 'Ready'].includes(status);

  return (
    <div className="space-y-6">
      {/* Editor & Terminal Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-rise">
        {/* Editor Panel */}
        <div className="glass p-8 rounded-[24px] flex flex-col">
          <div className="panel-header mb-6">
            <h1 className="text-4xl font-display font-normal text-black leading-none">
              Mountain Compiler
            </h1>
            <p className="text-sm text-[#6F6F6F] mt-2">
              Write PahadiScript, run it in the valley below.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mb-4 select-none">
            <button
              onClick={handleRun}
              disabled={status === 'Running…'}
              className="rounded-full px-6 py-2.5 bg-black text-white hover:scale-[1.03] transition-transform text-sm font-medium disabled:opacity-50 disabled:pointer-events-none"
            >
              Run ▶
            </button>
            <button
              onClick={handleShare}
              className="rounded-full px-6 py-2.5 bg-transparent border border-black/10 text-black hover:bg-black/5 transition-colors text-sm font-medium"
            >
              Share link
            </button>
            <button
              onClick={handleUploadClick}
              className="rounded-full px-6 py-2.5 bg-transparent border border-black/10 text-black hover:bg-black/5 transition-colors text-sm font-medium"
            >
              Upload .phd
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".phd"
              className="hidden"
            />
            {execTime !== null && (
              <span className="ml-auto text-xs font-mono text-[#6F6F6F]">
                {execTime} ms
              </span>
            )}
          </div>

          {/* CodeMirror Editor */}
          <div className="flex-1 rounded-[16px] overflow-hidden border border-black/5 select-text shadow-sm">
            <CodeMirror
              value={code}
              height="350px"
              theme="dark"
              onChange={(value) => setCode(value)}
              className="text-sm font-mono"
            />
          </div>

          {/* Share box links */}
          {shareBoxVisible && (
            <div className="mt-4 p-4 border border-black/5 bg-[#F7F7F7] rounded-xl flex items-center justify-between gap-3 animate-fade">
              <div className="flex-1 min-w-0">
                <span className="block text-[10px] uppercase tracking-wider text-[#6F6F6F] font-bold mb-1">
                  Shareable URL
                </span>
                <code className="text-xs text-black font-mono block truncate font-medium">
                  {shareUrl}
                </code>
              </div>
              <button
                onClick={handleCopyShare}
                className="rounded-full px-4 py-1.5 bg-black text-white text-xs font-medium hover:scale-[1.02] active:scale-[0.98] transition-transform flex-shrink-0"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          )}
        </div>

        {/* Terminal Panel */}
        <div className="glass p-8 rounded-[24px] flex flex-col">
          <div className="terminal-header flex justify-between items-center mb-6 select-none">
            <h2 className="text-3xl font-display font-normal text-black">
              Output
            </h2>
            <span
              className={`badge rounded-full text-xs font-semibold px-4 py-1 ${
                statusIsOk
                  ? 'bg-green-50 text-green-600 border border-green-200'
                  : statusIsError
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-black/5 text-[#6F6F6F]'
              }`}
            >
              {status}
            </span>
          </div>

          {/* Custom light terminal pre block */}
          <pre className="flex-1 min-h-[350px] p-5 font-mono text-sm leading-relaxed text-[#111111] bg-[#F7F7F7] border border-black/5 rounded-2xl overflow-auto select-text whitespace-pre-wrap word-break-all">
            {terminalOut || 'Valley terminal is quiet. Click Run.'}
          </pre>
        </div>
      </div>

      {/* Language hints panel */}
      <section 
        className="p-8 animate-fade-rise-delay"
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.02)',
        }}
      >
        <h3 className="text-2xl font-display font-normal text-black mb-4">
          Language Hints
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm text-[#333333] leading-relaxed list-disc list-inside">
          <li>
            <code className="text-xs font-mono bg-black/5 text-black px-1.5 py-0.5 rounded mr-1">shuru {"{ }"}</code> 
            entry block · top-level <code className="text-xs font-mono bg-black/5 text-black px-1 py-0.5 rounded">kaam</code> / <code className="text-xs font-mono bg-black/5 text-black px-1 py-0.5 rounded">dhancha</code> allowed
          </li>
          <li>
            <code className="text-xs font-mono bg-black/5 text-black px-1.5 py-0.5 rounded mr-1">agar</code> … 
            <code className="text-xs font-mono bg-black/5 text-black px-1.5 py-0.5 rounded mx-1">{"{ }"} magar {"{ }"}</code> (legacy <code className="text-xs font-mono bg-black/5 text-black px-1.5 py-0.5 rounded">warna</code> = magar)
          </li>
          <li>
            <code className="text-xs font-mono bg-black/5 text-black px-1.5 py-0.5 rounded mr-1">bol</code> expr — print line · 
            <code className="text-xs font-mono bg-black/5 text-black px-1.5 py-0.5 rounded ml-1">sun</code> id — read line
          </li>
          <li>
            <code className="text-xs font-mono bg-black/5 text-black px-1.5 py-0.5 rounded mr-1">le ank|naap|akshar|Type [= expr]</code> variable declaration
          </li>
          <li>
            <code className="text-xs font-mono bg-black/5 text-black px-1.5 py-0.5 rounded mr-1">jabtak</code> / 
            <code className="text-xs font-mono bg-black/5 text-black px-1.5 py-0.5 rounded mx-1">phir</code> loops · 
            <code className="text-xs font-mono bg-black/5 text-black px-1.5 py-0.5 rounded ml-1">bas</code> / 
            <code className="text-xs font-mono bg-black/5 text-black px-1.5 py-0.5 rounded ml-1">chalo</code>
          </li>
          <li>
            <code className="text-xs font-mono bg-black/5 text-black px-1.5 py-0.5 rounded mr-1">kaam</code> [
            <code className="text-xs font-mono bg-black/5 text-black px-1 py-0.5 rounded">khali</code>] name(params) 
            <code className="text-xs font-mono bg-black/5 text-black px-1.5 py-0.5 rounded mx-1">{"{ }"}</code> · 
            <code className="text-xs font-mono bg-black/5 text-black px-1.5 py-0.5 rounded">paucha</code> value · 
            <code className="text-xs font-mono bg-black/5 text-black px-1.5 py-0.5 rounded">roko</code>
          </li>
          <li>
            Booleans <code className="text-xs font-mono bg-black/5 text-black px-1.5 py-0.5 rounded">sahi</code>/
            <code className="text-xs font-mono bg-black/5 text-black px-1.5 py-0.5 rounded">galat</code> (aliases 
            <code className="text-xs font-mono bg-black/5 text-black px-1.5 py-0.5 rounded">sach</code>/
            <code className="text-xs font-mono bg-black/5 text-black px-1.5 py-0.5 rounded">jhooth</code>) · 
            <code className="text-xs font-mono bg-black/5 text-black px-1.5 py-0.5 rounded">aur</code> 
            <code className="text-xs font-mono bg-black/5 text-black px-1.5 py-0.5 rounded">ya</code> 
            <code className="text-xs font-mono bg-black/5 text-black px-1.5 py-0.5 rounded">nahi</code>
          </li>
          <li>
            Use <code className="text-xs font-mono bg-black/5 text-black px-1.5 py-0.5 rounded">;</code> between statements when a closing bracket <code className="text-xs font-mono bg-black/5 text-black px-1.5 py-0.5 rounded">{"}"}</code> is followed by code.
          </li>
        </ul>
      </section>
    </div>
  );
}
