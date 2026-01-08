// This component is no longer used - npub moved to Layout
// Kept for potential future diagnostic features

export function DiagnosticPanel() {
  return null;
}

// Helper function to emit diagnostic events (kept for logging)
export function emitDiagnostic(message: string, type: 'info' | 'success' | 'error' = 'info') {
  // Log to console for debugging
  console.log(`[Nostr ${type}]`, message);
}
