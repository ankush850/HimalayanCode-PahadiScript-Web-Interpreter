import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../lib/session';
import { db } from '../../../lib/db';

export async function GET() {
  const userId = await getSessionUser();
  if (!userId) {
    return NextResponse.json({ ok: false, error: 'Authentication required' }, { status: 401 });
  }

  const executions = db.getExecutions(userId);
  const total = executions.length;
  const successes = executions.filter((e) => e.success).length;
  const failures = total - successes;

  const successRuns = executions.filter((e) => e.success);
  const avgMs = successRuns.length > 0 ? successRuns.reduce((acc, curr) => acc + curr.execution_time_ms, 0) / successRuns.length : 0.0;

  // Process timeline (last 100 runs sorted chronological oldest to newest)
  // Sort ascending by created_at
  const chronological = [...executions]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .slice(-100);

  interface TimelineEntry {
    date: string;
    success: number;
    failure: number;
    total_execution_ms: number;
    avg_execution_ms: number;
    _total_ms: number;
    _count: number;
  }

  const dailyOut: TimelineEntry[] = [];

  for (const r of chronological) {
    const d = new Date(r.created_at);
    // Format to HH:MM in local timezone (or UTC matching python backend logic)
    // Python strftime("%H:%M") was used. We can output as HH:MM
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const timeKey = `${hours}:${minutes}`;

    let entry = dailyOut[dailyOut.length - 1];
    if (!entry || entry.date !== timeKey) {
      entry = {
        date: timeKey,
        success: 0,
        failure: 0,
        total_execution_ms: 0.0,
        avg_execution_ms: 0.0,
        _total_ms: 0.0,
        _count: 0,
      };
      dailyOut.push(entry);
    }

    if (r.success) {
      entry.success += 1;
      entry._total_ms += r.execution_time_ms;
      entry._count += 1;
    } else {
      entry.failure += 1;
    }
    entry.total_execution_ms += r.execution_time_ms;
  }

  // Calculate averages and format
  for (const entry of dailyOut) {
    entry.avg_execution_ms = entry._count > 0 ? Math.round((entry._total_ms / entry._count) * 100) / 100 : 0.0;
    entry.total_execution_ms = Math.round(entry.total_execution_ms * 100) / 100;
    // Remove temp fields
    delete (entry as unknown as Record<string, unknown>)._total_ms;
    delete (entry as unknown as Record<string, unknown>)._count;
  }

  // Limit to last 20 blocks
  const daily = dailyOut.slice(-20);

  return NextResponse.json({
    ok: true,
    summary: {
      total_runs: total,
      successes,
      failures,
      success_rate: total > 0 ? successes / total : 0.0,
      avg_execution_ms: Math.round(avgMs * 1000) / 1000,
    },
    daily,
  });
}
