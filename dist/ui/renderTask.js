import { users, pendingTaskText, pendingUser } from "../services/index";
import { userStatus } from "../services/index";
export { closeModal, showStats, addTaskUser };
// Dashboard
const totalUsersEl = document.getElementById("totalUsers");
const activeUsersEl = document.getElementById("activeUsers");
const inactiveUsersEl = document.getElementById("inactiveUsers");
const pendingTasksEl = document.getElementById("pendingTasks");
const completedTasksEl = document.getElementById("completedTasks");
const totalTasksEl = document.getElementById("totalTasks");
let pendingTT = pendingTaskText;
let pendingU = pendingUser;
function showStats() {
    totalUsersEl.textContent = users.length.toString();
    activeUsersEl.textContent = users.filter(u => u.status === "active").length.toString();
    inactiveUsersEl.textContent = users.filter(u => u.status === "inactive").length.toString();
    let pending = 0;
    let completed = 0;
    users.forEach(u => u.tasks.forEach(t => (t.completed ? completed++ : pending++)));
    let total = pending + completed;
    totalTasksEl.textContent = total.toString();
    pendingTasksEl.textContent = pending.toString();
    completedTasksEl.textContent = completed.toString();
}
const modalOverlay = document.getElementById("modalOverlay");
function closeModal() {
    pendingU = null;
    pendingTT = "";
    modalOverlay.classList.add("hidden");
}
// Add task with modal
function addTaskUser(user, text) {
    const taskText = text.trim();
    if (!taskText)
        return;
    if (user.tasks.some(t => t.text.toLowerCase() === taskText.toLowerCase())) {
        pendingU = user;
        pendingTT = taskText;
        modalOverlay.classList.remove("hidden");
        return;
    }
    user.tasks.push({ text: taskText, completed: false });
    userStatus();
}
