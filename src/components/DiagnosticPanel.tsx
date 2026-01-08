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
    <div className="flex items-start gap-4 text-xs">
      {/* Public Key */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-muted-foreground">npub:</span>
        <code className="text-primary text-[11px]">{AUTHOR_NPUB.slice(0, 16)}...</code>
      </div>

      {/* Relay Status - Horizontal */}
      <div className="flex items-center gap-2 shrink-0">
        <Wifi className="h-3 w-3 text-muted-foreground" />
        {relayStatuses.map((relay, index) => (
          <div key={relay.url} className="flex items-center gap-1">
            <code className="text-[11px] text-muted-foreground">
              {relay.url.replace('wss://', '').split('.')[0]}
            </code>
            <span className={`text-[11px] font-mono ${
              relay.status === 'connected' ? 'text-primary' : 'text-destructive'
            }`}>
              {relay.latency !== null ? `${relay.latency}ms` :
               relay.status === 'connecting' ? '...' : 'x'}
            </span>
            {index < relayStatuses.length - 1 && (
              <span className="text-muted-foreground/30">|</span>
            )}
          </div>
        ))}
      </div>

      {/* Activity Logs - Single line with latest */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="text-muted-foreground shrink-0">Activity:</span>
        {logs.length > 0 && (
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-muted-foreground/70 font-mono shrink-0 text-[11px]">
              {formatTime(logs[0].timestamp).slice(0, 5)}
            </span>
            <span className={`text-[11px] truncate ${
              logs[0].type === 'error' ? 'text-destructive' :
              logs[0].type === 'success' ? 'text-primary' :
              'text-foreground'
            }`}>
              {logs[0].message}
            </span>
          </div>
        )}
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
