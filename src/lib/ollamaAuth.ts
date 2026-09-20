// Shared by every Ollama-calling module (contentAgent.ts, translate.ts).
// OLLAMA_AUTH_TOKEN is optional — unset, this is a no-op, so local dev
// (Ollama on localhost, nothing in front of it) keeps working unchanged.
// In production it must be set to the same value as the Caddy proxy on
// the Ollama VPS (deploy/Caddyfile), which rejects any request missing
// this exact bearer token. See DEPLOY.md.
export function ollamaAuthHeaders(): Record<string, string> {
  const token = process.env.OLLAMA_AUTH_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
}
