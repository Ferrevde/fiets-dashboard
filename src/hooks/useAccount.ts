import { useState, useEffect, useCallback } from 'react';

const KV_KEY = 'fiets-data-anonymous';

async function loadAccountFromKV(): Promise<{ name: string; password: string } | null> {
  try {
    const res = await fetch(`/api/data?key=${KV_KEY}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.name && data?.password) {
      return { name: data.name, password: data.password };
    }
    return null;
  } catch {
    return null;
  }
}

async function saveAccountToKV(name: string, password: string): Promise<void> {
  await fetch(`/api/data?key=${KV_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name.trim(), password }),
  });
}

export function useAccount() {
  const [account, setAccount] = useState<{ name: string; password: string } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    loadAccountFromKV().then((acc) => {
      if (mounted) {
        setAccount(acc);
        setReady(true);
      }
    });
    return () => { mounted = false; };
  }, []);

  const create = useCallback(async (name: string, password: string) => {
    const trimmedName = name.trim();
    const a = { name: trimmedName, password };
    await saveAccountToKV(trimmedName, password);
    setAccount(a);
  }, []);

  const clear = useCallback(() => {
    setAccount(null);
  }, []);

  const logout = useCallback(() => {
    clear();
    window.location.reload();
  }, [clear]);

  return { account, ready, create, clear, logout };
}
