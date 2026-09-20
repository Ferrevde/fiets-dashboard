import { emit } from "./events";
import { buildApiUrl } from "./api";

function getAccountName(): string {
  // Read from localStorage where useAccount stores the logged-in user's name
  if (typeof window !== 'undefined') {
    const name = localStorage.getItem('fiets-account-name');
    if (name) return name;
  }
  return 'anonymous';
}

export const settingsStorage = {
  async load() {
    const name = getAccountName();
    try { 
      const r = await fetch(buildApiUrl(`fiets-settings-${name}`)); 
      const d = await r.json(); 
      return d?.settings || { bikeCompensationPerKm: 0.25, oneWayDistanceKm: 5, carCostPerKm: 0.15 }; 
    } catch { 
      return { bikeCompensationPerKm: 0.25, oneWayDistanceKm: 5, carCostPerKm: 0.15 }; 
    }
  },
  async save(s: any): Promise<boolean> {
    const name = getAccountName();
    await fetch(buildApiUrl(`fiets-settings-${name}`), { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ settings: s }) 
    }).catch(() => {}); 
    emit("settings", { settings: s }); 
    return true;
  },
  hasSaved(): boolean { return true; },
  async clear(): Promise<void> {
    const name = getAccountName();
    await fetch(buildApiUrl(`fiets-settings-${name}`), { method: "DELETE" }).catch(() => {});
  },
};

export const commuteStorage = {
  async loadMonth(year: number, month: number): Promise<any[]> {
    const name = getAccountName();
    try {
      const res = await fetch(buildApiUrl(`fiets-commute-${name}-${year}-${month}`));
      if (!res.ok) return [];
      const data = await res.json();
      return data?.days || [];
    } catch {
      return [];
    }
  },
  async saveMonth(year: number, month: number, days: any[]): Promise<boolean> {
    const name = getAccountName();
    await fetch(buildApiUrl(`fiets-commute-${name}-${year}-${month}`), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ days }),
    }).catch(() => {});
    emit("commute", { year, month });
    return true;
  },
  async upsertDay(year: number, month: number, date: string, transportType: any): Promise<boolean> {
    const days = await commuteStorage.loadMonth(year, month);
    const idx = days.findIndex(d => d.date === date);
    if (idx >= 0) days[idx] = { date, transportType };
    else days.push({ date, transportType });
    return commuteStorage.saveMonth(year, month, days);
  },
  async find(year: number, month: number, date: string): Promise<any> {
    const days = await commuteStorage.loadMonth(year, month);
    return days.find(d => d.date === date) || null;
  },
  async clearAll(): Promise<void> {
    const name = getAccountName();
    for (let year = 2020; year <= 2030; year++) {
      for (let month = 1; month <= 12; month++) {
        await fetch(buildApiUrl(`fiets-commute-${name}-${year}-${month}`), { method: "DELETE" }).catch(() => {});
      }
    }
  },
};

