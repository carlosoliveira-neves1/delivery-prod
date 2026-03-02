import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchStore } from "@/lib/mockApi";

const AuthContext = createContext(null);

function useMockAuth() {
  const [user, setUser] = useState({ id: "admin-1", name: "Carlos Oliveira", role: "admin" });
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [store, setStore] = useState(null);

  const login = async (role = "user", userData = null) => {
    // Se userData foi fornecido, usar esses dados, senão usar role simples
    if (userData) {
      setUser(userData);
    } else {
      setUser({ role });
    }
    
    // Simular busca de dados da loja
    try {
      const storeData = await fetchStore();
      setStore(storeData);
    } catch (error) {
      console.error("Erro ao buscar dados da loja:", error);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return {
    user,
    isLoadingAuth,
    authError,
    login,
    logout,
    store,
  };
}

export function AuthProvider({ children }) {
  const auth = useMockAuth();
  const [store, setStore] = useState(null);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);

  useEffect(() => {
    fetchStore()
      .then((data) => setStore(data))
      .finally(() => setIsLoadingPublicSettings(false));
  }, []);

  const navigateToLogin = () => {
    // In a real app we'd redirect to a login page. For the mock just log in as admin automatically.
    auth.login("admin");
  };

  const value = useMemo(
    () => ({
      ...auth,
      store,
      isLoadingPublicSettings,
      navigateToLogin,
    }),
    [auth, store, isLoadingPublicSettings]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
