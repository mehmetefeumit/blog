import { useState, useEffect } from 'react';

interface DiagnosticLog {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'success' | 'error';
}

const AUTHOR_NPUB = 'npub17pdf8saz8fflz3dqyst8rhfzav4s922yv0truw85nr02jxyxqr3shkl0gr';

export function DiagnosticPanel() {
  const [logs, setLogs] = useState<DiagnosticLog[]>([]);

  // Listen to global diagnostic events
  useEffect(() => {
    const handleDiagnostic = (event: CustomEvent) => {
      const newLog: DiagnosticLog = {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
        message: event.detail.message,
        type: event.detail.type || 'info',
      };

      setLogs(prev => [newLog, ...prev].slice(0, 4));
    };

    window.addEventListener('nostr-diagnostic' as any, handleDiagnostic);

    // Add initial log
    const initialLog: DiagnosticLog = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(),
      message: 'Panel ready',
      type: 'success',
    };
    setLogs([initialLog]);

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
    <div className="flex items-start gap-8 text-xs flex-wrap">
      {/* Public Key - Full npub with link */}
      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground text-xs">npub:</span>
        <a
          href={`https://njump.me/${AUTHOR_NPUB}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary text-xs hover:underline font-mono"
        >
          {AUTHOR_NPUB}
        </a>
      </div>

      {/* Activity Logs - Single line with latest */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-muted-foreground text-xs">Last Nostr Activity:</span>
        {logs.length > 0 ? (
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-muted-foreground/70 font-mono text-xs shrink-0">
              {formatTime(logs[0].timestamp).slice(0, 5)}
            </span>
            <span className={`text-xs truncate ${
              logs[0].type === 'error' ? 'text-destructive' :
              logs[0].type === 'success' ? 'text-primary' :
              'text-foreground'
            }`}>
              {logs[0].message}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground/50 text-xs italic">waiting...</span>
        )}
      </div>
    </div>
  );
}

// Helper function to emit diagnostic events
export function emitDiagnostic(message: string, type: 'info' | 'success' | 'error' = 'info') {
  // Use setTimeout to ensure event is emitted after component mounts
  setTimeout(() => {
    const event = new CustomEvent('nostr-diagnostic', {
      detail: { message, type }
    });
    window.dispatchEvent(event);
  }, 0);
}
