import { users } from './index.js';
import type { User } from '../models/index.js';
import { showStats, closeModal, createUserCard } from '../ui/uiHelpers.js';


// Estatisticas do user
const sortSelect = document.getElementById("sortSelect") as HTMLSelectElement;
const filterSelect = document.getElementById("filterSelect") as HTMLSelectElement;
const usersDiv = document.getElementById("users") as HTMLDivElement;

function userStatus() {
  usersDiv.innerHTML = "";

  let visibleUsers = [...users];

// Filter
if (filterSelect.value === "active") {
visibleUsers = visibleUsers.filter(u => u.status === "active");
} else if (filterSelect.value === "inactive") {
visibleUsers = visibleUsers.filter(u => u.status === "inactive");
}

// Sort
if (sortSelect.value === "az") {
visibleUsers.sort((a, b) => a.name.localeCompare(b.name));
} else {
visibleUsers.sort((a, b) => b.tasks.length - a.tasks.length);
}

visibleUsers.forEach(user => createUserCard(user));
showStats(users);
}

// Modal

const confirmYesBtn = document.getElementById("confirmYes") as HTMLButtonElement;

let pendingUser: User | null = null;
let pendingTaskText = "";

confirmYesBtn.onclick = () => {
  if (pendingUser && pendingTaskText) {
    pendingUser.tasks.push({ text: pendingTaskText, completed: false });
  }
  closeModal();
  userStatus();
};

export {userStatus, pendingTaskText, pendingUser, usersDiv, sortSelect, filterSelect};