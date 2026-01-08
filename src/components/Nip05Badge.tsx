import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface Nip05BadgeProps {
  nip05: string;
  pubkey: string;
}

export function Nip05Badge({ nip05, pubkey }: Nip05BadgeProps) {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyNip05 = async () => {
      try {
        // Split the identifier into local-part and domain
        const [localPart, domain] = nip05.split('@');
        
        if (!localPart || !domain) {
          setIsVerified(false);
          setIsLoading(false);
          return;
        }

        // Fetch the well-known URL
        const url = `https://${domain}/.well-known/nostr.json?name=${localPart}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          setIsVerified(false);
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        
        // Check if the pubkey matches
        const verified = data.names?.[localPart]?.toLowerCase() === pubkey.toLowerCase();
        setIsVerified(verified);
      } catch (error) {
        console.error('NIP-05 verification failed:', error);
        setIsVerified(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyNip05();
  }, [nip05, pubkey]);

  if (isLoading) {
    return (
      <span className="inline-flex items-center gap-1 text-muted-foreground text-sm">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span className="font-mono">{nip05}</span>
      </span>
    );
  }

  if (isVerified) {
    return (
      <a
        href={`https://${nip05.split('@')[1]}/.well-known/nostr.json?name=${nip05.split('@')[0]}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-primary hover:underline text-sm group"
        title="Click to verify NIP-05 address"
      >
        <CheckCircle2 className="h-3 w-3 shrink-0" />
        <span className="font-mono">{nip05}</span>
      </a>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-destructive text-sm" title="NIP-05 verification failed">
      <XCircle className="h-3 w-3 shrink-0" />
      <span className="font-mono">{nip05}</span>
    </span>
  );
}
