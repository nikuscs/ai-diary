"use client";

import { useEffect } from "react";
import { preload } from "@/lib/sounds";

export function SoundPreloader() {
  useEffect(() => {
    preload("/sounds/pencil-strike.mp3", "/sounds/pencil-circle.mp3");
  }, []);
  return null;
}
