import type { Metadata } from 'next';
import Layout from '../../components/Layout';
import EditorClient from './EditorClient';

export const metadata: Metadata = {
  title: 'Online Code Editor - Write & Run PahadiScript',
  description:
    'Write, compile, and execute HimalayanCode (PahadiScript) online. Real-time syntax highlighting, Hindi keyword suggestions, and instant execution results.',
  alternates: {
    canonical: '/editor',
  },
  openGraph: {
    title: 'PahadiScript Online Code Editor | HimalayanCode',
    description:
      'Write, compile, and execute code in Hindi in real-time with HimalayanCode Web Interpreter.',
  },
};

export default function Page() {
  return (
    <Layout>
      <EditorClient />
    </Layout>
  );
}
