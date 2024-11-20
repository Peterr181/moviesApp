import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define types for user profile
interface UserProfile {
  username: string;
  role: string;
}

// Create the GlobalContext
interface GlobalContextType {
  isAuthenticated: boolean;
  loading: boolean;
  userProfile: UserProfile | null;
  error: string | null;
  signUp: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

// GlobalProvider component
interface GlobalProviderProps {
  children: React.ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setIsAuthenticated(true);
        await fetchUserProfile(token);
        router.replace("/(tabs)/home");
      } else {
        setIsAuthenticated(false);
        router.replace("/(auth)/sign-in");
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await axios.get(
        "http://192.168.0.106:5000/api/users/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserProfile(response.data);
    } catch (err) {
      setError("Error fetching user profile");
      console.error(err);
    }
  };

  const signUp = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://192.168.0.106:5000/api/signup",
        {
          email,
          username: `${firstName} ${lastName}`,
          password,
        }
      );
      if (response.data.token) {
        await AsyncStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
        await fetchUserProfile(response.data.token);
        router.replace("/(tabs)/home");
      }
    } catch (err) {
      setError("Error signing up");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://192.168.0.106:5000/api/signin",
        {
          email,
          password,
        }
      );
      if (response.data.token) {
        await AsyncStorage.setItem("token", response.data.token);
        setIsAuthenticated(true);
        await fetchUserProfile(response.data.token);
        router.replace("/(tabs)/home");
      }
    } catch (err) {
      setError("Error signing in");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserProfile(null);
    router.replace("/(auth)/sign-in");
  };

  return (
    <GlobalContext.Provider
      value={{
        isAuthenticated,
        userProfile,
        loading,
        error,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
