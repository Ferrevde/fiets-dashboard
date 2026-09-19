/// <reference path="./types.d.ts" />
import type { Env } from './env';

export default {
  async fetch(request: Request, env: Env, _ctx?: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/settings' && (request.method === 'GET' || request.method === 'POST')) {
      const postBody = request.method === 'POST' ? await request.json() as any : null;
      const accountName = postBody?.accountName || url.searchParams.get('key') || 'anonymous';
      const kvKey = `fiets-data-${accountName}`;
      if (request.method === 'GET') {
        const data = await env.KV?.get(kvKey);
        return new Response(data || JSON.stringify({ bikeComp: 0.25, distance: 5, carCost: 0.15 }), { headers: { 'Content-Type': 'application/json' } });
      }
      if (request.method === 'POST') {
        await env.KV?.put(kvKey, JSON.stringify(postBody));
        return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
      }
    }

    if (url.pathname === '/api/commute' && (request.method === 'GET' || request.method === 'POST' || request.method === 'DELETE')) {
      const accountName = url.searchParams.get('key') || 'anonymous';
      const kvKey = `fiets-data-${accountName}`;
      if (request.method === 'GET') {
        const data = await env.KV?.get(kvKey);
        return new Response(data || JSON.stringify({ settings: null, days: [] }), { headers: { 'Content-Type': 'application/json' } });
      }
      if (request.method === 'POST') {
        const postBody = await request.json() as any;
        await env.KV?.put(kvKey, JSON.stringify(postBody));
        return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
      }
      if (request.method === 'DELETE') {
        await (env.KV as any)?.delete(kvKey);
        return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
      }
    }

    if (url.pathname === '/api/data' && request.method === 'GET') {
      try {
        const userId = url.searchParams.get('user') || 'anonymous';
        const data = await env.KV?.get(`fiets-data-${userId}`);
        if (data) return new Response(data, { headers: { 'Content-Type': 'application/json' } });
      } catch {}
      return new Response(JSON.stringify({ settings: null, days: [] }), { headers: { 'Content-Type': 'application/json' } });
    }

    if (url.pathname === '/api/data' && request.method === 'POST') {
      const body = await request.json() as any;
      const userId = url.searchParams.get('user') || 'anonymous';
      await env.KV?.put(`fiets-data-${userId}`, JSON.stringify(body));
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
