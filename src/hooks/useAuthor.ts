import { type NostrEvent, type NostrMetadata, NSchema as n } from '@nostrify/nostrify';
import { useNostr } from '@nostrify/react';
import { useQuery } from '@tanstack/react-query';
import { emitDiagnostic } from '@/components/DiagnosticPanel';

export function useAuthor(pubkey: string | undefined) {
  const { nostr } = useNostr();

  return useQuery<{ event?: NostrEvent; metadata?: NostrMetadata }>({
    queryKey: ['author', pubkey ?? ''],
    queryFn: async ({ signal }) => {
      if (!pubkey) {
        return {};
      }

      emitDiagnostic('Fetching author profile (kind 0)...', 'info');

      const [event] = await nostr.query(
        [{ kinds: [0], authors: [pubkey!], limit: 1 }],
        { signal: AbortSignal.any([signal, AbortSignal.timeout(1500)]) },
      );

      if (!event) {
        emitDiagnostic('Author profile not found', 'error');
        throw new Error('No event found');
      }

      try {
        const metadata = n.json().pipe(n.metadata()).parse(event.content);
        emitDiagnostic(`Profile loaded: ${metadata.name || metadata.display_name || 'Unknown'}`, 'success');
        return { metadata, event };
      } catch {
        emitDiagnostic('Profile loaded (metadata parse failed)', 'success');
        return { event };
      }
    },
    staleTime: 5 * 60 * 1000, // Keep cached data fresh for 5 minutes
    retry: 3,
  });
}
