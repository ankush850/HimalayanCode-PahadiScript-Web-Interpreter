import crypto from 'crypto';
import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'pahadi_session';
const SECRET_KEY = process.env.PAHADI_SECRET_KEY || 'dev-pahadi-secret-change-in-production';
const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function signToken(userId: number, expiration: number): string {
  const data = `${userId}.${expiration}`;
  const hmac = crypto.createHmac('sha256', SECRET_KEY);
  hmac.update(data);
  const signature = hmac.digest('base64url');
  return `${data}.${signature}`;
}

function verifyToken(token: string): number | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [userIdStr, expirationStr, signature] = parts;
  const userId = parseInt(userIdStr, 10);
  const expiration = parseInt(expirationStr, 10);

  if (isNaN(userId) || isNaN(expiration)) return null;
  if (Date.now() > expiration) return null; // Expired

  const data = `${userIdStr}.${expirationStr}`;
  const hmac = crypto.createHmac('sha256', SECRET_KEY);
  hmac.update(data);
  const expectedSignature = hmac.digest('base64url');

  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return userId;
  }
  return null;
}

export async function createSession(userId: number) {
  const expiration = Date.now() + SESSION_EXPIRY_MS;
  const token = signToken(userId, expiration);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiration,
    path: '/',
  });
}

export async function getSessionUser(): Promise<number | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/',
  });
}
