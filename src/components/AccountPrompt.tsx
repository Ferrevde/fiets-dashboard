import { useState } from 'react';
import { useAccount } from '../hooks/useAccount';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

export function AccountPrompt() {
  const { account, ready, create } = useAccount();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [mode] = useState<'create' | 'login'>('create');

  if (!ready) return null;
  if (account) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && password) create(name.trim(), password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090B] p-6">
      <Card className="w-full max-w-md p-8 rounded-2xl bg-[#18181B] border border-white/5">
        <h2 className="text-2xl font-semibold text-white mb-2">Fiets Dashboard</h2>
        <p className="text-gray-400 mb-6">Create your account to start tracking.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Account name" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required />
          <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
          <Button type="submit" className="w-full">{mode === 'create' ? 'Create account' : 'Login'}</Button>
        </form>
      </Card>
    </div>
  );
}
