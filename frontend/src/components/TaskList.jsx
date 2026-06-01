import React from 'react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, title, onChange }) {
  return (
    <section className="card panel">
      <div className="panel-head">
        <h3 className="panel-title">{title}</h3>
        <span className="pill-count">{tasks.length}</span>
      </div>
      <div>
        {tasks.length === 0 && <div className="empty-state">No tasks here.</div>}
        <ul className="task-list">
          {tasks.map(task => (
            <TaskItem key={task._id} task={task} onChange={onChange} />
          ))}
        </ul>
      </div>
    </section>
  );
}
