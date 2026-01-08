import { Key } from 'lucide-react';

interface NpubBadgeProps {
  npub: string;
}

export function NpubBadge({ npub }: NpubBadgeProps) {
  return (
    <a
      href={`https://njump.me/${npub}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 text-primary hover:underline text-sm group"
      title="View on njump.me"
    >
      <Key className="h-3 w-3 shrink-0" />
      <span className="font-mono">{npub}</span>
    </a>
  );
}
