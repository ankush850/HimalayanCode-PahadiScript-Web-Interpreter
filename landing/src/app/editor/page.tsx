"use client";

import dynamic from 'next/dynamic';
import Layout from '../../components/Layout';

const EditorPage = dynamic(() => import('../../views/EditorPage'), { ssr: false });

export default function Page() {
  return (
    <Layout>
      <EditorPage />
    </Layout>
  );
}
