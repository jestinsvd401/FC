import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "./api";
import type { PublicUser } from "./types";
import type { Role } from "../shared/marketplace";

interface AuthValue {
  user: PublicUser | null;
  ready: boolean;
  cartCount: number;
  refresh: () => Promise<PublicUser | null>;
  refreshCart: () => Promise<void>;
  login: (email: string, password: string) => Promise<PublicUser>;
  register: (body: Record<string, unknown>) => Promise<PublicUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [ready, setReady] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = useCallback(async (role?: Role | null) => {
    const nextRole = role === undefined ? user?.role : role;
    if (nextRole !== "buyer") {
      setCartCount(0);
      return;
    }
    const cart = await api<{ items: { quantity: number }[] }>("/api/cart");
    setCartCount(cart.items.reduce((sum, item) => sum + item.quantity, 0));
  }, [user?.role]);

  const refresh = useCallback(async () => {
    const data = await api<{ user: PublicUser | null }>("/api/auth/me");
    setUser(data.user);
    await refreshCart(data.user?.role ?? null);
    return data.user;
  }, [refreshCart]);

  useEffect(() => {
    refresh()
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, [refresh]);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      ready,
      cartCount,
      refresh,
      refreshCart: () => refreshCart(),
      async login(email, password) {
        const data = await api<{ user: PublicUser }>("/api/auth/login", {
          method: "POST",
          body: { email, password },
        });
        setUser(data.user);
        await refreshCart(data.user.role);
        return data.user;
      },
      async register(body) {
        const data = await api<{ user: PublicUser }>("/api/auth/register", {
          method: "POST",
          body,
        });
        setUser(data.user);
        await refreshCart(data.user.role);
        return data.user;
      },
      async logout() {
        await api("/api/auth/logout", { method: "POST", body: {} });
        setUser(null);
        setCartCount(0);
      },
    }),
    [user, ready, cartCount, refresh, refreshCart],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("AuthProvider is missing.");
  return value;
}
