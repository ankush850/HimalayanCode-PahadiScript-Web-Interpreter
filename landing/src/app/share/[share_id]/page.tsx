import Layout from '../../../components/Layout';
import SharePageWrapper from './SharePageWrapper';

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
