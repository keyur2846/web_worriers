import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  bio: string;
  avatar: string;
  social: {
    linkedin: string;
    instagram: string;
    facebook: string;
    twitter: string;
  };
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  signUp: (name: string, email: string, password: string) => boolean;
  signIn: (email: string, password: string) => boolean;
  signOut: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const USERS_KEY = "mission-intel-users";
const SESSION_KEY = "mission-intel-session";

function getUsers(): Record<string, User & { password: string }> {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : {};
}

function saveUsers(users: Record<string, User & { password: string }>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession(): User | null {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

function saveSession(user: User | null) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: getSession(),
  isAuthenticated: !!getSession(),

  signUp: (name, email, password) => {
    const users = getUsers();
    if (users[email]) return false;

    const newUser: User & { password: string } = {
      id: crypto.randomUUID(),
      name,
      email,
      password,
      role: "Operative",
      bio: "",
      avatar: "",
      social: { linkedin: "", instagram: "", facebook: "", twitter: "" },
    };

    users[email] = newUser;
    saveUsers(users);

    const { password: _, ...user } = newUser;
    saveSession(user);
    set({ user, isAuthenticated: true });
    return true;
  },

  signIn: (email, password) => {
    const users = getUsers();
    const record = users[email];
    if (!record || record.password !== password) return false;

    const { password: _, ...user } = record;
    saveSession(user);
    set({ user, isAuthenticated: true });
    return true;
  },

  signOut: () => {
    saveSession(null);
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: (updates) => {
    set((state) => {
      if (!state.user) return state;
      const updated = { ...state.user, ...updates };
      saveSession(updated);

      const users = getUsers();
      if (users[updated.email]) {
        users[updated.email] = { ...users[updated.email], ...updates };
        saveUsers(users);
      }

      return { user: updated };
    });
  },
}));
