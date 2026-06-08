import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../lib/session';
import { db } from '../../../lib/db';

export async function GET() {
  const userId = await getSessionUser();
  if (!userId) {
    return NextResponse.json({ ok: false, error: 'Authentication required' }, { status: 401 });
  }

  const executions = await db.getExecutions(userId);
  // Sort descending by created_at
  executions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Limit to 200 items
  const items = executions.slice(0, 200).map((r) => ({
    id: r.id,
    code: r.code,
    success: r.success,
    execution_time_ms: r.execution_time_ms,
    output: r.output,
    error: r.error_message,
    created_at: r.created_at,
  }));

  return NextResponse.json({
    ok: true,
    items,
  });
}
