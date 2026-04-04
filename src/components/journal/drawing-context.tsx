"use client";

import { createContext, useContext, useState, useRef, useCallback, type ReactNode } from "react";

type Mode = "read" | "draw" | "erase";

interface DrawingState {
  mode: Mode;
  setMode: (mode: Mode) => void;
  clearAll: () => void;
  registerClear: (fn: () => void) => void;
}

const DrawingContext = createContext<DrawingState>({
  mode: "read",
  setMode: () => {},
  clearAll: () => {},
  registerClear: () => {},
});

export function DrawingProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("read");
  const clearRef = useRef<() => void>(() => {});

  const registerClear = useCallback((fn: () => void) => {
    clearRef.current = fn;
  }, []);

  const clearAll = useCallback(() => {
    clearRef.current();
  }, []);

  return (
    <DrawingContext.Provider value={{ mode, setMode, clearAll, registerClear }}>
      {children}
    </DrawingContext.Provider>
  );
}

export function useDrawingMode() {
  return useContext(DrawingContext);
}
