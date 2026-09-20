import { useState } from 'react';
import { useAccount } from '../hooks/useAccount';
import { Button as UiButton } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

import { LogOut } from 'lucide-react';

const KV_KEY = 'fiets-data-anonymous';

async function checkAccountExists(name: string): Promise<{ name: string; password: string } | null> {
  try {
    const res = await fetch(`/api/data?key=${KV_KEY}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.name === name.trim() && data?.password) {
      return { name: data.name, password: data.password };
    }
    return null;
  } catch {
    return null;
  }
}

async function createAccountInKV(name: string, password: string): Promise<void> {
  await fetch(`/api/data?key=${KV_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name.trim(), password }),
  });
}

export function AccountPrompt() {
  const { account, ready, create, logout } = useAccount();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'create' | 'login'>('create');
  const [error, setError] = useState('');

  if (account) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8 rounded-2xl bg-[#18181B] border border-white/5 text-center space-y-4">
          <h2 className="text-xl font-semibold text-white">Welcome, {account.name}</h2>
          <UiButton onClick={logout} variant="outline" className="gap-2"><LogOut className="h-4 w-4" /> Logout</UiButton>
        </Card>
      </div>
    );
  }

  if (!ready) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !password) return;

    if (mode === 'create') {
      const existing = await checkAccountExists(name);
      if (existing) {
        setError('Account already exists');
        return;
      }
      await createAccountInKV(name, password);
      create(name.trim(), password);
    } else {
      const existing = await checkAccountExists(name);
      if (!existing || existing.password !== password) {
        setError('Wrong password');
        return;
      }
      create(existing.name, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090B] p-6">
      <Card className="w-full max-w-md p-8 rounded-2xl bg-[#18181B] border border-white/5">
        <h2 className="text-2xl font-semibold text-white mb-2">Fiets Dashboard</h2>
        <p className="text-gray-400 mb-6">{mode === 'create' ? 'Create your account to start tracking.' : 'Sign in to your account.'}</p>
        {error && <p className="text-red-400 text-sm mb-4" role="alert">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Account name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
          <UiButton type="submit" className="w-full">{mode === 'create' ? 'Create account' : 'Login'}</UiButton>
        </form>
        <p className="text-center text-gray-500 text-sm mt-4">
          {mode === 'create' ? 'Already have an account?' : 'Need to create an account?'} 
          <button 
            type="button" 
            onClick={() => { setMode(m => m === 'create' ? 'login' : 'create'); setError(''); }}
            className="text-accent-green hover:underline ml-1"
          >
            {mode === 'create' ? 'Sign in' : 'Create account'}
          </button>
        </p>
      </Card>
    </div>
  );
}
