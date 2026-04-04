const PATTERNS: [RegExp, string][] = [
  // OpenAI
  [/sk-[A-Za-z0-9_-]{20,}/g, "[REDACTED_OPENAI_KEY]"],
  // OpenRouter
  [/sk-or-v1-[A-Za-z0-9]{40,}/g, "[REDACTED_OPENROUTER_KEY]"],
  // Anthropic
  [/sk-ant-[A-Za-z0-9_-]{20,}/g, "[REDACTED_ANTHROPIC_KEY]"],
  // Stripe
  [/sk_live_[A-Za-z0-9]{20,}/g, "[REDACTED_STRIPE_KEY]"],
  [/pk_live_[A-Za-z0-9]{20,}/g, "[REDACTED_STRIPE_KEY]"],
  [/sk_test_[A-Za-z0-9]{20,}/g, "[REDACTED_STRIPE_KEY]"],
  [/pk_test_[A-Za-z0-9]{20,}/g, "[REDACTED_STRIPE_KEY]"],
  // AWS
  [/AKIA[A-Z0-9]{16}/g, "[REDACTED_AWS_KEY]"],
  // GitHub
  [/ghp_[A-Za-z0-9]{36,}/g, "[REDACTED_GITHUB_TOKEN]"],
  [/gho_[A-Za-z0-9]{36,}/g, "[REDACTED_GITHUB_TOKEN]"],
  [/ghu_[A-Za-z0-9]{36,}/g, "[REDACTED_GITHUB_TOKEN]"],
  [/ghs_[A-Za-z0-9]{36,}/g, "[REDACTED_GITHUB_TOKEN]"],
  // Google
  [/AIza[A-Za-z0-9_-]{35}/g, "[REDACTED_GOOGLE_KEY]"],
  // Supabase
  [/sbp_[A-Za-z0-9]{40,}/g, "[REDACTED_SUPABASE_KEY]"],
  // Vercel
  [/vercel_[A-Za-z0-9_-]{20,}/g, "[REDACTED_VERCEL_TOKEN]"],
  // Cloudflare
  [/cf_[A-Za-z0-9_-]{30,}/g, "[REDACTED_CLOUDFLARE_TOKEN]"],
  // Generic bearer tokens / long hex secrets
  [/Bearer\s+[A-Za-z0-9_\-.]{40,}/g, "[REDACTED_BEARER_TOKEN]"],
  // npm tokens
  [/npm_[A-Za-z0-9]{36,}/g, "[REDACTED_NPM_TOKEN]"],
  // Slack
  [/xoxb-[A-Za-z0-9\-]{20,}/g, "[REDACTED_SLACK_TOKEN]"],
  [/xoxp-[A-Za-z0-9\-]{20,}/g, "[REDACTED_SLACK_TOKEN]"],
  [/xoxs-[A-Za-z0-9\-]{20,}/g, "[REDACTED_SLACK_TOKEN]"],
  // Discord
  [/[NM][A-Za-z0-9]{23,}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27,}/g, "[REDACTED_DISCORD_TOKEN]"],
  // Private keys
  [/-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/g, "[REDACTED_PRIVATE_KEY]"],
];

export function redact(text: string): string {
  let result = text;
  for (const [pattern, replacement] of PATTERNS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}
