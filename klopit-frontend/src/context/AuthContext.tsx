import React, { createContext, useContext, useState, useEffect } from "react";
import config from "../config";

interface UserType {
    username: string;
    isAdmin: boolean;
    // You can include other fields if desired, e.g., id, email, etc.
}

interface AuthContextType {
    user: UserType | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider: React.FC = ({ children }) => {
    const [user, setUser] = useState<UserType | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
        fetch(`${config.API_BASE_URL}/auth/current`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
            if (data.username) {
                // Set the user in state
                setUser({
                username: data.username,
                isAdmin: data.isAdmin,
                });
            }
            })
            .catch(() => {
            // If the token is invalid, remove it
            localStorage.removeItem("token");
            });
        }
    }, []);

    const login = async (email: string, password: string) => {
        const response = await fetch(`${config.API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (response.ok) {
        // Save the token
        localStorage.setItem("token", data.token);
    
        // data = { token, username, isAdmin }
        setUser({
            username: data.username,
            isAdmin: data.isAdmin,
        });
        } else {
        throw new Error(data.message || "Login failed");
        }
    };
    

    const signup = async (username: string, email: string, password: string) => {
        const response = await fetch(`${config.API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
        });
        if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Signup failed");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
        {children}
        </AuthContext.Provider>
    );
    };
