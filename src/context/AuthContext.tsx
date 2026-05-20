import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User, UserRole } from "../types";
import { storage, uid } from "../utils/storage";

interface SignupData {
  role: UserRole;
  name: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  interests: string[];
  bio?: string;
  farmSizeAcres?: number;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  signup: (data: SignupData) => { ok: boolean; error?: string };
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
  markOnboardingComplete: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const COLORS = ["#16a34a", "#a16207", "#2563eb", "#db2777", "#7c3aed", "#ea580c"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storage.init();
    const id = storage.getCurrentUserId();
    if (id) {
      const u = storage.getUsers().find((x) => x.id === id) || null;
      setUser(u);
    }
    setLoading(false);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const users = storage.getUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return { ok: false, error: "Invalid email or password." };
    storage.setCurrentUserId(found.id);
    setUser(found);
    return { ok: true };
  }, []);

  const signup = useCallback((data: SignupData) => {
    const users = storage.getUsers();
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { ok: false, error: "An account with this email already exists." };
    }
    const newUser: User = {
      id: uid("user"),
      role: data.role,
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      location: data.location,
      bio: data.bio,
      interests: data.interests,
      farmSizeAcres: data.farmSizeAcres,
      avatarColor: COLORS[Math.floor(Math.random() * COLORS.length)],
      createdAt: new Date().toISOString(),
      hasCompletedOnboarding: false,
    };
    storage.setUsers([...users, newUser]);
    storage.setCurrentUserId(newUser.id);
    setUser(newUser);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    storage.setCurrentUserId(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    (patch: Partial<User>) => {
      if (!user) return;
      const users = storage.getUsers();
      const updated = users.map((u) => (u.id === user.id ? { ...u, ...patch } : u));
      storage.setUsers(updated);
      const me = updated.find((u) => u.id === user.id) || null;
      setUser(me);
    },
    [user]
  );

  const markOnboardingComplete = useCallback(() => {
    updateProfile({ hasCompletedOnboarding: true });
  }, [updateProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, signup, logout, updateProfile, markOnboardingComplete }),
    [user, loading, login, signup, logout, updateProfile, markOnboardingComplete]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
