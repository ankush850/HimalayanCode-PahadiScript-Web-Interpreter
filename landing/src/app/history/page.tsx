import type { Metadata } from 'next';
import Layout from '../../components/Layout';
import HistoryClient from './HistoryClient';

export const metadata: Metadata = {
  title: 'Execution History',
  description:
    'Review your past PahadiScript program executions, code snippets, timestamps, outputs, and runtime logs.',
  alternates: {
    canonical: '/history',
  },
};

export default function Page() {
  return (
    <Layout>
      <HistoryClient />
    </Layout>
  );
}
