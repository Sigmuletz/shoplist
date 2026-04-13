# Shoplist

Mobile-first family shopping list app. Dark mode. Shared catalog and lists per family. Telegram delivery.

## Local Development

Two processes required: Vite dev server (frontend) and a local API server that shims the Vercel serverless functions.

### 1. Environment

Create `.env.local` in the project root:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-fallback-chat-id   # optional fallback
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the API server

Runs on port 3001 and handles `/api/*` requests (Telegram send, etc.):

```bash
node --env-file=.env.local dev-api.js
```

### 4. Start the frontend

In a separate terminal:

```bash
npm run dev
```

Vite proxies `/api/` requests to `localhost:3001` automatically.

App is available at `http://localhost:5173`.

## Stack

- **Frontend**: React + Vite
- **Database / Auth**: Supabase (PostgreSQL + RLS)
- **Hosting**: Vercel (static site + serverless `api/` functions)
- **Notifications**: Telegram Bot API

## Deployment

Push to `main` — Vercel auto-deploys. Set the same env vars (minus `VITE_` prefix ones go in Vercel env, `VITE_` ones too) in the Vercel project settings.

## Ingredients.
apples
bananas
bread
butter
carrots
cheddar
cheese
chicken_breast
eggs
garlic
ground_beef
iaurt
milk
oats
olive_oil
onions
pasta
rice
spinach
tomatoes
tuna