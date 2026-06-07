import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('chatsphere_user') || 'null');
  } catch {
    localStorage.removeItem('chatsphere_user');
    localStorage.removeItem('chatsphere_token');
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('chatsphere_token'));
  const [user, setUser] = useState(readStoredUser);
  const [booting, setBooting] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setBooting(false);
      return;
    }
    authService.me().then(setUser).catch(() => {
      localStorage.removeItem('chatsphere_token');
      localStorage.removeItem('chatsphere_user');
      setToken(null);
    }).finally(() => setBooting(false));
  }, [token]);

  const commitSession = (data) => {
    localStorage.setItem('chatsphere_token', data.token);
    localStorage.setItem('chatsphere_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const value = useMemo(() => ({
    token,
    user,
    booting,
    login: async (payload) => commitSession(await authService.login(payload)),
    register: async (payload) => commitSession(await authService.register(payload)),
    setUser,
    logout: async () => {
      try { await authService.logout(); } catch (_) {}
      localStorage.removeItem('chatsphere_token');
      localStorage.removeItem('chatsphere_user');
      setToken(null);
      setUser(null);
    },
  }), [token, user, booting]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
