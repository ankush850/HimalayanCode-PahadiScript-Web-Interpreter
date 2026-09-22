import { NextResponse } from 'next/server';

declare global {
  var __pahadi_shares: Map<string, string> | undefined;
}

const shares = globalThis.__pahadi_shares || new Map<string, string>();
globalThis.__pahadi_shares = shares;

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const code = data.code;

    if (code === undefined || typeof code !== 'string') {
      return NextResponse.json({ ok: false, error: "Missing or invalid 'code' field" }, { status: 400 });
    }
    if (code.length > 50000) {
      return NextResponse.json({ ok: false, error: 'Code exceeds maximum length' }, { status: 400 });
    }

    // Generate random 8-character share ID
    const shareId = Math.random().toString(36).substring(2, 10);
    shares.set(shareId, code);

    return NextResponse.json({
      ok: true,
      share_id: shareId,
      url: `/share/${shareId}`,
    });
  } catch (err) {
    console.error('Share Post API Error:', err);
    return NextResponse.json({ ok: false, error: 'Server error generating share' }, { status: 500 });
  }
}
