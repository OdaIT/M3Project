var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var users = [];

// Inputs
var nameInput = document.getElementById("nameInput");
var emailInput = document.getElementById("emailInput");
var createUserBtn = document.getElementById("createUserBtn");
var usersDiv = document.getElementById("users");
var errorMsg = document.getElementById("error");

// Dashboard
var totalUsersEl = document.getElementById("totalUsers");
var activeUsersEl = document.getElementById("activeUsers");
var inactiveUsersEl = document.getElementById("inactiveUsers");
var pendingTasksEl = document.getElementById("pendingTasks");
var completedTasksEl = document.getElementById("completedTasks");
var totalTasksEl = document.getElementById("totalTasks");

// Filtros
var sortSelect = document.getElementById("sortSelect");
var filterSelect = document.getElementById("filterSelect");

// Modal
var modalOverlay = document.getElementById("modalOverlay");
var confirmYesBtn = document.getElementById("confirmYes");
var confirmNoBtn = document.getElementById("confirmNo");
var pendingUser = null;
var pendingTaskText = "";

// Data
function now() {
    var d = new Date();
    var day = String(d.getDate()).padStart(2, "0");
    var month = String(d.getMonth() + 1).padStart(2, "0");
    var year = d.getFullYear();
    var hours = String(d.getHours()).padStart(2, "0");
    var minutes = String(d.getMinutes()).padStart(2, "0");
    return "".concat(day, "/").concat(month, "/").concat(year, " ").concat(hours, ":").concat(minutes);
}

createUserBtn.onclick = createUser;
sortSelect.onchange = userStatus;
filterSelect.onchange = userStatus;

// Criação do user
function createUser() {
    var name = nameInput.value.trim();
    var email = emailInput.value.trim();
    errorMsg.textContent = "";
    if (!name || !email) {
        errorMsg.textContent = "Name and email are required";
        return;
    }
    if (users.some(function (u) { return u.email === email; })) {
        errorMsg.textContent = "Email already exists";
        return;
    }
    users.push({ name: name, email: email, status: "active", tasks: [] });
    nameInput.value = "";
    emailInput.value = "";
    userStatus();
}
// Estatisticas do user
function userStatus() {
    usersDiv.innerHTML = "";
    var visibleUsers = __spreadArray([], users, true);
    // Filter
    if (filterSelect.value === "active") {
        visibleUsers = visibleUsers.filter(function (u) { return u.status === "active"; });
    }
    else if (filterSelect.value === "inactive") {
        visibleUsers = visibleUsers.filter(function (u) { return u.status === "inactive"; });
    }
    // Sort
    if (sortSelect.value === "az") {
        visibleUsers.sort(function (a, b) { return a.name.localeCompare(b.name); });
    }
    else {
        visibleUsers.sort(function (a, b) { return b.tasks.length - a.tasks.length; });
    }
    visibleUsers.forEach(function (user) { return createUserCard(user); });
    showStats();
}

function createUserCard(user) {
    var userIndex = users.indexOf(user);
    var userDiv = document.createElement("div");
    userDiv.className = "user";
    var title = document.createElement("h2");
    title.textContent = "".concat(user.name, " (").concat(user.email, ")");
    var status = document.createElement("span");
    status.textContent = user.status.toUpperCase();
    status.className = "status ".concat(user.status);
    var toggleStatusBtn = document.createElement("button");
    toggleStatusBtn.textContent =
        user.status === "active" ? "Set Inactive" : "Set Active";
    toggleStatusBtn.onclick = function () {
        user.status = user.status === "active" ? "inactive" : "active";
        userStatus();
    };
    var deleteUserBtn = document.createElement("button");
    deleteUserBtn.textContent = "Delete User";
    deleteUserBtn.onclick = function () {
        users.splice(userIndex, 1);
        userStatus();
    };
    var taskInput = document.createElement("input");
    taskInput.placeholder = "New task";
    var addTaskBtn = document.createElement("button");
    addTaskBtn.textContent = "Add Task";
    addTaskBtn.onclick = function () { return addTaskUser(user, taskInput.value); };
    var taskList = document.createElement("ul");
    user.tasks.forEach(function (task, taskIndex) {
        var li = document.createElement("li");
        var text = document.createElement("span");
        text.textContent =
            task.completed && task.completionTime
                ? "[".concat(task.completionTime, "] ").concat(task.text)
                : task.text;
        if (task.completed)
            text.classList.add("done");
        var editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = function () {
            var newText = prompt("Edit task", task.text);
            if (newText) {
                task.text = newText;
                userStatus();
            }
        };
        var completeBtn = document.createElement("button");
        completeBtn.textContent = task.completed ? "Undo" : "Complete";
        completeBtn.onclick = function () {
            task.completed = !task.completed;
            if (task.completed) {
                task.completionTime = now();
            }
            else {
                delete task.completionTime;
            }
            userStatus();
        };
        var deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = function () {
            user.tasks.splice(taskIndex, 1);
            userStatus();
        };
        var buttonsRow = document.createElement("div");
        buttonsRow.className = "task-buttons";
        buttonsRow.append(completeBtn, editBtn, deleteBtn);
        li.append(text, buttonsRow);
        taskList.appendChild(li);
    });
    userDiv.append(title, status, toggleStatusBtn, deleteUserBtn, document.createElement("br"), taskInput, addTaskBtn, taskList);
    usersDiv.appendChild(userDiv);
}
// Modal
function addTaskUser(user, text) {
    var taskText = text.trim();
    if (!taskText)
        return;
    if (user.tasks.some(function (t) { return t.text.toLowerCase() === taskText.toLowerCase(); })) {
        pendingUser = user;
        pendingTaskText = taskText;
        modalOverlay.classList.remove("hidden");
        return;
    }
    user.tasks.push({ text: taskText, completed: false });
    userStatus();
}

confirmYesBtn.onclick = function () {
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
    activeUsersEl.textContent = users.filter(function (u) { return u.status === "active"; }).length.toString();
    inactiveUsersEl.textContent = users.filter(function (u) { return u.status === "inactive"; }).length.toString();
    var pending = 0;
    var completed = 0;
    users.forEach(function (u) {
        return u.tasks.forEach(function (t) { return (t.completed ? completed++ : pending++); });
    });
    var total = pending + completed;
    totalTasksEl.textContent = total.toString();
    pendingTasksEl.textContent = pending.toString();
    completedTasksEl.textContent = completed.toString();
}
