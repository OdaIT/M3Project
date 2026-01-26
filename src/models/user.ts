import type {Task} from './task.js';


interface User {
  name: string;
  email: string;
  status: "active" | "inactive";
  tasks: Task[];
};

export type {User};