import React, { useEffect, useState } from 'react';
import AuthCard from './components/AuthCard';
import Dashboard from './components/Dashboard';
import { requestJson } from './api';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function bootstrap() {
      try {
        const { response, data } = await requestJson('/api/auth/me');
        if (!response.ok) throw new Error(data?.message || 'no session');
        setUser(data.user);
      } catch (e) {
        setUser(null);
      }
    }
    bootstrap();
  }, []);

  if (!user) {
    return (
      <div className="app-root">
        <AuthCard onAuth={setUser} />
      </div>
    );
  }

  return <Dashboard user={user} onLogout={() => setUser(null)} />;
}
