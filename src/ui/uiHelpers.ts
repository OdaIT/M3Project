import type { User } from "../models/index.js";

// Dashboard
const totalUsersEl = document.getElementById("totalUsers") as HTMLSpanElement;
const activeUsersEl = document.getElementById("activeUsers") as HTMLSpanElement;
const inactiveUsersEl = document.getElementById("inactiveUsers") as HTMLSpanElement;
const pendingTasksEl = document.getElementById("pendingTasks") as HTMLSpanElement;
const completedTasksEl = document.getElementById("completedTasks") as HTMLSpanElement;
const totalTasksEl = document.getElementById("totalTasks") as HTMLSpanElement;

const modalOverlay = document.getElementById("modalOverlay") as HTMLDivElement;

function closeModal() {
  modalOverlay.classList.add("hidden");
}

function showStats(users: User[]) {
  totalUsersEl.textContent = users.length.toString();
  activeUsersEl.textContent = users.filter(u => u.status === "active").length.toString();
  inactiveUsersEl.textContent = users.filter(u => u.status === "inactive").length.toString();

  let pending = 0;
  let completed = 0;

  users.forEach(u =>
    u.tasks.forEach(t => (t.completed ? completed++ : pending++))
  );

  let total = pending + completed;

  totalTasksEl.textContent = total.toString();
  pendingTasksEl.textContent = pending.toString();
  completedTasksEl.textContent = completed.toString();
}

function createUserCard(user: User) {
  // Placeholder - will be implemented in renderUser
  return document.createElement("div");
}

export { closeModal, showStats, createUserCard };
