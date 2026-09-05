/// <reference types="./types" />
import apiHandler from './api';

export interface Env {
  DB: D1Database;
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env, _ctx?: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      return apiHandler.fetch(request, env);
    }

    try {
      const asset = await env.ASSETS.fetch(request);
      if (asset.status !== 404) return asset;
    } catch {
      // fall through to SPA
    }

    const indexResponse = await env.ASSETS.fetch(new Request(url.origin + '/index.html'));
    return indexResponse;
  },
};
