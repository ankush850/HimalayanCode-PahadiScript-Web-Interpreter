import type { Metadata } from 'next';
import Layout from '../../../components/Layout';
import SharePageWrapper from './SharePageWrapper';

export const metadata: Metadata = {
  title: 'Shared PahadiScript Code',
  description: 'View and run this shared HimalayanCode / PahadiScript program in the interactive web interpreter.',
  robots: {
    index: false,
    follow: true,
  },
};

export async function generateStaticParams() {
  return [{ share_id: '1' }];
}

export default function Page() {
  return (
    <Layout>
      <SharePageWrapper />
    </Layout>
  );
}
