import { useState, useEffect } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import { Wifi } from 'lucide-react';

interface DiagnosticLog {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'error';
}

interface RelayStatus {
  url: string;
  latency: number | null;
  status: 'connected' | 'connecting' | 'error';
}

const AUTHOR_NPUB = 'npub17pdf8saz8fflz3dqyst8rhfzav4s922yv0truw85nr02jxyxqr3shkl0gr';

export function DiagnosticPanel() {
  const { config } = useAppContext();
  const [logs, setLogs] = useState<DiagnosticLog[]>([]);
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

  // Add diagnostic log
  const addLog = (message: string, type: DiagnosticLog['type'] = 'info') => {
    const newLog: DiagnosticLog = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      message,
      type,
    };

    setLogs(prev => [newLog, ...prev].slice(0, 4)); // Keep only 4 most recent
  };

  // Listen to global diagnostic events
  useEffect(() => {
    const handleDiagnostic = (event: CustomEvent) => {
      addLog(event.detail.message, event.detail.type || 'info');
    };

    window.addEventListener('nostr-diagnostic' as any, handleDiagnostic);

    // Add initial log
    addLog('Diagnostic panel initialized', 'success');

    return () => {
      window.removeEventListener('nostr-diagnostic' as any, handleDiagnostic);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="text-xs space-y-2">
      {/* Public Key */}
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-[10px] shrink-0">npub:</span>
        <code className="text-primary text-[9px] truncate">{AUTHOR_NPUB.slice(0, 20)}...</code>
      </div>

      {/* Relay Status - Compact horizontal layout */}
      <div className="space-y-1">
        <div className="text-muted-foreground text-[10px] flex items-center gap-1">
          <Wifi className="h-2.5 w-2.5" />
          Relays:
        </div>
        <div className="space-y-0.5">
          {relayStatuses.map((relay) => (
            <div key={relay.url} className="flex items-center justify-between gap-2">
              <code className="text-[9px] text-muted-foreground truncate flex-1">
                {relay.url.replace('wss://', '').slice(0, 20)}
              </code>
              <span className={`text-[9px] font-mono shrink-0 ${
                relay.status === 'connected' ? 'text-primary' : 'text-destructive'
              }`}>
                {relay.latency !== null ? `${relay.latency}ms` :
                 relay.status === 'connecting' ? '...' : 'err'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Logs - More compact */}
      <div className="space-y-1">
        <div className="text-muted-foreground text-[10px]">Nostr Activity:</div>
        <div className="space-y-0.5">
          {logs.length === 0 ? (
            <div className="text-muted-foreground/50 text-[9px] italic">
              No activity yet...
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-start gap-1.5">
                <span className="text-muted-foreground/70 text-[9px] font-mono shrink-0 w-12">
                  {formatTime(log.timestamp).slice(0, 5)}
                </span>
                <span className={`text-[9px] leading-tight truncate ${
                  log.type === 'error' ? 'text-destructive' :
                  log.type === 'success' ? 'text-primary' :
                  'text-foreground'
                }`}>
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to emit diagnostic events
export function emitDiagnostic(message: string, type: 'info' | 'success' | 'error' = 'info') {
  const event = new CustomEvent('nostr-diagnostic', {
    detail: { message, type }
  });
  window.dispatchEvent(event);
}
