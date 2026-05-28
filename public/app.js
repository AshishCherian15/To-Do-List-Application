const authSection = document.getElementById("authSection");
const dashboardSection = document.getElementById("dashboardSection");
const showLoginBtn = document.getElementById("showLoginBtn");
const showRegisterBtn = document.getElementById("showRegisterBtn");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const authMessage = document.getElementById("authMessage");
const welcomeText = document.getElementById("welcomeText");
const logoutBtn = document.getElementById("logoutBtn");
const addTaskForm = document.getElementById("addTaskForm");
const taskMessage = document.getElementById("taskMessage");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");
const taskItemTemplate = document.getElementById("taskItemTemplate");
const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");
const completionRate = document.getElementById("completionRate");
const progressBar = document.getElementById("progressBar");
const taskSearch = document.getElementById("taskSearch");
const filterButtons = document.querySelectorAll(".filter-btn");
const pendingVisibleCount = document.getElementById("pendingVisibleCount");
const completedVisibleCount = document.getElementById("completedVisibleCount");
const editTaskDialog = document.getElementById("editTaskDialog");
const editTaskForm = document.getElementById("editTaskForm");
const editTaskTitle = document.getElementById("editTaskTitle");
const editTaskDescription = document.getElementById("editTaskDescription");
const cancelEditBtn = document.getElementById("cancelEditBtn");

let currentUser = null;
let tasks = [];
let activeFilter = "all";
let editingTaskId = null;

function animateIntro() {
  if (typeof anime === "undefined") {
    return;
  }

  anime({
    targets: ".bg-shape",
    translateY: [0, -14],
    direction: "alternate",
    loop: true,
    easing: "easeInOutSine",
    duration: 3600,
    delay: anime.stagger(200),
  });

  anime({
    targets: ".auth-card, .reveal-item",
    opacity: [0, 1],
    translateY: [12, 0],
    delay: anime.stagger(70),
    easing: "easeOutExpo",
    duration: 600,
  });
}

function setAuthTab(mode) {
  const loginActive = mode === "login";

  showLoginBtn.classList.toggle("active", loginActive);
  showRegisterBtn.classList.toggle("active", !loginActive);
  loginForm.classList.toggle("active", loginActive);
  registerForm.classList.toggle("active", !loginActive);
  authMessage.textContent = "";
}

function showDashboard(user) {
  currentUser = user;
  welcomeText.textContent = `Welcome, ${user.username}`;
  authSection.classList.add("hidden");
  dashboardSection.classList.remove("hidden");

  if (typeof anime !== "undefined") {
    anime({
      targets: ".reveal-item",
      opacity: [0, 1],
      translateY: [12, 0],
      delay: anime.stagger(60),
      easing: "easeOutCubic",
      duration: 550,
    });
  }
}

function showAuth() {
  currentUser = null;
  tasks = [];
  authSection.classList.remove("hidden");
  dashboardSection.classList.add("hidden");
  renderTasks();
  setAuthTab("login");
}

function updateStats() {
  const total = tasks.length;
  const pending = tasks.filter((task) => !task.completed).length;
  const completed = tasks.filter((task) => task.completed).length;
  const completion = total ? Math.round((completed / total) * 100) : 0;

  totalCount.textContent = String(total);
  pendingCount.textContent = String(pending);
  completedCount.textContent = String(completed);
  completionRate.textContent = String(completion);

  if (typeof anime !== "undefined") {
    anime({
      targets: progressBar,
      width: `${completion}%`,
      easing: "easeOutQuart",
      duration: 450,
    });
  } else {
    progressBar.style.width = `${completion}%`;
  }
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "Something went wrong.");
  }

  return payload;
}

function renderEmptyState(container, message) {
  const li = document.createElement("li");
  li.className = "empty-state";
  li.textContent = message;
  container.appendChild(li);
}

function shouldIncludeTask(task, query) {
  const matchesQuery =
    !query ||
    task.title.toLowerCase().includes(query) ||
    (task.description || "").toLowerCase().includes(query);

  if (!matchesQuery) {
    return false;
  }

  if (activeFilter === "today") {
    const now = Date.now();
    const created = new Date(task.createdAt).getTime();
    return now - created <= 24 * 60 * 60 * 1000;
  }

  return true;
}

function openEditDialog(task) {
  editingTaskId = task._id;
  editTaskTitle.value = task.title;
  editTaskDescription.value = task.description || "";
  editTaskDialog.showModal();

  if (typeof anime !== "undefined") {
    anime({
      targets: ".edit-form",
      opacity: [0, 1],
      translateY: [8, 0],
      easing: "easeOutQuad",
      duration: 220,
    });
  }
}

function closeEditDialog() {
  editingTaskId = null;
  editTaskForm.reset();
  editTaskDialog.close();
}

function createTaskItem(task) {
  const node = taskItemTemplate.content.firstElementChild.cloneNode(true);

  const title = node.querySelector(".task-title");
  const desc = node.querySelector(".task-desc");
  const toggleBtn = node.querySelector(".toggle-btn");
  const editBtn = node.querySelector(".edit-btn");
  const deleteBtn = node.querySelector(".delete-btn");

  title.textContent = task.title;
  desc.textContent = task.description || "No description";

  toggleBtn.textContent = task.completed ? "Mark Pending" : "Mark Done";

  toggleBtn.addEventListener("click", async () => {
    try {
      await updateTask(task._id, { completed: !task.completed });
      taskMessage.textContent = "Task status updated.";
    } catch (error) {
      taskMessage.textContent = error.message;
    }
  });

  editBtn.addEventListener("click", async () => {
    openEditDialog(task);
  });

  deleteBtn.addEventListener("click", async () => {
    const confirmDelete = confirm("Delete this task?");
    if (!confirmDelete) {
      return;
    }

    try {
      await api(`/api/tasks/${task._id}`, { method: "DELETE" });
      await loadTasks();
      taskMessage.textContent = "Task deleted.";
    } catch (error) {
      taskMessage.textContent = error.message;
    }
  });

  return node;
}

function renderTasks() {
  pendingTasks.innerHTML = "";
  completedTasks.innerHTML = "";
  const query = (taskSearch.value || "").trim().toLowerCase();

  const filteredTasks = tasks.filter((task) => shouldIncludeTask(task, query));
  const pending = filteredTasks.filter((task) => !task.completed);
  const completed = filteredTasks.filter((task) => task.completed);

  pendingVisibleCount.textContent = String(pending.length);
  completedVisibleCount.textContent = String(completed.length);

  if (!pending.length) {
    renderEmptyState(pendingTasks, "No pending tasks.");
  } else {
    pending.forEach((task) => pendingTasks.appendChild(createTaskItem(task)));
  }

  if (!completed.length) {
    renderEmptyState(completedTasks, "No completed tasks yet.");
  } else {
    completed.forEach((task) => completedTasks.appendChild(createTaskItem(task)));
  }

  updateStats();

  if (typeof anime !== "undefined") {
    anime({
      targets: ".task-item",
      opacity: [0, 1],
      translateY: [8, 0],
      scale: [0.98, 1],
      delay: anime.stagger(40),
      duration: 380,
      easing: "easeOutCubic",
    });
  }
}

async function loadTasks() {
  const data = await api("/api/tasks");
  tasks = data.tasks || [];
  renderTasks();
}

async function updateTask(taskId, body) {
  await api(`/api/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  await loadTasks();
}

showLoginBtn.addEventListener("click", () => setAuthTab("login"));
showRegisterBtn.addEventListener("click", () => setAuthTab("register"));

taskSearch.addEventListener("input", () => {
  renderTasks();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter || "all";
    filterButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
    });
    renderTasks();
  });
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  authMessage.textContent = "";

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const data = await api("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    showDashboard(data.user);
    await loadTasks();
    loginForm.reset();
  } catch (error) {
    authMessage.textContent = error.message;
  }
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  authMessage.textContent = "";

  const username = document.getElementById("registerUsername").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  try {
    const data = await api("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });

    showDashboard(data.user);
    await loadTasks();
    registerForm.reset();
  } catch (error) {
    authMessage.textContent = error.message;
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    await api("/api/auth/logout", { method: "POST" });
  } finally {
    showAuth();
  }
});

addTaskForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  taskMessage.textContent = "";

  const title = document.getElementById("taskTitle").value;
  const description = document.getElementById("taskDescription").value;

  try {
    await api("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title, description }),
    });
    addTaskForm.reset();
    await loadTasks();
    taskMessage.textContent = "Task added.";
  } catch (error) {
    taskMessage.textContent = error.message;
  }
});

cancelEditBtn.addEventListener("click", () => {
  closeEditDialog();
});

editTaskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!editingTaskId) {
    return;
  }

  try {
    await updateTask(editingTaskId, {
      title: editTaskTitle.value,
      description: editTaskDescription.value,
    });
    closeEditDialog();
    taskMessage.textContent = "Task updated.";
  } catch (error) {
    taskMessage.textContent = error.message;
  }
});

editTaskDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeEditDialog();
});

async function bootstrap() {
  animateIntro();

  try {
    const data = await api("/api/auth/me");
    showDashboard(data.user);
    await loadTasks();
  } catch {
    showAuth();
  }
}

bootstrap();
