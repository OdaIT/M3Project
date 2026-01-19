type Task = {
  text: string;
  completed: boolean;
  completionTime?: string;
};

type UserStatus = "active" | "inactive";

type User = {
  name: string;
  email: string;
  status: UserStatus;
  tasks: Task[];
};

const users: User[] = [];

// Inputs
const nameInput = document.getElementById("nameInput") as HTMLInputElement;
const emailInput = document.getElementById("emailInput") as HTMLInputElement;
const createUserBtn = document.getElementById("createUserBtn") as HTMLButtonElement;
const usersDiv = document.getElementById("users") as HTMLDivElement;
const errorMsg = document.getElementById("error") as HTMLParagraphElement;

// Dashboard
const totalUsersEl = document.getElementById("totalUsers") as HTMLSpanElement;
const activeUsersEl = document.getElementById("activeUsers") as HTMLSpanElement;
const inactiveUsersEl = document.getElementById("inactiveUsers") as HTMLSpanElement;
const pendingTasksEl = document.getElementById("pendingTasks") as HTMLSpanElement;
const completedTasksEl = document.getElementById("completedTasks") as HTMLSpanElement;
const totalTasksEl = document.getElementById("totalTasks") as HTMLSpanElement;

// Filtros
const sortSelect = document.getElementById("sortSelect") as HTMLSelectElement;
const filterSelect = document.getElementById("filterSelect") as HTMLSelectElement;

// Modal
const modalOverlay = document.getElementById("modalOverlay") as HTMLDivElement;
const confirmYesBtn = document.getElementById("confirmYes") as HTMLButtonElement;
const confirmNoBtn = document.getElementById("confirmNo") as HTMLButtonElement;

let pendingUser: User | null = null;
let pendingTaskText = "";

// Data
function now(): string {
  const d = new Date();

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

createUserBtn.onclick = createUser;
sortSelect.onchange = userStatus;
filterSelect.onchange = userStatus;

// Criação do user
function createUser() {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  errorMsg.textContent = "";

  if (!name || !email) {
    errorMsg.textContent = "Name and email are required";
    return;
  }

  if (users.some(u => u.email === email)) {
    errorMsg.textContent = "Email already exists";
    return;
  }

  users.push({ name, email, status: "active", tasks: [] });
  nameInput.value = "";
  emailInput.value = "";
  userStatus();
}

// Estatisticas do user
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
  showStats();
}

function createUserCard(user: User) {
  const userIndex = users.indexOf(user);

  const userDiv = document.createElement("div");
  userDiv.className = "user";

  const title = document.createElement("h2");
  title.textContent = `${user.name} (${user.email})`;

  const status = document.createElement("span");
  status.textContent = user.status.toUpperCase();
  status.className = `status ${user.status}`;

  const toggleStatusBtn = document.createElement("button");
  toggleStatusBtn.textContent =
    user.status === "active" ? "Set Inactive" : "Set Active";
  toggleStatusBtn.onclick = () => {
    user.status = user.status === "active" ? "inactive" : "active";
    userStatus();
  };

  const deleteUserBtn = document.createElement("button");
  deleteUserBtn.textContent = "Delete User";
  deleteUserBtn.onclick = () => {
    users.splice(userIndex, 1);
    userStatus();
  };

  const taskInput = document.createElement("input");
  taskInput.placeholder = "New task";

  const addTaskBtn = document.createElement("button");
  addTaskBtn.textContent = "Add Task";
  addTaskBtn.onclick = () => addTaskUser(user, taskInput.value);

  const taskList = document.createElement("ul");

  user.tasks.forEach((task, taskIndex) => {
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.textContent =
      task.completed && task.completionTime
        ? `[${task.completionTime}] ${task.text}`
        : task.text;

    if (task.completed) text.classList.add("done");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => {
      const newText = prompt("Edit task", task.text);
      if (newText) {
        task.text = newText;
        userStatus();
      }
    };

    const completeBtn = document.createElement("button");
    completeBtn.textContent = task.completed ? "Undo" : "Complete";
    completeBtn.onclick = () => {
      task.completed = !task.completed;
      if (task.completed) {
        task.completionTime = now();
      } else {
        delete task.completionTime;
      }
      userStatus();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => {
      user.tasks.splice(taskIndex, 1);
      userStatus();
    };

    li.append(text, completeBtn, editBtn, deleteBtn);
    taskList.appendChild(li);
    }
  );

  userDiv.append(
    title,
    status,
    toggleStatusBtn,
    deleteUserBtn,
    document.createElement("br"),
    taskInput,
    addTaskBtn,
    taskList
  );

  usersDiv.appendChild(userDiv);
}

// Add task with modal
function addTaskUser(user: User, text: string) {
  const taskText = text.trim();
  if (!taskText) return;

  if (user.tasks.some(t => t.text.toLowerCase() === taskText.toLowerCase())) {
    pendingUser = user;
    pendingTaskText = taskText;
    modalOverlay.classList.remove("hidden");
    return;
  }

  user.tasks.push({ text: taskText, completed: false });
  userStatus();
}

// Modal
confirmYesBtn.onclick = () => {
  if (pendingUser && pendingTaskText) {
    pendingUser.tasks.push({ text: pendingTaskText, completed: false });
  }
  closeModal();
  userStatus();
};

confirmNoBtn.onclick = closeModal;

function closeModal() {
  pendingUser = null;
  pendingTaskText = "";
  modalOverlay.classList.add("hidden");
}

// Dashboard stats
function showStats() {
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
