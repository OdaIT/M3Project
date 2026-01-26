"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const errorMsg = document.getElementById("error");
const createUserBtn = document.getElementById("createUserBtn");
function createUser() {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    errorMsg.textContent = "";
    function validateEmail(email_) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email_);
    }
    if (validateEmail(email) == false) {
        errorMsg.textContent = "Email invalid";
        return;
    }
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
const users = [];
createUserBtn.onclick = createUser;
//# sourceMappingURL=userService.js.map