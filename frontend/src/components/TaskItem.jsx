import React from 'react';
import { requestJson } from '../api';

export default function TaskItem({ task, onChange }) {
  async function toggle() {
    try {
      const { response, data } = await requestJson(`/api/tasks/${task._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ completed: !task.completed }) });
      if (!response.ok) throw new Error(data?.message || 'Failed to update task');
      onChange();
    } catch (err) {
      alert(err.message);
    }
  }

  async function remove() {
    if (!confirm('Delete this task?')) return;
    try {
      const { response, data } = await requestJson(`/api/tasks/${task._id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(data?.message || 'Failed to delete task');
      onChange();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <li className="task-item">
      <div className="task-content">
        <h4 className="task-title">{task.title}</h4>
        <p className="task-desc">{task.description || 'No description'}</p>
      </div>
      <div className="task-actions">
        <button className="toggle-btn" onClick={toggle}>{task.completed ? 'Mark Pending' : 'Mark Done'}</button>
        <button className="delete-btn" onClick={remove}>Delete</button>
      </div>
    </li>
  );
}
