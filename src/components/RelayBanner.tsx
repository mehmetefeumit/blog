import { useState, useEffect } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import { Wifi } from 'lucide-react';

interface RelayStatus {
  url: string;
  latency: number | null;
  status: 'connected' | 'connecting' | 'error';
}

export function RelayBanner() {
  const { config } = useAppContext();
  const [relayStatuses, setRelayStatuses] = useState<RelayStatus[]>([]);

  // Initialize relay statuses
  useEffect(() => {
    const initialStatuses = config.relayMetadata.relays.map(relay => ({
      url: relay.url,
      latency: null,
      status: 'connecting' as const,
    }));
    setRelayStatuses(initialStatuses);
  }, [config.relayMetadata.relays]);

  // Measure relay latency every 5 seconds
  useEffect(() => {
    const measureLatency = async () => {
      const newStatuses = await Promise.all(
        config.relayMetadata.relays.map(async (relay) => {
          try {
            const startTime = performance.now();
            const ws = new WebSocket(relay.url);

            await new Promise<void>((resolve, reject) => {
              const timeout = setTimeout(() => {
                ws.close();
                reject(new Error('Timeout'));
              }, 3000);

              ws.onopen = () => {
                clearTimeout(timeout);
                ws.close();
                resolve();
              };

              ws.onerror = () => {
                clearTimeout(timeout);
                reject(new Error('Connection failed'));
              };
            });

            const latency = Math.round(performance.now() - startTime);
            return {
              url: relay.url,
              latency,
              status: 'connected' as const,
            };
          } catch (error) {
            return {
              url: relay.url,
              latency: null,
              status: 'error' as const,
            };
          }
        })
      );
      setRelayStatuses(newStatuses);
    };

    measureLatency();
    const interval = setInterval(measureLatency, 5000);

    return () => clearInterval(interval);
  }, [config.relayMetadata.relays]);

  return (
    <div className="border-b border-border/40 bg-muted/30 backdrop-blur-sm">
      <div className="container max-w-6xl mx-auto px-4 py-2">
        <div className="flex items-center justify-center gap-3 text-xs">
          <Wifi className="h-3 w-3 text-muted-foreground" />
          <div className="flex items-center gap-2">
            {relayStatuses.map((relay, index) => (
              <div key={relay.url} className="flex items-center gap-1.5">
                <code className="text-muted-foreground">
                  {relay.url.replace('wss://', '').replace(/\/$/, '')}
                </code>
                <span className={`font-mono ${
                  relay.status === 'connected' ? 'text-primary' : 'text-destructive'
                }`}>
                  {relay.latency !== null ? `${relay.latency}ms` :
                   relay.status === 'connecting' ? '...' : 'x'}
                </span>
                {index < relayStatuses.length - 1 && (
                  <span className="text-muted-foreground/30 mx-2">|</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
