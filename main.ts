import {userStatus, createUser, sortSelect, filterSelect} from "./src/services/index";
import {closeModal} from "./src/ui/index";


const createUserBtn = document.getElementById("createUserBtn") as HTMLButtonElement;
const confirmNoBtn = document.getElementById("confirmNo") as HTMLButtonElement;

sortSelect.onchange = userStatus;
filterSelect.onchange = userStatus;
confirmNoBtn.onclick = closeModal;
createUserBtn.onclick = createUser;