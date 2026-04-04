const cache = new Map<string, HTMLAudioElement>();

export function preload(...srcs: string[]) {
  if (typeof window === "undefined") return;
  for (const src of srcs) {
    if (!cache.has(src)) {
      const audio = new Audio(src);
      audio.preload = "auto";
      cache.set(src, audio);
    }
  }
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
