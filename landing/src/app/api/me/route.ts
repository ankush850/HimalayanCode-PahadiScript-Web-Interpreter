import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../lib/session';
import { db } from '../../../lib/db';

export async function GET() {
  const userId = await getSessionUser();
  if (!userId) {
    return NextResponse.json({ ok: true, authenticated: false });
  }

  const user = db.getUserById(userId);
  if (!user) {
    return NextResponse.json({ ok: true, authenticated: false });
  }

  return NextResponse.json({
    ok: true,
    authenticated: true,
    user: { id: user.id, username: user.username },
  });
}
