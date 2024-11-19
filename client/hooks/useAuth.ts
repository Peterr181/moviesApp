import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserProfile {
  username: string;
  role: string;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setIsAuthenticated(true);
        await fetchUserProfile(token);
        router.replace("home");
      }
    };
    checkAuthStatus();
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(
        "http://192.168.0.106:5000/api/users/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserProfile(response.data);
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  const signUp = async (firstName, lastName, email, password) => {
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
        router.replace("sign-in");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
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
        router.replace("home");
        console.log("User signed in successfully");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("token");
    setIsAuthenticated(false);
    setUserProfile(null);
    router.replace("sign-in");
  };

  return {
    signUp,
    signIn,
    signOut,
    loading,
    error,
    isAuthenticated,
    userProfile,
  };
};
