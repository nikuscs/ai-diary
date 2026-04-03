export const SIGNAL_WORDS = {
  frustration: {
    words: [
      "fuck", "fucking", "ffs", "damn", "dammit", "wtf", "shit", "crap", "hell",
      "broken", "I give up", "not working", "waste of time", "useless", "garbage",
      "terrible", "horrible", "hate this", "hate it", "stupid", "ridiculous",
      "this sucks", "so annoying", "are you kidding", "unbelievable", "makes no sense",
      "why won't", "still broken", "nothing works", "piece of junk", "kill me",
      "losing my mind", "going crazy", "fed up", "done with this", "screw this",
      "I can't", "impossible", "ugh", "argh", "gah", "jesus christ", "for fuck's sake",
      "god damn", "bloody hell", "bullshit", "what the hell", "nightmare",
      "this is insane", "drives me nuts", "I'm done", "rage quit",
    ],
    weight: 3,
  },
  gratitude: {
    words: [
      "thank you", "thanks", "thx", "perfect", "finally", "genius", "amazing",
      "love it", "exactly", "brilliant", "awesome", "fantastic", "beautiful",
      "great job", "well done", "nailed it", "you're a lifesaver", "lifesaver",
      "saved my life", "saved me", "hero", "legend", "incredible", "magnificent",
      "wonderful", "superb", "excellent", "spot on", "you rock", "clutch",
      "game changer", "magic", "chef's kiss", "blessed", "godsend", "miracle",
      "just what I needed", "that's it", "works perfectly", "flawless",
      "you're the best", "appreciate it", "much appreciated", "so helpful",
    ],
    weight: 1,
  },
  disaster: {
    words: [
      "production", "prod down", "deleted", "rollback", "oh no", "wrong database",
      "drop table", "rm -rf", "force push", "master", "revert", "hotfix",
      "incident", "outage", "downtime", "corrupted", "data loss", "lost everything",
      "wrong branch", "wrong server", "wrong environment", "deployed to prod",
      "pushed to main", "broke production", "site is down", "app is down",
      "server crash", "database down", "migration failed", "schema broken",
      "truncate", "delete from", "update without where", "no backup", "backup failed",
      "ssl expired", "cert expired", "dns", "firewall", "locked out",
      "credentials leaked", "secret exposed", "api key exposed", "env file",
      "wrong config", "memory leak", "out of memory", "disk full", "cpu 100",
      "ddos", "security breach", "unauthorized access", "root access",
      "cascade failure", "deadlock", "infinite loop", "stack overflow",
      "segfault", "core dump", "kernel panic", "blue screen", "fatal error",
      "unrecoverable", "catastrophic", "critical failure", "total meltdown",
      "pager going off", "on-call", "wake up call", "3am", "middle of the night",
    ],
    weight: 4,
  },
  funny: {
    words: [
      "oops", "I didn't mean", "please don't", "undo", "wait no", "oh god",
      "why did", "what have I done", "accidentally", "whoops", "my bad",
      "well that happened", "not my finest moment", "in my defense",
      "don't judge me", "asking for a friend", "hypothetically",
      "I may have", "slight problem", "minor issue", "so funny story",
      "plot twist", "surprise", "didn't expect that", "that escalated",
      "hold my beer", "watch this", "what could go wrong", "famous last words",
      "narrator voice", "it was at this moment", "to be fair", "technically",
      "it works on my machine", "have you tried turning it off",
      "rubber duck", "percussive maintenance", "it's not a bug it's a feature",
      "undefined is not a function", "null pointer", "off by one",
      "semicolon", "missing bracket", "tab vs space", "merge conflict from hell",
      "git blame", "who wrote this", "past me", "future me problem",
      "copy paste", "stackoverflow", "chatgpt said", "the ai told me to",
      "yolo deploy", "friday deploy", "deploy on friday", "ship it",
      "looks good to me", "lgtm", "no tests needed", "it compiles",
    ],
    weight: 2,
  },
  emotional: {
    words: [
      "sorry", "confused", "frustrated", "angry", "happy", "scared",
      "worried", "stressed", "tired", "exhausted", "overwhelmed", "anxious",
      "nervous", "panicking", "freaking out", "terrified", "relieved",
      "proud", "excited", "thrilled", "devastated", "heartbroken",
      "disappointed", "hopeless", "helpless", "desperate", "miserable",
      "burned out", "burnout", "drained", "can't focus", "can't think",
      "brain fog", "need a break", "need sleep", "too much", "over it",
      "at my limit", "breaking point", "crying", "want to cry",
      "imposter syndrome", "I'm an idiot", "I'm stupid", "feel dumb",
      "out of my depth", "in over my head", "no idea what I'm doing",
      "lost", "stuck", "spinning my wheels", "going in circles",
      "feel like giving up", "what's the point", "why do I bother",
      "lonely", "isolated", "nobody understands", "on my own",
    ],
    weight: 2,
  },
  victory: {
    words: [
      "it works", "finally works", "fixed it", "solved it", "figured it out",
      "eureka", "aha", "breakthrough", "cracked it", "got it",
      "ship it", "deployed", "merged", "released", "launched", "live",
      "all tests pass", "green build", "zero errors", "clean build",
      "milestone", "done", "finished", "completed", "accomplished",
      "first commit", "v1", "version 1", "mvp", "proof of concept",
      "demo ready", "presentation ready", "client approved", "boss loved it",
      "promotion", "raise", "new job", "hired", "offer letter",
      "100%", "10x", "fastest ever", "new record", "personal best",
      "learned something", "level up", "growth", "progress", "improvement",
    ],
    weight: 1,
  },
  existential: {
    words: [
      "why am I doing this", "what is the point", "is this worth it",
      "should I quit", "career change", "wrong field", "hate coding",
      "love coding", "passion project", "side project at 2am",
      "is AI going to replace me", "will AI take my job", "prompt engineer",
      "are we just gluing APIs together", "real programming",
      "everything is just CRUD", "another todo app", "yet another framework",
      "javascript fatigue", "dependency hell", "node_modules",
      "rewrite from scratch", "technical debt", "legacy code",
      "spaghetti code", "who maintains this", "job security",
      "the code owns me", "I serve the machine", "we live in a simulation",
    ],
    weight: 2,
  },
  chaos: {
    words: [
      "everything is on fire", "dumpster fire", "tire fire", "this is fine",
      "nothing makes sense", "how did this ever work", "it shouldn't work but it does",
      "don't touch it", "load bearing", "haunted", "cursed", "cursed code",
      "black magic", "voodoo", "dark arts", "eldritch horror", "cosmic horror",
      "spaghetti", "rats nest", "house of cards", "jenga tower",
      "duct tape", "band-aid", "temporary fix", "permanent temporary",
      "TODO from 2019", "TODO from 2020", "TODO from 2021",
      "no documentation", "the docs lie", "outdated docs",
      "tribal knowledge", "bus factor", "only person who knows",
      "works but nobody knows why", "mystery meat", "here be dragons",
      "abandon all hope", "god object", "big ball of mud",
    ],
    weight: 3,
  },
} as const;

export function scoreMessage(content: string): number {
  const lower = content.toLowerCase();
  let score = 0;
  for (const category of Object.values(SIGNAL_WORDS)) {
    for (const word of category.words) {
      if (lower.includes(word.toLowerCase())) {
        score += category.weight;
      }
    }
  }
  return score;
}
