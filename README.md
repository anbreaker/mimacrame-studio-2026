# Mimacramé Studio

A full-stack e-commerce platform for handmade macramé jewelry — built as a personal project to demonstrate production-grade Angular architecture and modern web development practices.

> **Live demo:** _coming soon_

---

## Highlights

This project intentionally uses the most current and demanding Angular patterns available in 2025–2026: **Zoneless change detection**, **Signal-First state**, and **`@angular/forms/signals`** (still experimental). The goal is to demonstrate that modern Angular requires very little boilerplate and no RxJS for 95% of everyday use cases.

Beyond the framework, it integrates a real payment flow, multi-language content at the data level, AI-assisted admin workflows, and secure serverless proxies for third-party API keys — the kind of cross-cutting concerns you encounter on real products.

---

## Features

### Customer experience
- **Product catalogue** with category filter, search, and sorting
- **Product detail** with full multilingual content (ES / EN / PT)
- **Shopping cart** — persisted in Firestore, reactive via Signals
- **Stripe Checkout** — Payment Element, serverless PaymentIntent creation, webhook verification
- **Account area** — profile management, order history
- **Responsive design** — mobile-first, dark mode, CSS custom properties

### Admin panel
- **Product management** — create, edit, and publish products
- **Multilingual editor** — name and description per language (ES / EN / PT) with validation per tab
- **One-click auto-translation** — DeepL Free API translates name + description to EN and PT simultaneously via `Promise.all` (4 parallel calls). The API key never reaches the client — routed through a Vercel serverless proxy.
- **Cloudinary image upload** — organized under `mimacrame/products/{category}/{id}`, with upload progress
- **Order management** — view and manage incoming orders
- **Role-based routing** — admins are blocked from client routes and vice versa

---

## Architecture decisions

### Signal-First, Zoneless Angular
Zone.js is disabled. The entire application reacts to state changes through Angular Signals, Computed values, and Effects — no `subscribe()`, no `async` pipe, no manual `ChangeDetectorRef`. This is a deliberate constraint to prove the pattern at scale.

### Serverless proxy for secret keys
Third-party API keys (Stripe, DeepL) never ship to the browser. All sensitive calls go through Vercel serverless functions in `api/`, which hold the secrets server-side and forward requests to the provider. The Angular app only ever calls `/api/*`.

### Multilingual content at the data level
Products store `name` and `description` as `LocalizedString { es: string; en: string; pt: string }` in Firestore — not as separate documents or fields per language. The admin form enforces all three languages before saving. Consumers use a `LocalizePipe` or a reactive `activeLang` signal to render the correct value.

### Screaming Architecture
The folder structure reveals business intent, not framework abstractions:
```
features/home · features/catalogue · features/cart · features/checkout
features/admin · features/client/account · features/not-found
```
Every feature is self-contained (component + template + styles + i18n keys).

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | [Angular 21](https://angular.dev/) — Zoneless, standalone components |
| Build | [Vite](https://vitejs.dev/) + Angular plugin |
| State | Signals, Computed, Effects — zero RxJS in components |
| Forms | `@angular/forms/signals` (Signal Forms) |
| Styling | SCSS — BEM Nested methodology, CSS custom properties |
| i18n | [Transloco](https://jsverse.github.io/transloco/) — ES / EN / PT |
| Auth & DB | [Firebase](https://firebase.google.com/) — Firestore + Authentication |
| Hosting | [Vercel](https://vercel.com/) — static + serverless functions |
| Payments | [Stripe](https://stripe.com/) — Payment Element + webhooks |
| Images | [Cloudinary](https://cloudinary.com/) — organized folder structure |
| Email | [Resend](https://resend.com/) — transactional order emails |
| Translation | [DeepL API Free](https://www.deepl.com/pro-api) — serverless proxy |
| Testing | [Vitest](https://vitest.dev/) |

---

## Getting started

### Prerequisites
- Node.js 20+
- [Vercel CLI](https://vercel.com/docs/cli) (`npm i -g vercel`) — required to run serverless functions locally

### Install

```bash
npm install
```

### Environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` with your own keys:

| Variable | Description |
|---|---|
| `NG_APP_FIREBASE_*` | Firebase project config |
| `NG_APP_STRIPE_PUBLIC_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key (server-side only) |
| `RESEND_API_KEY` | Resend API key (server-side only) |
| `DEEPL_API_KEY` | DeepL Free API key — ends in `:fx` (server-side only) |
| `ALLOWED_ORIGIN` | CORS origin for serverless functions |

### Run (full stack)

```bash
npm run dev:full
```

Starts Vite on port `4200` and `vercel dev` on port `3000` concurrently. Vite proxies all `/api/*` requests to the local Vercel runtime.

### Run (frontend only)

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Test

```bash
npm run test       # Vitest
npm run test:ui    # Vitest UI
```

---

## Project structure

```
api/
├── create-payment-intent.ts   # POST /api/create-payment-intent
├── stripe-webhook.ts          # POST /api/stripe-webhook
└── translate.ts               # POST /api/translate  (DeepL proxy)

src/
├── app/
│   ├── core/        # Services, guards, stores, interceptors, constants
│   ├── features/    # Page-level components (one folder per route)
│   ├── shared/      # Reusable UI components (Navbar, AdminNav, ProductCard…)
│   └── app.config.ts
├── assets/
│   └── i18n/        # en.json · es.json · pt.json
└── styles/          # Design tokens, mixins, global resets
```

---

Built by [anbreaker](https://github.com/Anbreaker) · powered by [rootdevs](https://rootdevs.es/)
