import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '../../../lib/db';
import { createSession } from '../../../lib/session';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const username = (data.username || '').trim();
    const password = data.password || '';

    if (!username || username.length < 2) {
      return NextResponse.json({ ok: false, error: 'Username must be at least 2 characters' }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ ok: false, error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const existingUser = await db.getUserByUsername(username);
    if (existingUser) {
      return NextResponse.json({ ok: false, error: 'Username already taken' }, { status: 409 });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const user = await db.addUser(username, passwordHash);

    await createSession(user.id);

    return NextResponse.json({
      ok: true,
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    console.error('Registration API Error:', err);
    return NextResponse.json({ ok: false, error: 'Server error during registration' }, { status: 500 });
  }
}
