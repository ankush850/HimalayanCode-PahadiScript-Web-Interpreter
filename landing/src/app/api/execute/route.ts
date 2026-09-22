import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

function getCompilerPath(): string {
  const candidates = [
    path.join(process.cwd(), 'run_compiler.py'),
    path.join(process.cwd(), '../run_compiler.py'),
    path.resolve(process.cwd(), '..', 'run_compiler.py'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return path.join(process.cwd(), '../run_compiler.py');
}

function runPythonCompiler(
  code: string,
  stdinText: string | null
): Promise<{ ok: boolean; output: string; error: string | null }> {
  return new Promise((resolve) => {
    const processPath = getCompilerPath();
    const pythonBin = process.env.PYTHON_BIN || (process.platform === 'win32' ? 'python' : 'python3');
    const child = spawn(pythonBin, [processPath]);

    let stdoutData = '';
    let stderrData = '';

    child.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    child.on('close', (code) => {
      if (code !== 0) {
        resolve({
          ok: false,
          output: '',
          error: stderrData.trim() || `Compiler process exited with code ${code}`,
        });
        return;
      }
      try {
        const result = JSON.parse(stdoutData.trim());
        resolve({
          ok: result.ok,
          output: result.output,
          error: result.error,
        });
      } catch {
        resolve({
          ok: false,
          output: '',
          error: `Failed to parse compiler output: ${stdoutData.trim()}`,
        });
      }
    });

    child.on('error', (err) => {
      resolve({
        ok: false,
        output: '',
        error: `Failed to start compiler subprocess: ${err.message}`,
      });
    });

    child.stdin.write(JSON.stringify({ code, stdin: stdinText }));
    child.stdin.end();
  });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const code = data.code;
    const stdinText = data.stdin;

    if (code === undefined || typeof code !== 'string') {
      return NextResponse.json({ ok: false, error: "Missing or invalid 'code' field" }, { status: 400 });
    }
    if (code.length > 50000) {
      return NextResponse.json({ ok: false, error: 'Code exceeds maximum length' }, { status: 400 });
    }
    if (stdinText !== undefined && stdinText !== null && typeof stdinText !== 'string') {
      return NextResponse.json({ ok: false, error: "Field 'stdin' must be a string" }, { status: 400 });
    }

    // Support remote compiler backend (e.g., when Next.js is deployed on Vercel)
    const remoteCompilerUrl = process.env.COMPILER_API_URL || process.env.NEXT_PUBLIC_COMPILER_API_URL;
    if (remoteCompilerUrl) {
      try {
        const remoteRes = await fetch(remoteCompilerUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, stdin: stdinText || null }),
        });
        const remoteData = await remoteRes.json();
        return NextResponse.json(remoteData);
      } catch (remoteErr) {
        console.error('Remote compiler error:', remoteErr);
        return NextResponse.json(
          { ok: false, output: '', error: `Remote compiler connection failed: ${remoteErr}` },
          { status: 502 }
        );
      }
    }

    const t0 = performance.now();
    const result = await runPythonCompiler(code, stdinText || null);
    const elapsedMs = performance.now() - t0;

    return NextResponse.json({
      ok: result.ok,
      output: result.output,
      error: result.error,
      execution_time_ms: Math.round(elapsedMs * 1000) / 1000,
    });
  } catch (err) {
    console.error('Compiler API Error:', err);
    return NextResponse.json({ ok: false, error: 'Server error running compiler' }, { status: 500 });
  }
}
