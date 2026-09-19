import { emit } from "./events";
const KEY = "fiets-data";
export const settingsStorage = {
  async load() { try { const r = await fetch(`/api/data?key=${KEY}`); const d = await r.json(); return d?.settings || { bikeCompensationPerKm: 0.25, oneWayDistanceKm: 5, carCostPerKm: 0.15 }; } catch { return { bikeCompensationPerKm: 0.25, oneWayDistanceKm: 5, carCostPerKm: 0.15 }; } },
  async save(s: any) { try { await fetch(`/api/data?key=${KEY}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ settings: s }) }); emit("settings", { settings: s }); return true; } catch { return false; } },
  async hasSaved() { try { const r = await fetch(`/api/data?key=${KEY}`); const d = await r.json(); return !!d?.settings; } catch { return false; } },
  async clear() { await fetch(`/api/data?key=${KEY}`, { method: "DELETE" }); },
};
export const commuteStorage = {
  async loadMonth(y: number, m: number) { try { const r = await fetch(`/api/data?key=${KEY}`); const d = await r.json(); return d?.days || []; } catch { return []; } },
  async saveMonth(y: number, m: number, days: any[]) { try { const r = await fetch(`/api/data?key=${KEY}`); const d = await r.json(); const payload = { ...d, days }; await fetch(`/api/data?key=${KEY}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); return true; } catch { return false; } },
};

