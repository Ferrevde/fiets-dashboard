import { useState, useEffect } from 'react';

export function useAccount() {
  const [account, setAccount] = useState<{ name: string; password: string } | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('fiets-account');
    if (saved) {
      try { setAccount(JSON.parse(saved)); } catch {}
    }
    setReady(true);
  }, []);

  const create = (name: string, password: string) => {
    const a = { name: name.trim(), password };
    setAccount(a);
    localStorage.setItem('fiets-account', JSON.stringify(a));
  };

  const clear = () => {
    setAccount(null);
    localStorage.removeItem('fiets-account');
  };

  return { account, ready, create, clear };
}
