import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStore } from "@/lib/mockApi";
import { getUserService, initializeUserService } from "@/lib/userService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [store, setStore] = useState(null);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);

  useEffect(() => {
    (async () => {
      await initializeUserService();
      const service = getUserService();
      setUser(service.getCurrentUser());
      setCompany(service.getCurrentCompany());
      setIsLoadingAuth(false);
    })();
  }, []);

  useEffect(() => {
    fetchStore()
      .then((data) => setStore(data))
      .finally(() => setIsLoadingPublicSettings(false));
  }, []);

  const login = async ({ email, password, companyCode }) => {
    setIsLoadingAuth(true);
    setAuthError(null);
    const service = getUserService();
    const result = await service.loginUser(email, password, companyCode);
    if (result.success) {
      setUser(result.user);
      setCompany(result.company);
    } else {
      setAuthError({ message: result.error });
    }
    setIsLoadingAuth(false);
    return result;
  };

  const logout = () => {
    getUserService().logout();
    setUser(null);
    setCompany(null);
    navigate("/", { replace: true });
  };

  const navigateToLogin = () => {
    setAuthError({ message: "Faça login para continuar" });
  };

  const value = useMemo(
    () => ({
      user,
      company,
      isLoadingAuth,
      authError,
      login,
      logout,
      store,
      isLoadingPublicSettings,
      navigateToLogin,
      isLoggedOut,
    }),
    [user, company, isLoadingAuth, authError, store, isLoadingPublicSettings, isLoggedOut]
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
