export async function loadSettingsFromD1(): Promise<any> {
  try {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Failed to load settings');
    return await res.json();
  } catch {
    return null;
  }
}

export async function saveSettingsToD1(settings: any): Promise<boolean> {
  try {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function loadCommuteDaysFromD1(year: number, month: number): Promise<any[]> {
  try {
    const res = await fetch(`/api/commute?year=${year}&month=${month}`);
    if (!res.ok) throw new Error('Failed to load commute');
    const data = await res.json();
    return data.days || [];
  } catch {
    return [];
  }
}

export async function saveCommuteDayToD1(date: string, transportType: string): Promise<boolean> {
  try {
    const res = await fetch('/api/commute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, transport_type: transportType }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function deleteCommuteDayFromD1(date: string): Promise<boolean> {
  try {
    const res = await fetch('/api/commute', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function migrateToD1(localData: { settings?: any; days?: any[] }): Promise<{ ok: boolean; imported: number }> {
  try {
    const res = await fetch('/api/migrate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(localData),
    });
    if (!res.ok) throw new Error('Migration failed');
    return await res.json();
  } catch {
    return { ok: false, imported: 0 };
  }
}
