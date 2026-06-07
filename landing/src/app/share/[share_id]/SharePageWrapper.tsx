"use client";

import dynamic from 'next/dynamic';

const SharePageClient = dynamic(() => import('../../../views/SharePage'), { ssr: false });

export default function SharePageWrapper() {
  return <SharePageClient />;
}
