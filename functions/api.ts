export interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    if (method === 'OPTIONS') return new Response(null, { headers });

    try {
      if (url.pathname === '/api/settings' && method === 'GET') {
        const row = await env.DB.prepare('SELECT * FROM settings WHERE id = 1').first();
        const settings = row || { bike_compensation_per_km: 0.23, one_way_distance_km: 15, car_cost_per_km: 0.45 };
        return new Response(JSON.stringify({
          bikeCompensationPerKm: settings.bike_compensation_per_km,
          oneWayDistanceKm: settings.one_way_distance_km,
          carCostPerKm: settings.car_cost_per_km,
        }), { headers });
      }
      if (url.pathname === '/api/settings' && method === 'POST') {
        const body = await request.json() as any;
        if (typeof body.bike_compensation_per_km !== 'number' || typeof body.one_way_distance_km !== 'number' || typeof body.car_cost_per_km !== 'number') {
          return new Response(JSON.stringify({ error: 'Invalid settings' }), { status: 400, headers });
        }
        await env.DB.prepare('INSERT OR REPLACE INTO settings (id, bike_compensation_per_km, one_way_distance_km, car_cost_per_km, updated_at) VALUES (1, ?, ?, ?, CURRENT_TIMESTAMP)').bind(body.bikeCompensationPerKm ?? body.bike_compensation_per_km ?? 0.23, body.oneWayDistanceKm ?? body.one_way_distance_km ?? 15, body.carCostPerKm ?? body.car_cost_per_km ?? 0.45).run();
        return new Response(JSON.stringify({ ok: true }), { headers });
      }

      if (url.pathname === '/api/commute' && method === 'GET') {
        const year = url.searchParams.get('year');
        const month = url.searchParams.get('month');
        if (!year || !month) return new Response(JSON.stringify({ error: 'Missing year/month' }), { status: 400, headers });
        const start = `${year}-${month.padStart(2,'0')}-01`;
        const end = `${year}-${month.padStart(2,'0')}-31`;
        const { results } = await env.DB.prepare('SELECT date, transport_type FROM commute_days WHERE user_id = ? AND date >= ? AND date <= ?').bind('anonymous', start, end).all();
        const mapped = (results || []).map((r: any) => ({
          date: r.date,
          transportType: r.transport_type === 'bicycle' ? 'bike' : r.transport_type,
        }));
        return new Response(JSON.stringify({ days: mapped }), { headers });
      }
      if (url.pathname === '/api/commute' && method === 'POST') {
        const body = await request.json() as any;
        if (!body.date || !['bicycle','car','sick','vacation'].includes(body.transport_type)) {
          return new Response(JSON.stringify({ error: 'Invalid commute data' }), { status: 400, headers });
        }
        await env.DB.prepare('INSERT OR IGNORE INTO commute_days (user_id, date, transport_type) VALUES (?, ?, ?)').bind('anonymous', body.date, body.transport_type === 'bike' ? 'bicycle' : body.transport_type).run();
        await env.DB.prepare('UPDATE commute_days SET transport_type = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND date = ?').bind(body.transport_type === 'bike' ? 'bicycle' : body.transport_type, 'anonymous', body.date).run();
        return new Response(JSON.stringify({ ok: true }), { headers });
      }
      if (url.pathname === '/api/commute' && method === 'DELETE') {
        const body = await request.json() as any;
        if (!body.date) return new Response(JSON.stringify({ error: 'Missing date' }), { status: 400, headers });
        await env.DB.prepare('DELETE FROM commute_days WHERE user_id = ? AND date = ?').bind('anonymous', body.date).run();
        return new Response(JSON.stringify({ ok: true }), { headers });
      }

      if (url.pathname === '/api/migrate' && method === 'POST') {
        const body = await request.json() as any;
        if (body.settings) {
          await env.DB.prepare('INSERT OR REPLACE INTO settings (id, bike_compensation_per_km, one_way_distance_km, car_cost_per_km, updated_at) VALUES (1, ?, ?, ?, CURRENT_TIMESTAMP)').bind(body.settings.bikeCompensationPerKm ?? body.settings.bike_compensation_per_km ?? 0.23, body.settings.oneWayDistanceKm ?? body.settings.one_way_distance_km ?? 15, body.settings.carCostPerKm ?? body.settings.car_cost_per_km ?? 0.45).run();
        }
        if (Array.isArray(body.days)) {
          for (const d of body.days) {
            await env.DB.prepare('INSERT OR IGNORE INTO commute_days (user_id, date, transport_type) VALUES (?, ?, ?)').bind('anonymous', d.date, d.transportType === 'bike' ? 'bicycle' : d.transportType).run();
          }
        }
        return new Response(JSON.stringify({ ok: true, imported: (body.days?.length || 0) }), { headers });
      }

      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404, headers });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message || 'Server error' }), { status: 500, headers });
    }
  },
};
