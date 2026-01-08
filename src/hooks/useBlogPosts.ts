import { useQuery } from '@tanstack/react-query';
import { useNostr } from '@nostrify/react';
import type { NostrEvent } from '@nostrify/nostrify';
import { emitDiagnostic } from '@/components/DiagnosticPanel';

/**
 * Fetches blog posts (kind 1 events) from a specific author's pubkey
 */
export function useBlogPosts(authorPubkey: string) {
  const { nostr } = useNostr();

  return useQuery({
    queryKey: ['blog-posts', authorPubkey],
    queryFn: async (c) => {
      const signal = AbortSignal.any([c.signal, AbortSignal.timeout(3000)]);

      emitDiagnostic('Fetching NIP-01 events (notes)...', 'info');

      const events = await nostr.query(
        [
          {
            kinds: [1],
            authors: [authorPubkey],
            limit: 50,
          },
        ],
        { signal }
      );

      emitDiagnostic(`Loaded ${events.length} NIP-01 event(s)`, 'success');

      // Sort by created_at (newest first)
      return events.sort((a, b) => b.created_at - a.created_at);
    },
    enabled: !!authorPubkey,
  });
}
