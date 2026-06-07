"use client";

import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';

const DashboardPage = dynamic(() => import('../../views/DashboardPage'), { ssr: false });

export default function Page() {
  return (
    <Layout>
      <DashboardPage />
    </Layout>
  );
}
