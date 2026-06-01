import React, { useState } from 'react';
import { requestJson } from '../api';

export default function AuthCard({ onAuth }) {
  const [mode, setMode] = useState('welcome'); // welcome, auth
  const [tab, setTab] = useState('login');

  return (
    <div>
      <header className="appbar card">
        <h1 className="app-title">Task Orbit</h1>
        <p className="app-sub">Design your day like a production roadmap.</p>
      </header>

      {mode === 'welcome' ? (
        <section className="welcome-card card">
          <h2>Welcome to Task Orbit</h2>
          <p>Manage tasks, track progress, and stay focused. Click Get Started to sign in or create an account.</p>
          <div style={{display:'flex',gap:10}}>
            <button className="primary-btn" onClick={() => { setMode('auth'); setTab('login'); }}>Get Started</button>
            <button className="ghost-btn" onClick={() => { setMode('auth'); setTab('register'); }}>Create Account</button>
          </div>
        </section>
      ) : (
        <section className="auth-card card sliding-card">
          <div className="auth-tabs">
            <button className={`tab-btn ${tab==='login'?'active':''}`} onClick={() => setTab('login')}>Login</button>
            <button className={`tab-btn ${tab==='register'?'active':''}`} onClick={() => setTab('register')}>Register</button>
          </div>

          <div className="auth-forms">
            <div className={`form-panel ${tab==='login'?'show':'hide'}`}>
              <LoginForm onAuth={onAuth} />
            </div>
            <div className={`form-panel ${tab==='register'?'show':'hide'}`}>
              <RegisterForm onAuth={onAuth} />
            </div>
          </div>

          <div style={{marginTop:12}}>
            <button className="ghost-btn" onClick={() => setMode('welcome')}>Back</button>
          </div>
        </section>
      )}
    </div>
  );
}

function LoginForm({ onAuth }) {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('Admin123');
  const [message, setMessage] = useState('');

  async function submit(e) {
    e.preventDefault(); setMessage('');
    try {
      const { response, data } = await requestJson('/api/auth/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) });
      if (!response.ok) throw new Error(data?.message || 'Login failed');
      onAuth(data.user);
    } catch (err) { setMessage(err.message); }
  }

  return (
    <form onSubmit={submit} className="form">
      <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} required/></label>
      <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>
      <button className="primary-btn" type="submit">Sign In</button>
      <p className="message">{message}</p>
    </form>
  );
}

function RegisterForm({ onAuth }) {
  const [username, setUsername] = useState('Demo User');
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password123');
  const [message, setMessage] = useState('');

  async function submit(e) {
    e.preventDefault(); setMessage('');
    try {
      const { response, data } = await requestJson('/api/auth/register', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ username, email, password }) });
      if (!response.ok) throw new Error(data?.message || 'Registration failed');
      onAuth(data.user);
    } catch (err) { setMessage(err.message); }
  }

  return (
    <form onSubmit={submit} className="form">
      <label>Username<input value={username} onChange={e=>setUsername(e.target.value)} required minLength={3}/></label>
      <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} required/></label>
      <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6}/></label>
      <button className="primary-btn" type="submit">Create Account</button>
      <p className="message">{message}</p>
    </form>
  );
}
