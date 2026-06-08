import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request: Request) {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('Missing Supabase configurations on server.');
      return NextResponse.json(
        { ok: false, error: 'Supabase is not fully configured on the server.' },
        { status: 500 }
      );
    }

    const { email } = await request.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { ok: false, error: 'A valid email address is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) {
      console.error('Supabase signInWithOtp error:', error);
      let friendlyMessage = error.message;
      
      // Handle rate limit errors gracefully
      if (error.status === 429 || friendlyMessage.toLowerCase().includes('rate limit')) {
        friendlyMessage = 'Too many verification requests. Please wait a few minutes before trying again.';
      }

      return NextResponse.json(
        { ok: false, error: friendlyMessage },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('OTP Send error:', err);
    return NextResponse.json(
      { ok: false, error: 'Server error sending verification code' },
      { status: 500 }
    );
  }
}
