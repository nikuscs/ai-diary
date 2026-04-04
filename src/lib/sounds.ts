const cache = new Map<string, HTMLAudioElement>();
let unlocked = false;

function unlock() {
  if (unlocked) return;
  unlocked = true;
  for (const audio of cache.values()) {
    audio.load();
  }
  document.removeEventListener("click", unlock, true);
  document.removeEventListener("keydown", unlock, true);
}

export function preload(...srcs: string[]) {
  if (typeof window === "undefined") return;
  for (const src of srcs) {
    if (!cache.has(src)) {
      cache.set(src, new Audio(src));
    }
  }
  document.addEventListener("click", unlock, { capture: true, once: true });
  document.addEventListener("keydown", unlock, { capture: true, once: true });
}

export function playSound(src: string, volume = 0.3) {
  if (typeof window === "undefined") return;

  let audio = cache.get(src);
  if (!audio) {
    audio = new Audio(src);
    cache.set(src, audio);
  }

  audio.volume = volume;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}
