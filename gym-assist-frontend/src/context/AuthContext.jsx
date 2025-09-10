// [FRONTEND] arquivo: gym-assist-frontend/src/context/AuthContext.jsx (VERSÃO COMPLETA E CORRIGIDA)
import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import {
  login as apiLogin,
  register as apiRegister,
} from "../services/authService";
import { getProfile } from "../services/profileService";
import { teacherUserMock } from "../mocks/userMocks";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [volume, setVolume] = useState(0.5);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const fetchAndSetUser = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const profileData = await getProfile();
        setUser(profileData);
      } catch (error) {
        console.error("Sessão inválida:", error);
        logout();
      }
    }
    setLoading(false);
  }, [logout]);

  useEffect(() => {
    fetchAndSetUser();
  }, [fetchAndSetUser]);

  // LÓGICA DE LOGIN ORIGINAL RESTAURADA
  const login = async (email, password) => {
    try {
      const data = await apiLogin(email, password);
      localStorage.setItem("authToken", data.token);

      const isTeacherTestMode = true;
      if (isTeacherTestMode) {
        setUser(teacherUserMock);
        localStorage.setItem("user", JSON.stringify(teacherUserMock));
      } else {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      logout();
      throw error;
    }
  };

  // NOVA LÓGICA DE REGISTRO
  const register = async (name, email, password) => {
    try {
      const data = await apiRegister(name, email, password);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const refetchUser = async () => {
    await fetchAndSetUser();
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    volume,
    setVolume,
    refetchUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
