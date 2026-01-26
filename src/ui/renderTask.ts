import type { User } from "../models/index.js";

// Dashboard
const totalUsersEl = document.getElementById("totalUsers") as HTMLSpanElement;
const activeUsersEl = document.getElementById("activeUsers") as HTMLSpanElement;
const inactiveUsersEl = document.getElementById("inactiveUsers") as HTMLSpanElement;
const pendingTasksEl = document.getElementById("pendingTasks") as HTMLSpanElement;
const completedTasksEl = document.getElementById("completedTasks") as HTMLSpanElement;
const totalTasksEl = document.getElementById("totalTasks") as HTMLSpanElement;

let pendingTT = "";
let pendingU: User | null = null;
let userStatusFn: (() => void) | null = null;
let usersList: User[] = [];

function setUserStatus(fn: () => void, users: User[]) {
  userStatusFn = fn;
  usersList = users;
}

function showStats() {
  totalUsersEl.textContent = usersList.length.toString();
  activeUsersEl.textContent = usersList.filter(u => u.status === "active").length.toString();
  inactiveUsersEl.textContent = usersList.filter(u => u.status === "inactive").length.toString();

  let pending = 0;
  let completed = 0;

  usersList.forEach(u =>
    u.tasks.forEach(t => (t.completed ? completed++ : pending++))
  );

  let total = pending + completed;

  totalTasksEl.textContent = total.toString();
  pendingTasksEl.textContent = pending.toString();
  completedTasksEl.textContent = completed.toString();
}

const modalOverlay = document.getElementById("modalOverlay") as HTMLDivElement;

function closeModal() {
  pendingU = null;
  pendingTT = "";
  modalOverlay.classList.add("hidden");
}

// Add task with modal
function addTaskUser(user: User, text: string) {
  const taskText = text.trim();
  if (!taskText) return;

  if (user.tasks.some(t => t.text.toLowerCase() === taskText.toLowerCase())) {
    pendingU = user;
    pendingTT = taskText;
    modalOverlay.classList.remove("hidden");
    return;
  }

  user.tasks.push({ text: taskText, completed: false });
  if (userStatusFn) userStatusFn();
}

export {closeModal, showStats, addTaskUser, setUserStatus, pendingTT, pendingU};