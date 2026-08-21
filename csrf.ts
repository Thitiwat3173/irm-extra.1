// lib/csrf.ts — CSRF token helpers
// Replaces csrf_field() / csrf_verify() in config.php

export function generateCsrfToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyCsrfToken(token: string, storedToken: string): Promise<boolean> {
  if (!token || !storedToken) return false;
  // Constant-time comparison
  const a = new TextEncoder().encode(token);
  const b = new TextEncoder().encode(storedToken);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}
