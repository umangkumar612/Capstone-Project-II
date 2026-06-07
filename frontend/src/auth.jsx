import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUser, loginUser, registerUser } from "./api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("authUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("authToken")));

  useEffect(() => {
    let alive = true;
    async function loadUser() {
      if (!localStorage.getItem("authToken")) {
        setLoading(false);
        return;
      }
      try {
        const currentUser = await getCurrentUser();
        if (alive) {
          setUser(currentUser);
          localStorage.setItem("authUser", JSON.stringify(currentUser));
        }
      } catch {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        if (alive) setUser(null);
      } finally {
        if (alive) setLoading(false);
      }
    }
    loadUser();
    return () => {
      alive = false;
    };
  }, []);

  async function signIn(payload) {
    const data = await loginUser(payload);
    persistAuth(data);
    return data.user;
  }

  async function signUp(payload) {
    const data = await registerUser(payload);
    persistAuth(data);
    return data.user;
  }


  function signOut() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setUser(null);
  }

  function persistAuth(data) {
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("authUser", JSON.stringify(data.user));
    setUser(data.user);
  }

  const value = useMemo(() => ({ user, loading, signIn, signUp, signOut }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
