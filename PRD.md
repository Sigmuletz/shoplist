# Shoplist — Product Requirements Document

**Status:** v1 implemented  
**Stack:** React + Vite · Supabase · Vercel · Telegram Bot API

---

## Overview
Mobile-first shopping list web app. Users maintain a personal item catalog, select items to build a shopping list, and send it to a shared Telegram group with one tap.

---

## Goals
- Replace paper lists and manual Telegram messages
- Fast item selection on mobile, one-handed if possible
- Shared delivery to a single Telegram chat (household/family group)
- Works in portrait and landscape on any modern smartphone

## Non-goals (v1)
- Real-time collaborative editing
- Barcode / receipt scanning
- Complex budget tracking
- Push notifications
- Offline-first / service worker
- Multiple Telegram destinations
- Item image support

---

## Users
Multi-user. Each user signs in via email magic link and maintains their own catalog and active list. All users share the same Telegram destination (one group chat, configured via server-side env vars).

---

## Core Features

### 1. Auth
- Email magic link login via Supabase Auth (no password)
- Google OAuth optional (enable in Supabase dashboard)
- Session persists across browser restarts via `onAuthStateChange`
- Sign out in Settings tab

### 2. Item Catalog (`/src/components/catalog/`)
- Each user owns their own catalog rows (`catalog_items` table, RLS enforced)
- Item fields: name (required), unit (optional, e.g. kg / pcs / L), price (optional)
- Add item: "+" button in header → bottom-sheet modal (`AddItemModal`)
- Search/filter by name (`SearchBar`, client-side filter)
- Each item shows unit and price if set
- Tap item → adds to active list; checkmark shows if already in list

### 3. Shopping List Builder (`/src/components/list/`)
- One active list per user: latest `shopping_lists` row where `sent_at IS NULL`
- Created automatically on first load if none exists (`useList.js`)
- Tap catalog item → `addItem()`: inserts `list_items` row or increments qty if duplicate
- `QuantityStepper` (−/+) to adjust quantity; decrement to 0 removes the row
- Running total shown in `ListSummary` when any items have prices
- Swipe/delete button removes item from list

### 4. Send to Telegram (`/api/send-telegram.js`)
- `formatList(items)` → Markdown string with bullet points and optional total
- `SendButton` POSTs to `/api/send-telegram` with Supabase JWT in `Authorization` header
- Server verifies JWT (`jsonwebtoken` + `SUPABASE_JWT_SECRET`), then calls Bot API
- On success: client calls `markSent()` → sets `sent_at`, triggers new active list creation
- Button states: idle → loading (spinner) → success (checkmark, 2.5s) → idle

### 5. Settings (`/src/components/settings/`)
- Signed-in email display
- `PriceEditor`: inline price inputs for all catalog items, debounced upsert (600ms)
- Sign out button

---

## Navigation
Three tabs, layout changes with orientation (pure CSS, no JS):
- **Portrait:** fixed bottom tab bar (56px) with label + icon
- **Landscape:** left icon rail (56px wide), full-height content

| Tab | Icon | Content |
|-----|------|---------|
| Catalog | Grid | Browse/search catalog, add items to list |
| List | Bullet list | Active shopping list, qty controls, send |
| Settings | Gear | Prices, account, sign out |

List tab shows item count badge when list is non-empty.

---

## Design
- Dark mode only (`#0f0f0f` base, `#1a1a1a` surfaces, `#252525` elevated)
- Accent: `#4ade80` (green — functional, not decorative)
- System font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- Min touch target: 48px
- No gradients, no glassmorphism, no glow, no purple/blue AI palette
- Animations: functional only (200ms modal slide-up, spinner)
- iOS safe-area insets on tab bar and send button footer
- Design tokens in `src/styles/tokens.css`

---

## Architecture

```
shoplist/
├── api/
│   └── send-telegram.js        # Vercel serverless — JWT verify + Telegram call
├── src/
│   ├── lib/
│   │   ├── supabase.js         # Supabase client singleton
│   │   ├── formatList.js       # Pure fn: items[] → Telegram Markdown string
│   │   └── telegram.js         # fetch wrapper: POST /api/send-telegram
│   ├── hooks/
│   │   ├── useAuth.js          # session, signInWithEmail, signOut
│   │   ├── useCatalog.js       # catalog_items CRUD + joined item_prices
│   │   ├── useList.js          # active list: get-or-create, addItem, removeItem, updateQty, markSent
│   │   └── usePrice.js         # debounced upsert to item_prices
│   ├── components/
│   │   ├── layout/             # AppShell, TabBar, Header
│   │   ├── auth/               # AuthScreen
│   │   ├── catalog/            # CatalogView, CatalogItem, AddItemModal, SearchBar
│   │   ├── list/               # ListView, ListItem, QuantityStepper, ListSummary, SendButton
│   │   └── settings/           # SettingsView, PriceEditor
│   └── styles/
│       ├── tokens.css          # CSS custom properties
│       ├── global.css          # Reset, body, scrollbars
│       └── components.css      # .btn, .card, .input, .modal-sheet, .badge
├── vercel.json
└── .env.example
```

### Data Flow — Send List
```
User taps Send
  → formatList(items) → Markdown string
  → POST /api/send-telegram { message }  +  Authorization: Bearer <supabase_jwt>
    → jwt.verify(token, SUPABASE_JWT_SECRET)
    → fetch api.telegram.org/bot.../sendMessage  { chat_id, text, parse_mode: Markdown }
  → client: supabase.update({ sent_at }) → useList re-fetches → new empty list
```

### Security
- RLS on all tables: users read/write own rows only
- Bot token + JWT secret: server-only env vars (no `VITE_` prefix)
- JWT verified server-side on every send request
- Anon key safe in browser (RLS enforces all authorization)

---

## Database Schema

```sql
create extension if not exists "pgcrypto";

create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at   timestamptz default now()
);

create table public.catalog_items (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  unit       text,
  created_at timestamptz default now(),
  unique (user_id, name)
);

create table public.item_prices (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  catalog_item_id uuid not null references public.catalog_items(id) on delete cascade,
  price           numeric(10,2),
  currency        text default 'EUR',
  updated_at      timestamptz default now(),
  unique (user_id, catalog_item_id)
);

create table public.shopping_lists (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null default 'Shopping List',
  sent_at    timestamptz,   -- null = active list
  created_at timestamptz default now()
);

create table public.list_items (
  id              uuid primary key default gen_random_uuid(),
  list_id         uuid not null references public.shopping_lists(id) on delete cascade,
  catalog_item_id uuid not null references public.catalog_items(id) on delete cascade,
  quantity        integer not null default 1,
  note            text,
  position        integer default 0,
  unique (list_id, catalog_item_id)
);

-- Row Level Security
alter table public.profiles       enable row level security;
alter table public.catalog_items  enable row level security;
alter table public.item_prices    enable row level security;
alter table public.shopping_lists enable row level security;
alter table public.list_items     enable row level security;

create policy "own" on public.profiles       for all using (auth.uid() = id);
create policy "own" on public.catalog_items  for all using (auth.uid() = user_id);
create policy "own" on public.item_prices    for all using (auth.uid() = user_id);
create policy "own" on public.shopping_lists for all using (auth.uid() = user_id);
create policy "own" on public.list_items     for all using (
  exists (
    select 1 from public.shopping_lists sl
    where sl.id = list_id and sl.user_id = auth.uid()
  )
);

-- Convenience view: list items joined with catalog + prices
create view public.list_items_detail as
  select
    li.id, li.list_id, li.quantity, li.note, li.position,
    ci.id   as catalog_item_id,
    ci.name as item_name,
    ci.unit,
    ip.price,
    ip.currency
  from public.list_items li
  join public.catalog_items ci on ci.id = li.catalog_item_id
  left join public.item_prices ip
    on ip.catalog_item_id = ci.id and ip.user_id = ci.user_id;
```

---

## Environment Variables

```
# .env.local (never commit)
VITE_SUPABASE_URL=https://xxxx.supabase.co   # browser-safe
VITE_SUPABASE_ANON_KEY=eyJ...                # browser-safe (RLS enforces auth)
SUPABASE_JWT_SECRET=...                       # server-only
TELEGRAM_BOT_TOKEN=123456:AAF...              # server-only
TELEGRAM_CHAT_ID=-1001234567890              # server-only
```

---

## Deployment

```bash
npm run build          # verify clean build
npx vercel link        # connect to Vercel project
# set all 5 env vars in Vercel dashboard → Settings → Environment Variables
npx vercel --prod
```

- Vercel Hobby (free): static site + serverless `api/` functions
- `vercel.json` rewrites all non-`/api/` paths to `index.html`
- Connect GitHub for auto-deploy on push to main + PR previews

---

## Setup Checklist

- [ ] Create Supabase project, run SQL schema
- [ ] Enable email magic link auth in Supabase Auth settings
- [ ] Copy Supabase URL, anon key, JWT secret to `.env.local`
- [ ] Create Telegram bot via @BotFather
- [ ] Add bot to target group chat, retrieve chat ID
- [ ] Copy bot token + chat ID to `.env.local`
- [ ] `npm run dev` — verify auth + catalog + list locally
- [ ] Deploy to Vercel, set env vars in dashboard
- [ ] Test send flow end-to-end on mobile (portrait + landscape)
