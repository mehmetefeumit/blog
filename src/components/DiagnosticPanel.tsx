import { useState, useEffect } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Wifi } from 'lucide-react';
import { AUTHOR_PUBKEY } from '@/lib/constants';
import { nip19 } from 'nostr-tools';

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
    <Card className="border-border/40 bg-card/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-mono flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Diagnostics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-xs">
        {/* Public Key */}
        <div>
          <div className="text-muted-foreground mb-1 font-semibold">Public Key:</div>
          <code className="text-primary break-all text-[10px]">{AUTHOR_NPUB}</code>
        </div>

        {/* Relay Status */}
        <div>
          <div className="text-muted-foreground mb-2 font-semibold flex items-center gap-1">
            <Wifi className="h-3 w-3" />
            Relays:
          </div>
          <div className="space-y-2">
            {relayStatuses.map((relay) => (
              <div key={relay.url} className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <code className="text-[10px] text-muted-foreground truncate flex-1">
                    {relay.url.replace('wss://', '')}
                  </code>
                  <Badge 
                    variant={relay.status === 'connected' ? 'default' : 'destructive'}
                    className="h-5 text-[10px] font-mono"
                  >
                    {relay.latency !== null ? `${relay.latency}ms` : 
                     relay.status === 'connecting' ? 'connecting...' : 'error'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Logs */}
        <div>
          <div className="text-muted-foreground mb-2 font-semibold">Activity:</div>
          <div className="space-y-1.5">
            {logs.length === 0 ? (
              <div className="text-muted-foreground/50 text-[10px] italic">
                No activity yet...
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="space-y-0.5">
                  <div className="flex items-start gap-2">
                    <span className="text-muted-foreground/70 text-[10px] font-mono shrink-0">
                      {formatTime(log.timestamp)}
                    </span>
                    <span className={`text-[10px] leading-tight ${
                      log.type === 'error' ? 'text-destructive' : 
                      log.type === 'success' ? 'text-primary' : 
                      'text-foreground'
                    }`}>
                      {log.message}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to emit diagnostic events
export function emitDiagnostic(message: string, type: 'info' | 'success' | 'error' = 'info') {
  const event = new CustomEvent('nostr-diagnostic', {
    detail: { message, type }
  });
  window.dispatchEvent(event);
}
