import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import { getSessionUser } from '../../../lib/session';
import { db } from '../../../lib/db';

function runPythonCompiler(code: string, stdinText: string | null): Promise<{ ok: boolean; output: string; error: string | null }> {
  return new Promise((resolve) => {
    const processPath = path.join(process.cwd(), '../run_compiler.py');
    const child = spawn('python', [processPath]);

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

    const t0 = performance.now();
    const result = await runPythonCompiler(code, stdinText || null);
    const elapsedMs = performance.now() - t0;

    const userId = await getSessionUser();
    if (userId) {
      await db.addExecution(
        userId,
        code,
        result.ok,
        elapsedMs,
        result.ok ? result.output : (result.output || null),
        result.ok ? null : result.error
      );
    }

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
