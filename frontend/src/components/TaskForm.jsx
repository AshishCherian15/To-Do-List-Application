import React, { useState } from 'react';
import { requestJson } from '../api';

export default function TaskForm({ onAdded, setMessage }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    try {
      const { response, data } = await requestJson('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, description }) });
      if (!response.ok) throw new Error(data?.message || 'Failed to add');
      setTitle(''); setDescription('');
      onAdded();
      setMessage('Task added.');
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <label>
        Task title
        <input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Submit assignment" />
      </label>
      <label>
        Description (optional)
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Add context, notes, or links" />
      </label>
      <button className="primary-btn" type="submit">Add Task</button>
    </form>
  );
}
