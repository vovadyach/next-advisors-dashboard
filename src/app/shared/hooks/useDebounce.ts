import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    // cleanup cancels the pending update if value/delay changes or component unmounts
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debouncedValue;
}
