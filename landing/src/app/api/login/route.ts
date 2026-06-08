import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '../../../lib/db';
import { createSession } from '../../../lib/session';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const username = (data.username || '').trim();
    const password = data.password || '';

    const user = await db.getUserByUsername(username);
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return NextResponse.json({ ok: false, error: 'Invalid username or password' }, { status: 401 });
    }

    await createSession(user.id);

    return NextResponse.json({
      ok: true,
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    console.error('Login API Error:', err);
    return NextResponse.json({ ok: false, error: 'Server error during login' }, { status: 500 });
  }
}
