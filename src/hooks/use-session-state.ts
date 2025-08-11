import { useState } from 'react';

export function useSessionState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') {
        return defaultValue;
      } const item = sessionStorage.getItem(key);

      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setValue = (value: T) => {
    setState(value);
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error);
    }
  };

  return [state, setValue] as const;
}

