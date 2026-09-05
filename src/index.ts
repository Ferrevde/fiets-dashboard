/// <reference path="./types.d.ts" />
import type { Env } from './env';

export default {
  async fetch(request: Request, env: Env, _ctx?: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/data' && request.method === 'GET') {
      try {
        const res = await env.ASSETS.fetch(new Request(url.origin + '/data.json'));
        if (res.status === 200) return res;
      } catch {}
      return new Response(JSON.stringify({ settings: null, days: [] }), { headers: { 'Content-Type': 'application/json' } });
    }

    if (url.pathname === '/api/data' && request.method === 'POST') {
      await request.json();
      return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
    }

    try {
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) return asset;
    } catch {}

    const indexResponse = await env.ASSETS.fetch(new Request(url.origin + '/index.html'));
    return indexResponse;
  },
};
