// Dashboard
const totalUsersEl = document.getElementById("totalUsers");
const activeUsersEl = document.getElementById("activeUsers");
const inactiveUsersEl = document.getElementById("inactiveUsers");
const pendingTasksEl = document.getElementById("pendingTasks");
const completedTasksEl = document.getElementById("completedTasks");
const totalTasksEl = document.getElementById("totalTasks");
const modalOverlay = document.getElementById("modalOverlay");
function closeModal() {
    modalOverlay.classList.add("hidden");
}
function showStats(users) {
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
function createUserCard(user) {
    // Placeholder - will be implemented in renderUser
    return document.createElement("div");
}
export { closeModal, showStats, createUserCard };
