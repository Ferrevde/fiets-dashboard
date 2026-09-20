import { useState, useEffect, useCallback } from 'react';
import { buildApiUrl } from '../lib/api';

async function loadAccountFromKV(name: string): Promise<{ name: string; password: string } | null> {
  try {
    const res = await fetch(buildApiUrl(`fiets-user-${name}`));
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
  await fetch(buildApiUrl(`fiets-user-${name.trim()}`), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name.trim(), password }),
  });
}

async function checkAccountExists(name: string): Promise<{ name: string; password: string } | null> {
  return loadAccountFromKV(name);
}

export function useAccount() {
  const [account, setAccount] = useState<{ name: string; password: string } | null>(null);
  const [ready, setReady] = useState(false);

  // Load saved account name from localStorage to auto-login
  useEffect(() => {
    let mounted = true;
    const savedName = localStorage.getItem('fiets-account-name');
    if (savedName) {
      loadAccountFromKV(savedName).then((acc) => {
        if (mounted && acc) {
          setAccount(acc);
        }
        if (mounted) setReady(true);
      });
    } else {
      if (mounted) setReady(true);
    }
    return () => { mounted = false; };
  }, []);

  const create = useCallback(async (name: string, password: string) => {
    const trimmedName = name.trim();
    const a = { name: trimmedName, password };
    await saveAccountToKV(trimmedName, password);
    localStorage.setItem('fiets-account-name', trimmedName);
    setAccount(a);
  }, []);

  const login = useCallback(async (name: string, password: string) => {
    const trimmedName = name.trim();
    const acc = await checkAccountExists(trimmedName);
    if (!acc || acc.password !== password) {
      throw new Error('Wrong password');
    }
    localStorage.setItem('fiets-account-name', trimmedName);
    setAccount(acc);
  }, []);

  const clear = useCallback(() => {
    setAccount(null);
    localStorage.removeItem('fiets-account-name');
  }, []);

  const logout = useCallback(() => {
    clear();
    window.location.reload();
  }, [clear]);

  return { account, ready, create, login, clear, logout };
}
