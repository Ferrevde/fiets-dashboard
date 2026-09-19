import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Months } from './pages/Months';
import { Settings } from './pages/Settings';

import { AccountPrompt } from './components/AccountPrompt';
import { useAccount } from './hooks/useAccount';

function App() {
  const { account, ready } = useAccount();
  if (!ready) return <div className="min-h-screen bg-[#09090B]" />;
  if (!account) return <AccountPrompt />;
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="months" element={<Months />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;