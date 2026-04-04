"use client";

import { useState } from "react";
import { useDrawingMode } from "./drawing-context";
import { Button } from "@/components/ui/button";

type Mode = "read" | "draw" | "erase";

const MODE_CYCLE: Mode[] = ["read", "draw", "erase"];
const MODE_CONFIG: Record<Mode, { icon: string; label: string }> = {
  read: { icon: "📖", label: "Read" },
  draw: { icon: "✏️", label: "Draw" },
  erase: { icon: "🧹", label: "Erase" },
};

export function DrawingToolbar() {
  const { mode, setMode, clearAll } = useDrawingMode();
  const [showMenu, setShowMenu] = useState(false);

  const cycle = () => {
    const idx = MODE_CYCLE.indexOf(mode);
    setMode(MODE_CYCLE[(idx + 1) % MODE_CYCLE.length]);
  };

  const config = MODE_CONFIG[mode];

  return (
    <div className="relative flex items-center gap-1">
      <Button
        variant="paper"
        size="sm"
        onClick={cycle}
        className={mode !== "read" ? "bg-amber-100/90 text-stone-800" : ""}
        title={`Mode: ${config.label} (click to cycle)`}
      >
        <span className="text-sm leading-none">{config.icon}</span>
        {config.label}
      </Button>

      {mode !== "read" && (
        <>
          <Button
            variant="paper"
            size="sm"
            className="h-7 px-1.5 text-stone-400"
            onClick={(e) => { e.stopPropagation(); setShowMenu((s) => !s); }}
            title="Drawing options"
          >
            •••
          </Button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              <div className="absolute top-full right-0 mt-1 bg-white border border-stone-200 rounded-md shadow-lg py-1 min-w-[150px] z-50">
                <button
                  onClick={() => { clearAll(); setShowMenu(false); }}
                  className="w-full text-left px-3 py-1.5 text-xs font-[family-name:var(--font-lora)] text-red-600 hover:bg-red-50 transition-colors"
                >
                  Clear all drawings
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
