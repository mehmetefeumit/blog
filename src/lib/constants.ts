import { nip19 } from 'nostr-tools';

/**
 * Author's Nostr public key
 * npub: npub17pdf8saz8fflz3dqyst8rhfzav4s922yv0truw85nr02jxyxqr3shkl0gr
 */
const AUTHOR_NPUB = 'npub17pdf8saz8fflz3dqyst8rhfzav4s922yv0truw85nr02jxyxqr3shkl0gr';

// Decode npub to hex pubkey
const decoded = nip19.decode(AUTHOR_NPUB);
export const AUTHOR_PUBKEY = typeof decoded.data === 'string' ? decoded.data : '';

// Log for debugging
console.log('Author npub:', AUTHOR_NPUB);
console.log('Author pubkey (hex):', AUTHOR_PUBKEY);
console.log('Pubkey length:', AUTHOR_PUBKEY.length);
