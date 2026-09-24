/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { COMPILER_FILES } from './compilerAssets';

declare global {
  interface Window {
    loadPyodide?: (config: { indexURL: string }) => Promise<any>;
    __pyodideInstance?: any;
    __pyodideLoading?: Promise<any>;
  }
}

async function loadPyodideScript(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (window.loadPyodide) return;

  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src*="pyodide.js"]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', (e) => reject(e));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error('Failed to load in-browser Python engine from CDN.'));
    document.head.appendChild(script);
  });
}

async function getPyodideInstance(onProgress?: (status: string) => void): Promise<any> {
  if (typeof window === 'undefined') {
    throw new Error('Browser runner can only run in client browser');
  }

  if (window.__pyodideInstance) {
    return window.__pyodideInstance;
  }

  if (window.__pyodideLoading) {
    return window.__pyodideLoading;
  }

  window.__pyodideLoading = (async () => {
    onProgress?.('Loading engine…');
    await loadPyodideScript();

    if (!window.loadPyodide) {
      throw new Error('Pyodide engine could not be initialized');
    }

    onProgress?.('Initializing Python…');
    const pyodide = await window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
    });

    onProgress?.('Setting up parser…');
    await pyodide.loadPackage('micropip');
    const micropip = pyodide.pyimport('micropip');
    await micropip.install('ply');

    onProgress?.('Loading PahadiScript…');
    try {
      pyodide.FS.mkdirTree('/home/pyodide/app/compiler');
    } catch {
      // Directory may already exist
    }

    for (const [filename, content] of Object.entries(COMPILER_FILES)) {
      pyodide.FS.writeFile(`/home/pyodide/app/compiler/${filename}`, content);
    }

    await pyodide.runPythonAsync(`
import sys
import json

if '/home/pyodide' not in sys.path:
    sys.path.insert(0, '/home/pyodide')

from app.compiler.interpreter import execute

def __run_pahadi__(source_code):
    try:
        ok, out, err = execute(source_code, stdin_text=None)
        return json.dumps({"ok": ok, "output": out, "error": err})
    except Exception as e:
        return json.dumps({"ok": False, "output": "", "error": str(e)})
`);

    window.__pyodideInstance = pyodide;
    return pyodide;
  })();

  return window.__pyodideLoading;
}

export async function runPahadiInBrowser(
  code: string,
  onProgress?: (status: string) => void
): Promise<{ ok: boolean; output: string; error: string | null; execution_time_ms: number }> {
  const t0 = performance.now();
  const pyodide = await getPyodideInstance(onProgress);

  onProgress?.('Running…');
  const runner = pyodide.globals.get('__run_pahadi__');
  let resultJson: any;
  try {
    resultJson = runner(code);
  } finally {
    runner?.destroy?.();
  }

  const elapsed = Math.round((performance.now() - t0) * 100) / 100;
  let parsed: any;
  try {
    parsed = typeof resultJson === 'string' ? JSON.parse(resultJson) : resultJson;
  } catch (parseErr) {
    parsed = {
      ok: false,
      output: '',
      error: `Compiler output error: ${String(parseErr)}. Raw: ${String(resultJson)}`,
    };
  }

  return {
    ok: Boolean(parsed?.ok),
    output: parsed?.output || '',
    error: parsed?.error || null,
    execution_time_ms: elapsed,
  };
}
