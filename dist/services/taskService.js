import { users } from '../services/index';
import { showStats, closeModal, createUserCard } from 'ui/index';
export { userStatus, pendingTaskText, pendingUser, usersDiv, sortSelect, filterSelect };
// Estatisticas do user
const sortSelect = document.getElementById("sortSelect");
const filterSelect = document.getElementById("filterSelect");
const usersDiv = document.getElementById("users");
function userStatus() {
    usersDiv.innerHTML = "";
    let visibleUsers = [...users];
    // Filter
    if (filterSelect.value === "active") {
        visibleUsers = visibleUsers.filter(u => u.status === "active");
    }
    else if (filterSelect.value === "inactive") {
        visibleUsers = visibleUsers.filter(u => u.status === "inactive");
    }
    // Sort
    if (sortSelect.value === "az") {
        visibleUsers.sort((a, b) => a.name.localeCompare(b.name));
    }
    else {
        visibleUsers.sort((a, b) => b.tasks.length - a.tasks.length);
    }
    visibleUsers.forEach(user => createUserCard(user));
    showStats();
}
// Modal
const confirmYesBtn = document.getElementById("confirmYes");
let pendingUser = null;
let pendingTaskText = "";
confirmYesBtn.onclick = () => {
    if (pendingUser && pendingTaskText) {
        pendingUser.tasks.push({ text: pendingTaskText, completed: false });
    }
    closeModal();
    userStatus();
};
