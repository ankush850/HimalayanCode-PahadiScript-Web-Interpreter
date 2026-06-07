"use client";

import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';

const LoginPage = dynamic(() => import('../../views/LoginPage'), { ssr: false });

export default function Page() {
  return (
    <Layout>
      <LoginPage />
    </Layout>
  );
}
