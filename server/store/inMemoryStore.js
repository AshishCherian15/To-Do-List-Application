const { randomUUID } = require("crypto");

const users = [];
const tasks = [];

function createUser({ username, email, passwordHash }) {
  const user = {
    _id: randomUUID(),
    username,
    email,
    passwordHash,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  users.push(user);
  return user;
}

function findUserByEmail(email) {
  return users.find((user) => user.email === email) || null;
}

function findUserById(id) {
  return users.find((user) => user._id === id) || null;
}

function createTask({ userId, title, description }) {
  const task = {
    _id: randomUUID(),
    userId,
    title,
    description,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  tasks.push(task);
  return task;
}

function listTasksByUserId(userId) {
  return tasks
    .filter((task) => task.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

function findTaskByIdForUser(id, userId) {
  return tasks.find((task) => task._id === id && task.userId === userId) || null;
}

function updateTask(task, updates) {
  if (typeof updates.title !== "undefined") {
    task.title = updates.title;
  }

  if (typeof updates.description !== "undefined") {
    task.description = updates.description;
  }

  if (typeof updates.completed !== "undefined") {
    task.completed = Boolean(updates.completed);
  }

  task.updatedAt = new Date();
  return task;
}

function deleteTaskByIdForUser(id, userId) {
  const index = tasks.findIndex((task) => task._id === id && task.userId === userId);
  if (index === -1) {
    return null;
  }

  const [deleted] = tasks.splice(index, 1);
  return deleted;
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  createTask,
  listTasksByUserId,
  findTaskByIdForUser,
  updateTask,
  deleteTaskByIdForUser,
};
