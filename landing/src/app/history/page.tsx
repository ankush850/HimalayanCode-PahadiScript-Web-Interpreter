"use client";

import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';

const HistoryPage = dynamic(() => import('../../views/HistoryPage'), { ssr: false });

export default function Page() {
  return (
    <Layout>
      <HistoryPage />
    </Layout>
  );
}
