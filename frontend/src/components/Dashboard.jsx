import React, { useEffect, useState } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { requestJson } from '../api';

export default function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState('');

  async function load() {
    try {
      const { response, data } = await requestJson('/api/tasks');
      if (!response.ok) throw new Error(data?.message || 'Failed to load');
      setTasks(data.tasks || []);
    } catch (err) {
      setMessage(err.message);
    }
  }

  useEffect(() => { load(); }, []);

  async function logout() {
    await requestJson('/api/auth/logout', { method: 'POST' });
    onLogout();
  }

  return (
    <div className="dashboard-root">
      <header className="appbar card">
        <div>
          <h1 className="app-title">Task Orbit</h1>
          <p className="app-sub">Welcome, {user.username}</p>
        </div>
        <div>
          <button className="ghost-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <section className="stats-grid">
        <article className="card stat-card">
          <p className="stat-label">Total Tasks</p>
          <h3>{tasks.length}</h3>
        </article>
        <article className="card stat-card">
          <p className="stat-label">Pending</p>
          <h3>{tasks.filter(t => !t.completed).length}</h3>
        </article>
        <article className="card stat-card">
          <p className="stat-label">Completed</p>
          <h3>{tasks.filter(t => t.completed).length}</h3>
        </article>
      </section>

      <section className="card panel">
        <TaskForm onAdded={load} setMessage={setMessage} />
        <p className="message">{message}</p>
      </section>

      <section className="task-columns">
        <TaskList tasks={tasks.filter(t => !t.completed)} title="Pending" onChange={load} />
        <TaskList tasks={tasks.filter(t => t.completed)} title="Completed" onChange={load} />
      </section>
    </div>
  );
}
