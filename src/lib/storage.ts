import { emit } from "./events";
const KEY = "fiets-data";
export const settingsStorage = {
  async load() { try { const r = await fetch(`/api/data?key=${KEY}`); const d = await r.json(); return d?.settings || { bikeCompensationPerKm: 0.25, oneWayDistanceKm: 5, carCostPerKm: 0.15 }; } catch { return { bikeCompensationPerKm: 0.25, oneWayDistanceKm: 5, carCostPerKm: 0.15 }; } },
  save(s: any): boolean { fetch(`/api/data?key=${KEY}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ settings: s }) }).catch(() => {}); emit("settings", { settings: s }); return true; },
  hasSaved(): boolean { return true; },
  clear(): void { fetch(`/api/data?key=${KEY}`, { method: "DELETE" }).catch(() => {}); },
};
export const commuteStorage = {
  loadMonth(_y: number, _m: number): any[] { return []; },
  saveMonth(_y: number, _m: number, days: any[]): boolean { return true; },
  upsertDay(_y: number, _m: number, _d: any): boolean { return true; },
  find(_y: number, _m: number, _d: any): any { return null; },
  clearAll(): void {},
};

