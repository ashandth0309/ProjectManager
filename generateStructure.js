// generateStructure.js
import fs from "fs";
import path from "path";

const baseDir = process.cwd();

const structure = {
  "app": {
    "(auth)": {
      "login.tsx": "export default function Login() { return null; }",
      "register.tsx": "export default function Register() { return null; }",
      "admin-login.tsx": "export default function AdminLogin() { return null; }"
    },
    "(admin)": {
      "index.tsx": "export default function AdminDashboard() { return null; }",
      "project-detail.tsx": "export default function ProjectDetail() { return null; }",
      "sprint-detail.tsx": "export default function SprintDetail() { return null; }",
      "add-project.tsx": "export default function AddProject() { return null; }"
    },
    "(user)": {
      "index.tsx": "export default function UserDashboard() { return null; }",
      "tasks.tsx": "export default function UserTasks() { return null; }"
    },
    "_layout.tsx": "export default function Layout() { return null; }"
  },

  "components": {
    "dashboard": {
      "ProjectCard.tsx": "export default function ProjectCard() { return null; }",
      "SprintCard.tsx": "export default function SprintCard() { return null; }",
      "TaskCard.tsx": "export default function TaskCard() { return null; }",
      "TeamCard.tsx": "export default function TeamCard() { return null; }",
      "SummaryCharts.tsx": "export default function SummaryCharts() { return null; }",
      "TeamMemberPopup.tsx": "export default function TeamMemberPopup() { return null; }"
    },
    "common": {
      "Button.tsx": "export default function Button() { return null; }",
      "InputField.tsx": "export default function InputField() { return null; }",
      "Modal.tsx": "export default function Modal() { return null; }"
    },
    "layout": {
      "Header.tsx": "export default function Header() { return null; }",
      "Sidebar.tsx": "export default function Sidebar() { return null; }",
      "Footer.tsx": "export default function Footer() { return null; }"
    }
  },

  "constants": {
    "colors.ts": "export const COLORS = { primary: '#FF0000', secondary: '#000' };",
    "roles.ts": "export const ROLES = { ADMIN: 'admin', USER: 'user' };",
    "teams.ts": "export const TEAMS = { ASHANDTH: 'Ashandth Team', MADHUKA: 'Madhuka Team' };"
  },

  "hooks": {
    "useAuth.ts": "export default function useAuth() { return {}; }",
    "useProjects.ts": "export default function useProjects() { return {}; }",
    "useTeams.ts": "export default function useTeams() { return {}; }"
  },

  "lib": {
    "firebase.ts": "export const firebaseInit = {};",
    "authService.ts": "export const authService = {};",
    "projectService.ts": "export const projectService = {};",
    "teamService.ts": "export const teamService = {};"
  },

  "navigation": {
    "AdminNavigator.tsx": "export default function AdminNavigator() { return null; }",
    "UserNavigator.tsx": "export default function UserNavigator() { return null; }",
    "RootNavigator.tsx": "export default function RootNavigator() { return null; }"
  },

  "utils": {
    "formatDate.ts": "export const formatDate = () => {};",
    "calculateDays.ts": "export const calculateDays = () => {};",
    "generateInitials.ts": "export const generateInitials = () => {};",
    "storageHelper.ts": "export const storageHelper = {};"
  },

  "types": {
    "project.ts": "export interface Project { id: string; name: string; startDate: string; }",
    "sprint.ts": "export interface Sprint { id: string; name: string; }",
    "team.ts": "export interface Team { id: string; name: string; members: string[]; }",
    "user.ts": "export interface User { id: string; name: string; role: string; teamId: string; }"
  }
};

function createStructure(base, obj) {
  for (const key in obj) {
    const targetPath = path.join(base, key);
    if (typeof obj[key] === "string") {
      fs.writeFileSync(targetPath, obj[key]);
    } else {
      if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath);
      createStructure(targetPath, obj[key]);
    }
  }
}

createStructure(baseDir, structure);
console.log("✅ Folder structure created successfully!");
