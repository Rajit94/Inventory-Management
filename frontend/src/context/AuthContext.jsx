/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import API, { AUTH_STORAGE_KEYS, clearStoredSession, readStoredToken, readStoredUser, writeStoredSession } from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(readStoredToken());
  const [user, setUser] = useState(readStoredUser());
  const [checking, setChecking] = useState(Boolean(readStoredToken()));

  useEffect(() => {
    const storedToken = readStoredToken();
    if (!storedToken) {
      return;
    }

    API.get("/auth/me")
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        clearStoredSession();
        setToken(null);
        setUser(null);
      })
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    const onSessionExpired = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener("auth:session-expired", onSessionExpired);
    return () => window.removeEventListener("auth:session-expired", onSessionExpired);
  }, []);

  const login = (authResponse) => {
    writeStoredSession(authResponse);
    setToken(authResponse.access_token);
    setUser(authResponse.user);
  };

  const logout = () => {
    clearStoredSession();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      checking,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
      storageKeys: AUTH_STORAGE_KEYS,
    }),
    [token, user, checking],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
