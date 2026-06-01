import React, { useState } from 'react';
import { requestJson } from '../api';

export default function Register({ onRegister }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    try {
      const { response, data } = await requestJson('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, email, password }) });
      if (!response.ok) throw new Error(data?.message || 'Registration failed');
      onRegister(data.user);
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div className="card auth-card">
      <h2>Create account</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} required minLength={3} />
        </label>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        </label>
        <button className="primary-btn" type="submit">Create Account</button>
        <p className="message">{message}</p>
      </form>
    </div>
  );
}
