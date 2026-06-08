import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { db } from '../../../../../lib/db';
import { createSession } from '../../../../../lib/session';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request: Request) {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json(
        { ok: false, error: 'Supabase configuration is incomplete on this server.' },
        { status: 500 }
      );
    }

    const { email, code } = await request.json();
    if (!email || !code || typeof email !== 'string' || typeof code !== 'string') {
      return NextResponse.json(
        { ok: false, error: 'Both email and verification code are required.' },
        { status: 400 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: 'email',
    });

    if (error) {
      console.error('Supabase verifyOtp error:', error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 400 }
      );
    }

    const authEmail = data.user?.email || email;

    // Check if user exists in public.users
    let user = await db.getUserByEmail(authEmail);

    if (!user) {
      // Generate unique username based on the prefix of their email
      const baseUsername = authEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '') || 'user';
      let username = baseUsername;
      let counter = 1;
      while (await db.getUserByUsername(username)) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      // We associate OTP users by creating a record with their email and a unique string for the external google_id column
      const uniqueId = `otp-${Math.random().toString(36).substring(2, 11)}`;
      user = await db.addGoogleUser(username, authEmail, uniqueId);
    }

    // Set the cookie session
    await createSession(user.id);

    return NextResponse.json({
      ok: true,
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    console.error('OTP Verification API error:', err);
    return NextResponse.json(
      { ok: false, error: 'Server error during verification' },
      { status: 500 }
    );
  }
}
