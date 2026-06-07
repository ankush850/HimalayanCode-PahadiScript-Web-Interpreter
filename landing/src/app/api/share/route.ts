import { NextResponse } from 'next/server';
import { getSessionUser } from '../../../lib/session';
import { db } from '../../../lib/db';

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

    const userId = await getSessionUser();
    const share = db.addShare(code, userId);

    return NextResponse.json({
      ok: true,
      share_id: share.id,
      url: `/share/${share.id}`,
    });
  } catch (err) {
    console.error('Share Post API Error:', err);
    return NextResponse.json({ ok: false, error: 'Server error generating share' }, { status: 500 });
  }
}
