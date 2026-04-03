const cache = new Map<string, HTMLAudioElement>();

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
