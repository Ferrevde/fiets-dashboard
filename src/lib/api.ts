// API configuration - set VITE_API_BASE_URL in Cloudflare Pages environment variables
// For local dev: leave empty (uses relative /api/data which works with Vite proxy)
// For production: set to your worker URL, e.g. https://fiets-dashboard-api.your-subdomain.workers.dev

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function apiUrl(path: string): string {
  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
}

export function buildApiUrl(key: string): string {
  return apiUrl(`/api/data?key=${encodeURIComponent(key)}`);
}