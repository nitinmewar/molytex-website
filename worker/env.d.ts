// Secrets are set with `wrangler secret put` (or .dev.vars locally), so `wrangler types` cannot see them.
interface Env {
  TURNSTILE_SECRET: string;
  NOTIFY_TO: string;
}
