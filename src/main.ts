import {userStatus, createUser, sortSelect, filterSelect, users, usersDiv} from "./services/index.js";
import {closeModal, setUserStatus, setRenderContext} from "./ui/index.js";


const createUserBtn = document.getElementById("createUserBtn") as HTMLButtonElement;
const confirmNoBtn = document.getElementById("confirmNo") as HTMLButtonElement;

// Initialize UI context after all modules are loaded
setUserStatus(userStatus, users);
setRenderContext(userStatus, users, usersDiv);

sortSelect.onchange = userStatus;
filterSelect.onchange = userStatus;
confirmNoBtn.onclick = closeModal;
createUserBtn.onclick = createUser;