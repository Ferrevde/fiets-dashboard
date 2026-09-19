import { emit } from "./events";
// KV key uses account name from localStorage
export const settingsStorage = {
  async load() {
    const account = localStorage.getItem('fiets-account');
    const name = account ? JSON.parse(account).name : 'anonymous';
    try { const r = await fetch(`/api/data?key=${name}`); const d = await r.json(); return d?.settings || { bikeCompensationPerKm: 0.25, oneWayDistanceKm: 5, carCostPerKm: 0.15 }; } catch { return { bikeCompensationPerKm: 0.25, oneWayDistanceKm: 5, carCostPerKm: 0.15 }; }
  },
  save(s: any): boolean {
    const account = localStorage.getItem('fiets-account');
    const name = account ? JSON.parse(account).name : 'anonymous';
    fetch(`/api/data?key=${name}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ settings: s }) }).catch(() => {}); emit("settings", { settings: s }); return true;
  },
  hasSaved(): boolean { return true; },
  clear(): void {
    const account = localStorage.getItem('fiets-account');
    const name = account ? JSON.parse(account).name : 'anonymous';
    fetch(`/api/data?key=${name}`, { method: "DELETE" }).catch(() => {});
  },
};
export const commuteStorage = {
  loadMonth(_y: number, _m: number): any[] { return []; },
  saveMonth(_y: number, _m: number, _days: any[]): boolean { return true; },
  upsertDay(_y: number, _m: number, _d: any, _t?: any): boolean { return true; },
  find(_y: number, _m: number, _d: any): any { return null; },
  clearAll(): void {},
};

