import { useState, useEffect } from "react";
import axios from "axios";
import { access_token_expired_time } from "@/utils/constants";

interface AuthData {
  value: string;
  expiresAt: number;
}

export const useAuth = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getStoredData = (key: string): AuthData | null => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      return JSON.parse(item);
    } catch {
      return null;
    }
  };

  const setStoredData = (key: string, value: string, expiry: number) => {
    const data: AuthData = {
      value,
      expiresAt: Date.now() + expiry,
    };
    localStorage.setItem(key, JSON.stringify(data));
  };

  const removeStoredData = (key: string) => {
    localStorage.removeItem(key);
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
        {},
        {
          withCredentials: true,
        }
      );

      const { access_token } = response.data;

      setStoredData("access_token", access_token, access_token_expired_time);

      setAccessToken(access_token);

      return true;
    } catch (error) {
      // Clear everything on refresh failure
      console.error("Failed to refresh token:", error);
      removeStoredData("access_token");
      setAccessToken(null);
      return false;
    }
  };

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      setLoading(true);
      const tokenData = getStoredData("access_token");

      if (!tokenData) {
        setAccessToken(null);
        setLoading(false);
        return;
      }

      const now = Date.now();
      if (now > tokenData.expiresAt) {
        // Token expired, try to refresh
        const refreshSuccess = await refreshToken();
        if (!refreshSuccess) {
          setAccessToken(null);
        }
      } else {
        // Token still valid
        setAccessToken(tokenData.value);
      }
      setLoading(false);
    };

    checkAndRefreshToken();
  }, []);

  console.log("AUTH", accessToken);
  return { accessToken, loading };
};
