import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ share_id: string }> }
) {
  try {
    const { share_id } = await params;
    const share = db.getShare(share_id);

    if (!share) {
      return NextResponse.json({ ok: false, error: 'Shared snippet not found' }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      code: share.code,
    });
  } catch (err) {
    console.error('Share Get API Error:', err);
    return NextResponse.json({ ok: false, error: 'Server error retrieving share' }, { status: 500 });
  }
}
