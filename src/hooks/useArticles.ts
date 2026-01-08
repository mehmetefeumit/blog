import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';

/**
 * Fetches long-form articles (kind 30023 events) from a specific author's pubkey
 */
export function useArticles(authorPubkey: string) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['articles', authorPubkey],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(3000)]);
      
      const events = await nostr.query(
        [
          {
            kinds: [30023],
            authors: [authorPubkey],
            limit: 50,
          },
        ],
        { signal }
      );

      // Sort by created_at (newest first)
      return events.sort((a, b) => b.created_at - a.created_at);
    },
    enabled: !!authorPubkey,
  });
}
