/**
 * Fiets Dashboard - Multi-user Cloudflare Worker
 * 
 * Deploy this to Cloudflare Workers (see DEPLOYMENT_STEPS.md)
 * 
 * KV Namespace: fiets-data (binding: KV)
 * 
 * Key patterns:
 *   fiets-user-{name}           -> { name, password }
 *   fiets-settings-{name}       -> { bikeCompensationPerKm, oneWayDistanceKm, carCostPerKm }
 *   fiets-commute-{name}-{year}-{month} -> { days: [{ date, transportType }, ...] }
 */

export default {
  async fetch(request, env, _ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const key = url.searchParams.get('key');

    // Only allow /api/data endpoint
    if (path !== '/api/data') {
      return new Response('Not Found', { status: 404 });
    }

    if (!key) {
      return new Response(JSON.stringify({ error: 'Missing key parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // CORS headers for local dev
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // ---------- USER ACCOUNT ----------
      if (key.startsWith('fiets-user-')) {

        if (request.method === 'GET') {
          const data = await env.KV.get(key, 'json');
          if (!data) {
            return new Response(JSON.stringify({ error: 'Account not found' }), { status: 404, headers: corsHeaders });
          }
          return new Response(JSON.stringify(data), { headers: corsHeaders });
        }

        if (request.method === 'POST') {
          const body = await request.json();
          if (!body.name || !body.password) {
            return new Response(JSON.stringify({ error: 'Name and password required' }), { status: 400, headers: corsHeaders });
          }
          // Check if account already exists
          const existing = await env.KV.get(key, 'json');
          if (existing) {
            return new Response(JSON.stringify({ error: 'Account already exists' }), { status: 409, headers: corsHeaders });
          }
          await env.KV.put(key, JSON.stringify({ name: body.name, password: body.password }));
          return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }

        if (request.method === 'DELETE') {
          await env.KV.delete(key);
          return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }
      }

      // ---------- SETTINGS ----------
      if (key.startsWith('fiets-settings-')) {
        if (request.method === 'GET') {
          const data = await env.KV.get(key, 'json');
          return new Response(JSON.stringify({ settings: data?.settings || {} }), { headers: corsHeaders });
        }

        if (request.method === 'POST') {
          const body = await request.json();
          await env.KV.put(key, JSON.stringify({ settings: body.settings }));
          return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }

        if (request.method === 'DELETE') {
          await env.KV.delete(key);
          return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }
      }

      // ---------- COMMUTE DATA ----------
      if (key.startsWith('fiets-commute-')) {
        if (request.method === 'GET') {
          const data = await env.KV.get(key, 'json');
          return new Response(JSON.stringify(data?.days || []), { headers: corsHeaders });
        }

        if (request.method === 'POST') {
          const body = await request.json();
          await env.KV.put(key, JSON.stringify({ days: body.days }));
          return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }

        if (request.method === 'DELETE') {
          await env.KV.delete(key);
          return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }
      }

      // ---------- UNKNOWN KEY ----------
      return new Response(JSON.stringify({ error: 'Invalid key format' }), {
        status: 400,
        headers: corsHeaders
      });

    } catch (err) {
      console.error('Worker error:', err);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};