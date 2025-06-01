import { useState } from "react";

export const useLocalStorage = (
  key: string,
  initialValue: number | string | boolean | null
) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return initialValue;

      const parsed = JSON.parse(item);
      //   if (parsed?.expiresAt) {
      //     const now = Date.now();
      //     if (now > parsed.expiresAt) {
      //       // localStorage.removeItem(key);
      //       return undefined; // Return undefined if expired
      //     }
      //   }
      return parsed?.value ?? parsed;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: number | string | boolean, expiry?: number) => {
    try {
      const valueToStore = expiry
        ? { value, expiresAt: Date.now() + expiry }
        : value;
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  return [storedValue, setValue] as const;
};
