const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Task = require('./models/Task');
const store = require('./store/inMemoryStore');
const { isDbConnected } = require('./db');

async function seedDemo() {
  const demoEmail = 'admin@example.com';
  const demoPassword = 'Admin123';

  if (isDbConnected()) {
    try {
      const existing = await User.findOne({ email: demoEmail });
      if (existing) return;

      const passwordHash = await bcrypt.hash(demoPassword, 10);
      const user = await User.create({ username: 'admin', email: demoEmail, passwordHash });

      await Task.create({ userId: user._id, title: 'Welcome to Task Orbit', description: 'This is an example task. Edit or delete it.', completed: false });
      await Task.create({ userId: user._id, title: 'Completed demo task', description: 'This task is completed.', completed: true });
      console.log('Seeded demo user and tasks (MongoDB)');
    } catch (err) {
      console.warn('Seeding failed', err.message);
    }
  } else {
    // in-memory fallback
    const existing = store.findUserByEmail(demoEmail);
    if (existing) return;

    const passwordHash = await bcrypt.hash(demoPassword, 10);
    const user = store.createUser({ username: 'admin', email: demoEmail, passwordHash });
    store.createTask({ userId: user._id, title: 'Welcome to Task Orbit', description: 'This is an example task. Edit or delete it.' });
    store.createTask({ userId: user._id, title: 'Completed demo task', description: 'This task is completed.' });
    // mark second as completed
    const tasks = store.listTasksByUserId(user._id);
    if (tasks[1]) store.updateTask(tasks[1], { completed: true });
    console.log('Seeded demo user and tasks (in-memory)');
  }
}

module.exports = { seedDemo };
