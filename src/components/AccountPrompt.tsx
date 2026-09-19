import { useState } from 'react';
import { useAccount } from '../hooks/useAccount';
import { Button as UiButton } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

import { LogOut } from 'lucide-react';

export function AccountPrompt() {
  const { account, ready, create, logout } = useAccount();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [mode] = useState<'create' | 'login'>('create');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !password) return;
    if (mode === 'create') {
      fetch(`/api/data?key=account-${name.trim()}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: name.trim(), password }) }).catch(() => {});
      create(name.trim(), password);
    } else {
      fetch(`/api/data?key=account-${name.trim()}`).then(r => r.json()).then(d => {
        if (d?.password === password) create(name.trim(), password);
        else alert('Wrong password');
      }).catch(() => alert('Login failed'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090B] p-6">
      <Card className="w-full max-w-md p-8 rounded-2xl bg-[#18181B] border border-white/5">
        <h2 className="text-2xl font-semibold text-white mb-2">Fiets Dashboard</h2>
        <p className="text-gray-400 mb-6">Create your account to start tracking.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Account name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
          <UiButton type="submit" className="w-full">{mode === 'create' ? 'Create account' : 'Login'}</UiButton>
        </form>
      </Card>
    </div>
  );
}
