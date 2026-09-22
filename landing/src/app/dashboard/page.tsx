import type { Metadata } from 'next';
import Layout from '../../components/Layout';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'Compiler Dashboard & Analytics',
  description:
    'Monitor code executions, compile success rates, execution speeds, and error diagnostics for your PahadiScript programs.',
  alternates: {
    canonical: '/dashboard',
  },
};

export default function Page() {
  return (
    <Layout>
      <DashboardClient />
    </Layout>
  );
}
