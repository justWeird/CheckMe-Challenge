
import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import axios from "axios";
import {jwtDecode} from "jwt-decode";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  picture?: string;
}

interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface Props {
  children: ReactNode;
}




export const AuthProvider = ({ children }: Props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      fetchUserData(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);


  const fetchUserData = async (authToken: string) => {
    try {
      const response = await axios.get("http://localhost:5050/auth/user", {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      const userData = response.data?.data;

      setUser({
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role?.toLowerCase(),
      });
    } catch (error) {
      logout();
    } finally {
      setIsLoading(false); // ✅ always call this once fetch finishes
    }
  };

  // In the login function in AuthContext.tsx
  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setIsAuthenticated(true); // Make sure this is set before fetching user data
    fetchUserData(newToken);
  };

  const logout = async () => {
    const authToken = localStorage.getItem("token");
    
    if (authToken) {
      try {
        await axios.get("http://localhost:5050/auth/logout", {
          headers: { Authorization: `Bearer ${authToken}` }
        });
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }

    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false); // ✅ reset auth status
  };

  return (
      <AuthContext.Provider
          value={{
            user,
            token,
            isLoading,
            isAuthenticated,
            login,
            logout,
          }}
      >
      {children}
    </AuthContext.Provider>
  );
};
