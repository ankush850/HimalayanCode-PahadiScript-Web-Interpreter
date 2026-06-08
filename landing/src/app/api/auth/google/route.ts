import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { db } from '../../../../lib/db';
import { createSession } from '../../../../lib/session';

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const oauthClient = new OAuth2Client(CLIENT_ID);

export async function POST(request: Request) {
  try {
    if (!CLIENT_ID) {
      console.error('Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID in server environment.');
      return NextResponse.json(
        { ok: false, error: 'Google authentication is not configured on this server.' },
        { status: 500 }
      );
    }

    const { token } = await request.json();
    if (!token) {
      return NextResponse.json(
        { ok: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    // Verify Google ID Token
    let payload;
    try {
      const ticket = await oauthClient.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (verifyErr) {
      console.error('Google ID token verification failed:', verifyErr);
      return NextResponse.json(
        { ok: false, error: 'Invalid Google sign-in credential' },
        { status: 401 }
      );
    }

    if (!payload || !payload.sub || !payload.email) {
      return NextResponse.json(
        { ok: false, error: 'Invalid token payload received from Google' },
        { status: 400 }
      );
    }

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name || payload.given_name || email.split('@')[0];

    // Find existing user by Google ID or Email
    let user = await db.getUserByGoogleId(googleId);

    if (!user) {
      user = await db.getUserByEmail(email);
    }

    // Let's create the user if not found
    if (!user) {
      // Generate a unique username based on their Google name
      let baseUsername = name.replace(/[^a-zA-Z0-9_]/g, '');
      if (!baseUsername) {
        baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '') || 'user';
      }
      
      let username = baseUsername;
      let counter = 1;
      while (await db.getUserByUsername(username)) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      user = await db.addGoogleUser(username, email, googleId);
    }

    // Set the session cookie
    await createSession(user.id);

    return NextResponse.json({
      ok: true,
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    console.error('Google Auth API error:', err);
    return NextResponse.json(
      { ok: false, error: 'Server error during Google authentication' },
      { status: 500 }
    );
  }
}
