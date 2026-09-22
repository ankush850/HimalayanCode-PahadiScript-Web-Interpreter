"use client";

import dynamic from 'next/dynamic';

const HistoryPage = dynamic(() => import('../../views/HistoryPage'), { ssr: false });

export default function HistoryClient() {
  return <HistoryPage />;
}
