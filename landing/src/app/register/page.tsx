"use client";

import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';

const RegisterPage = dynamic(() => import('../../views/RegisterPage'), { ssr: false });

export default function Page() {
  return (
    <Layout>
      <RegisterPage />
    </Layout>
  );
}
