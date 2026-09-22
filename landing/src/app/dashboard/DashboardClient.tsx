"use client";

import dynamic from 'next/dynamic';

const DashboardPage = dynamic(() => import('../../views/DashboardPage'), { ssr: false });

export default function DashboardClient() {
  return <DashboardPage />;
}
