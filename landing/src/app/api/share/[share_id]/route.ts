import { NextResponse } from 'next/server';

declare global {
  var __pahadi_shares: Map<string, string> | undefined;
}

const shares = globalThis.__pahadi_shares || new Map<string, string>();
globalThis.__pahadi_shares = shares;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ share_id: string }> }
) {
  try {
    const { share_id } = await params;
    const code = shares.get(share_id);

    if (!code) {
      return NextResponse.json({ ok: false, error: 'Shared snippet not found' }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      code,
    });
  } catch (err) {
    console.error('Share Get API Error:', err);
    return NextResponse.json({ ok: false, error: 'Server error retrieving share' }, { status: 500 });
  }
}
