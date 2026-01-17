import { nip19 } from 'nostr-tools';
import { useParams } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ArticleViewer } from '@/components/ArticleViewer';
import NotFound from './NotFound';

export function NIP19Page() {
  const { nip19: identifier } = useParams<{ nip19: string }>();

  if (!identifier) {
    return <NotFound />;
  }

  let decoded;
  try {
    decoded = nip19.decode(identifier);
  } catch {
    return <NotFound />;
  }

  const { type, data } = decoded;

  switch (type) {
    case 'npub':
    case 'nprofile':
      // Profile view not implemented
      return <NotFound />;

    case 'note':
      // Note view not implemented (only NIP-23 supported)
      return <NotFound />;

    case 'nevent':
      // Event view not implemented
      return <NotFound />;

    case 'naddr':
      // Display NIP-23 article
      if (typeof data === 'object' && 'kind' in data && 'pubkey' in data && 'identifier' in data) {
        return (
          <Layout>
            <ArticleViewer
              kind={data.kind}
              pubkey={data.pubkey}
              identifier={data.identifier}
            />
          </Layout>
        );
      }
      return <NotFound />;

    default:
      return <NotFound />;
  }
}