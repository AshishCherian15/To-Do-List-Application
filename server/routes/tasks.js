const express = require("express");
const Task = require("../models/Task");
const { requireAuth } = require("../middleware/auth");
const { isDbConnected } = require("../db");
const store = require("../store/inMemoryStore");

const router = express.Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    let tasks;
    if (isDbConnected()) {
      tasks = await Task.find({ userId: req.session.userId }).sort({ createdAt: -1 });
    } else {
      tasks = store.listTasksByUserId(req.session.userId);
    }

    return res.json({ tasks });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch tasks.", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Task title is required." });
    }

    let task;
    if (isDbConnected()) {
      task = await Task.create({
        userId: req.session.userId,
        title: title.trim(),
        description: description ? description.trim() : "",
        completed: false,
      });
    } else {
      task = store.createTask({
        userId: req.session.userId,
        title: title.trim(),
        description: description ? description.trim() : "",
      });
    }

    return res.status(201).json({ task });
  } catch (error) {
    return res.status(500).json({ message: "Failed to create task.", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    let task;
    if (isDbConnected()) {
      task = await Task.findOne({ _id: id, userId: req.session.userId });
    } else {
      task = store.findTaskByIdForUser(id, req.session.userId);
    }

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    if (typeof title !== "undefined") {
      if (!title || !title.trim()) {
        return res.status(400).json({ message: "Task title cannot be empty." });
      }
      task.title = title.trim();
    }

    if (typeof description !== "undefined") {
      task.description = description ? description.trim() : "";
    }

    if (typeof completed !== "undefined") {
      task.completed = Boolean(completed);
    }

    if (isDbConnected()) {
      await task.save();
    } else {
      task = store.updateTask(task, {
        title: typeof title !== "undefined" ? title.trim() : undefined,
        description: typeof description !== "undefined" ? (description ? description.trim() : "") : undefined,
        completed,
      });
    }

    return res.json({ task });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update task.", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let task;
    if (isDbConnected()) {
      task = await Task.findOneAndDelete({ _id: id, userId: req.session.userId });
    } else {
      task = store.deleteTaskByIdForUser(id, req.session.userId);
    }

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    return res.json({ message: "Task deleted." });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete task.", error: error.message });
  }
});

module.exports = router;
