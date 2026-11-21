# Ministry of Good Deeds — Cloudflare Worker

Browser-first deployment package for the Telegram Mini App and bot.

## Architecture
- Cloudflare Worker serves the Mini App from `public/`.
- The same Worker handles `/api/*` and Telegram webhook requests at `/telegram/webhook`.
- Cloudflare D1 stores profiles and progress.
- Telegram bot token and webhook secret are Worker secrets, never committed here.

## Before deployment
1. Create a D1 database in Cloudflare Dashboard.
2. Copy its database ID into `wrangler.jsonc`.
3. Run the SQL in `migrations/0001_init.sql` in the D1 Console.
4. Connect this GitHub repository to Workers Builds.
5. Add Worker variables/secrets:
   - Secret `BOT_TOKEN`: token from BotFather
   - Secret `TELEGRAM_WEBHOOK_SECRET`: a long random secret you create
   - Variable (or secret) `APP_URL`: your deployed Worker URL, e.g. `https://ministry-of-good-deeds.<account>.workers.dev`
6. After first deployment, set the Telegram webhook to:
   `https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=<APP_URL>/telegram/webhook&secret_token=<TELEGRAM_WEBHOOK_SECRET>`
   Replace placeholders; do not publish the token.
## Browser-only notes
The deployment can be configured from Cloudflare Dashboard and GitHub website. No local terminal is required.
