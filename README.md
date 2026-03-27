# 🪡 Mimacramé Studio 🇬🇧

A full-stack e-commerce platform for handmade macramé jewelry — built as a personal project to demonstrate production-grade Angular architecture and modern web development practices.

> **Live demo:** _coming soon_

---

## ✨ Highlights

This project intentionally uses the most current and demanding Angular patterns available in 2025–2026: **Zoneless change detection**, **Signal-First state**, and **`@angular/forms/signals`** (still experimental). The goal is to demonstrate that modern Angular requires very little boilerplate and no RxJS for 95% of everyday use cases.

Beyond the framework, it integrates a real payment flow, multi-language content at the data level, AI-assisted admin workflows, and secure serverless proxies for third-party API keys — the kind of cross-cutting concerns you encounter on real products.

---

## 🛍️ Features

### 👤 Customer experience

- 🗂️ **Product catalogue** with category filter, search, and sorting
- 📄 **Product detail** with full multilingual content (ES / EN / PT)
- 🛒 **Shopping cart** — persisted in Firestore, reactive via Signals
- 💳 **Stripe Checkout** — Payment Element, serverless PaymentIntent creation, webhook verification
- 👤 **Account area** — profile management, order history
- 📱 **Responsive design** — mobile-first, dark mode, CSS custom properties

### ⚙️ Admin panel

- 📦 **Product management** — create, edit, and publish products
- 🌍 **Multilingual editor** — name and description per language (ES / EN / PT) with validation per tab
- 🤖 **One-click auto-translation** — DeepL Free API translates name + description to EN and PT simultaneously via `Promise.all` (4 parallel calls). The API key never reaches the client — routed through a Vercel serverless proxy.
- 🖼️ **Cloudinary image upload** — organized under `mimacrame/products/{category}/{id}`, with upload progress
- 📋 **Order management** — view and manage incoming orders
- 🔐 **Role-based routing** — admins are blocked from client routes and vice versa

---

## 🏗️ Architecture decisions

### ⚡ Signal-First, Zoneless Angular

Zone.js is disabled. The entire application reacts to state changes through Angular Signals, Computed values, and Effects — no `subscribe()`, no `async` pipe, no manual `ChangeDetectorRef`. This is a deliberate constraint to prove the pattern at scale.

### 🔒 Serverless proxy for secret keys

Third-party API keys (Stripe, DeepL) never ship to the browser. All sensitive calls go through Vercel serverless functions in `api/`, which hold the secrets server-side and forward requests to the provider. The Angular app only ever calls `/api/*`.

### 🌐 Multilingual content at the data level

Products store `name` and `description` as `LocalizedString { es: string; en: string; pt: string }` in Firestore — not as separate documents or fields per language. The admin form enforces all three languages before saving. Consumers use a `LocalizePipe` or a reactive `activeLang` signal to render the correct value.

### 📂 Screaming Architecture

The folder structure reveals business intent, not framework abstractions:

```
features/home · features/catalogue · features/cart · features/checkout
features/admin · features/client/account · features/not-found
```

Every feature is self-contained (component + template + styles + i18n keys).

---

## 🛠️ Tech stack

| Layer       | Technology                                                            |
| ----------- | --------------------------------------------------------------------- |
| Framework   | [Angular 21](https://angular.dev/) — Zoneless, standalone components  |
| Build       | [Vite](https://vitejs.dev/) + Angular plugin                          |
| State       | Signals, Computed, Effects — zero RxJS in components                  |
| Forms       | `@angular/forms/signals` (Signal Forms)                               |
| Styling     | SCSS — BEM Nested methodology, CSS custom properties                  |
| i18n        | [Transloco](https://jsverse.github.io/transloco/) — ES / EN / PT      |
| Auth & DB   | [Firebase](https://firebase.google.com/) — Firestore + Authentication |
| Hosting     | [Vercel](https://vercel.com/) — static + serverless functions         |
| Payments    | [Stripe](https://stripe.com/) — Payment Element + webhooks            |
| Images      | [Cloudinary](https://cloudinary.com/) — organized folder structure    |
| Email       | [Resend](https://resend.com/) — transactional order emails            |
| Translation | [DeepL API Free](https://www.deepl.com/pro-api) — serverless proxy    |
| Testing     | [Vitest](https://vitest.dev/)                                         |

---

## 🚀 Getting started

### 📋 Prerequisites

- Node.js 20+
- [Vercel CLI](https://vercel.com/docs/cli) (`npm i -g vercel`) — required to run serverless functions locally

### 📦 Install

```bash
npm install
```

### 🔑 Environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` with your own keys:

| Variable                   | Description                                           |
| -------------------------- | ----------------------------------------------------- |
| `NG_APP_FIREBASE_*`        | Firebase project config                               |
| `NG_APP_STRIPE_PUBLIC_KEY` | Stripe publishable key                                |
| `STRIPE_SECRET_KEY`        | Stripe secret key (server-side only)                  |
| `RESEND_API_KEY`           | Resend API key (server-side only)                     |
| `DEEPL_API_KEY`            | DeepL Free API key — ends in `:fx` (server-side only) |
| `ALLOWED_ORIGIN`           | CORS origin for serverless functions                  |

### ▶️ Run (full stack)

```bash
npm run dev:full
```

Starts Vite on port `4200` and `vercel dev` on port `3000` concurrently. Vite proxies all `/api/*` requests to the local Vercel runtime.

### ▶️ Run (frontend only)

```bash
npm run dev
```

### 🔨 Build

```bash
npm run build
```

### 🧪 Test

```bash
npm run test       # Vitest
npm run test:ui    # Vitest UI
```

---

## 📁 Project structure

```sh
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

---

---

# 🪡 Mimacramé Studio 🇪🇸

Plataforma de e-commerce full-stack para joyería artesanal de macramé — desarrollada como proyecto personal para demostrar arquitectura Angular de nivel producción y prácticas modernas de desarrollo web.

> **Demo en vivo:** _próximamente_

---

## ✨ Destacados

Este proyecto utiliza intencionalmente los patrones Angular más actuales y exigentes disponibles en 2025–2026: **detección de cambios Zoneless**, **estado Signal-First** y **`@angular/forms/signals`** (aún experimental). El objetivo es demostrar que el Angular moderno requiere muy poco boilerplate y nada de RxJS para el 95% de los casos de uso cotidianos.

Más allá del framework, integra un flujo de pago real, contenido multilingüe a nivel de dato, flujos de trabajo de administración asistidos por IA y proxies serverless seguros para claves de APIs de terceros — el tipo de preocupaciones transversales que encontrás en productos reales.

---

## 🛍️ Funcionalidades

### 👤 Experiencia del cliente

- 🗂️ **Catálogo de productos** con filtro por categoría, búsqueda y ordenamiento
- 📄 **Detalle del producto** con contenido multilingüe completo (ES / EN / PT)
- 🛒 **Carrito de compras** — persistido en Firestore, reactivo vía Signals
- 💳 **Stripe Checkout** — Payment Element, creación serverless de PaymentIntent, verificación de webhook
- 👤 **Área de cuenta** — gestión de perfil, historial de pedidos
- 📱 **Diseño responsive** — mobile-first, modo oscuro, propiedades personalizadas CSS

### ⚙️ Panel de administración

- 📦 **Gestión de productos** — crear, editar y publicar productos
- 🌍 **Editor multilingüe** — nombre y descripción por idioma (ES / EN / PT) con validación por pestaña
- 🤖 **Auto-traducción con un clic** — la API Free de DeepL traduce nombre y descripción a EN y PT simultáneamente vía `Promise.all` (4 llamadas en paralelo). La clave de API nunca llega al cliente — se enruta a través de un proxy serverless de Vercel.
- 🖼️ **Subida de imágenes con Cloudinary** — organizado bajo `mimacrame/products/{category}/{id}`, con progreso de subida
- 📋 **Gestión de pedidos** — ver y gestionar pedidos entrantes
- 🔐 **Ruteo basado en roles** — los admins quedan bloqueados en rutas de cliente y viceversa

---

## 🏗️ Decisiones de arquitectura

### ⚡ Signal-First, Angular Zoneless

Zone.js está deshabilitado. Toda la aplicación reacciona a cambios de estado a través de Angular Signals, Computed y Effects — sin `subscribe()`, sin pipe `async`, sin `ChangeDetectorRef` manual. Es una restricción deliberada para probar el patrón a escala.

### 🔒 Proxy serverless para claves secretas

Las claves de APIs de terceros (Stripe, DeepL) nunca llegan al navegador. Todas las llamadas sensibles pasan por funciones serverless de Vercel en `api/`, que guardan los secretos del lado del servidor y reenvían las solicitudes al proveedor. La aplicación Angular solo llama a `/api/*`.

### 🌐 Contenido multilingüe a nivel de dato

Los productos almacenan `name` y `description` como `LocalizedString { es: string; en: string; pt: string }` en Firestore — no como documentos separados ni campos por idioma. El formulario de administración exige los tres idiomas antes de guardar. Los consumidores usan un `LocalizePipe` o una señal reactiva `activeLang` para renderizar el valor correcto.

### 📂 Screaming Architecture

La estructura de carpetas revela la intención de negocio, no las abstracciones del framework:

```
features/home · features/catalogue · features/cart · features/checkout
features/admin · features/client/account · features/not-found
```

Cada feature es autocontenida (componente + template + estilos + claves i18n).

---

## 🛠️ Stack tecnológico

| Capa        | Tecnología                                                                |
| ----------- | ------------------------------------------------------------------------- |
| Framework   | [Angular 21](https://angular.dev/) — Zoneless, standalone components      |
| Build       | [Vite](https://vitejs.dev/) + plugin de Angular                           |
| Estado      | Signals, Computed, Effects — zero RxJS en componentes                     |
| Formularios | `@angular/forms/signals` (Signal Forms)                                   |
| Estilos     | SCSS — metodología BEM Anidado, propiedades personalizadas CSS            |
| i18n        | [Transloco](https://jsverse.github.io/transloco/) — ES / EN / PT          |
| Auth y DB   | [Firebase](https://firebase.google.com/) — Firestore + Authentication     |
| Hosting     | [Vercel](https://vercel.com/) — estático + funciones serverless           |
| Pagos       | [Stripe](https://stripe.com/) — Payment Element + webhooks                |
| Imágenes    | [Cloudinary](https://cloudinary.com/) — estructura de carpetas organizada |
| Email       | [Resend](https://resend.com/) — emails transaccionales de pedidos         |
| Traducción  | [DeepL API Free](https://www.deepl.com/pro-api) — proxy serverless        |
| Testing     | [Vitest](https://vitest.dev/)                                             |

---

## 🚀 Primeros pasos

### 📋 Requisitos previos

- Node.js 20+
- [Vercel CLI](https://vercel.com/docs/cli) (`npm i -g vercel`) — requerido para ejecutar funciones serverless localmente

### 📦 Instalar

```bash
npm install
```

### 🔑 Variables de entorno

```bash
cp .env.example .env.local
```

Completá `.env.local` con tus propias claves:

| Variable                   | Descripción                                                    |
| -------------------------- | -------------------------------------------------------------- |
| `NG_APP_FIREBASE_*`        | Configuración del proyecto Firebase                            |
| `NG_APP_STRIPE_PUBLIC_KEY` | Clave publicable de Stripe                                     |
| `STRIPE_SECRET_KEY`        | Clave secreta de Stripe (solo del lado del servidor)           |
| `RESEND_API_KEY`           | Clave de API de Resend (solo del lado del servidor)            |
| `DEEPL_API_KEY`            | Clave Free API de DeepL — termina en `:fx` (solo del servidor) |
| `ALLOWED_ORIGIN`           | Origen CORS para funciones serverless                          |

### ▶️ Ejecutar (full stack)

```bash
npm run dev:full
```

Inicia Vite en el puerto `4200` y `vercel dev` en el puerto `3000` de forma simultánea. Vite hace proxy de todas las solicitudes `/api/*` al runtime local de Vercel.

### ▶️ Ejecutar (solo frontend)

```bash
npm run dev
```

### 🔨 Build

```bash
npm run build
```

### 🧪 Tests

```bash
npm run test       # Vitest
npm run test:ui    # Vitest UI
```

---

## 📁 Estructura del proyecto

```sh
api/
├── create-payment-intent.ts   # POST /api/create-payment-intent
├── stripe-webhook.ts          # POST /api/stripe-webhook
└── translate.ts               # POST /api/translate  (proxy DeepL)

src/
├── app/
│   ├── core/        # Servicios, guards, stores, interceptores, constantes
│   ├── features/    # Componentes a nivel de página (una carpeta por ruta)
│   ├── shared/      # Componentes UI reutilizables (Navbar, AdminNav, ProductCard…)
│   └── app.config.ts
├── assets/
│   └── i18n/        # en.json · es.json · pt.json
└── styles/          # Design tokens, mixins, resets globales
```

---

Desarrollado por [anbreaker](https://github.com/Anbreaker) · impulsado por [rootdevs](https://rootdevs.es/)

---

---

# 🪡 Mimacramé Studio 🇵🇹

Plataforma de e-commerce full-stack para joalharia artesanal de macramé — desenvolvida como projeto pessoal para demonstrar arquitetura Angular de nível produção e práticas modernas de desenvolvimento web.

> **Demo ao vivo:** _brevemente_

---

## ✨ Destaques

Este projeto utiliza intencionalmente os padrões Angular mais actuais e exigentes disponíveis em 2025–2026: **detecção de alterações Zoneless**, **estado Signal-First** e **`@angular/forms/signals`** (ainda experimental). O objectivo é demonstrar que o Angular moderno requer muito pouco boilerplate e nenhum RxJS para 95% dos casos de uso do dia a dia.

Para além do framework, integra um fluxo de pagamento real, conteúdo multilingue ao nível dos dados, fluxos de trabalho de administração assistidos por IA e proxies serverless seguros para chaves de APIs de terceiros — o tipo de preocupações transversais que se encontram em produtos reais.

---

## 🛍️ Funcionalidades

### 👤 Experiência do cliente

- 🗂️ **Catálogo de produtos** com filtro por categoria, pesquisa e ordenação
- 📄 **Detalhe do produto** com conteúdo multilingue completo (ES / EN / PT)
- 🛒 **Carrinho de compras** — persistido no Firestore, reactivo via Signals
- 💳 **Stripe Checkout** — Payment Element, criação serverless de PaymentIntent, verificação de webhook
- 👤 **Área de conta** — gestão de perfil, histórico de encomendas
- 📱 **Design responsivo** — mobile-first, modo escuro, propriedades personalizadas CSS

### ⚙️ Painel de administração

- 📦 **Gestão de produtos** — criar, editar e publicar produtos
- 🌍 **Editor multilingue** — nome e descrição por idioma (ES / EN / PT) com validação por separador
- 🤖 **Auto-tradução com um clique** — a API Free do DeepL traduz nome e descrição para EN e PT simultaneamente via `Promise.all` (4 chamadas em paralelo). A chave de API nunca chega ao cliente — é encaminhada através de um proxy serverless da Vercel.
- 🖼️ **Upload de imagens com Cloudinary** — organizado em `mimacrame/products/{category}/{id}`, com progresso de upload
- 📋 **Gestão de encomendas** — ver e gerir encomendas recebidas
- 🔐 **Encaminhamento baseado em funções** — os admins ficam bloqueados nas rotas de cliente e vice-versa

---

## 🏗️ Decisões de arquitectura

### ⚡ Signal-First, Angular Zoneless

O Zone.js está desactivado. Toda a aplicação reage a alterações de estado através de Angular Signals, Computed e Effects — sem `subscribe()`, sem pipe `async`, sem `ChangeDetectorRef` manual. Esta é uma restrição deliberada para provar o padrão à escala.

### 🔒 Proxy serverless para chaves secretas

As chaves de APIs de terceiros (Stripe, DeepL) nunca chegam ao browser. Todas as chamadas sensíveis passam por funções serverless da Vercel em `api/`, que guardam os segredos do lado do servidor e reencaminham os pedidos para o fornecedor. A aplicação Angular apenas chama `/api/*`.

### 🌐 Conteúdo multilingue ao nível dos dados

Os produtos armazenam `name` e `description` como `LocalizedString { es: string; en: string; pt: string }` no Firestore — não como documentos separados nem campos por idioma. O formulário de administração exige os três idiomas antes de guardar. Os consumidores usam um `LocalizePipe` ou um signal reactivo `activeLang` para renderizar o valor correcto.

### 📂 Screaming Architecture

A estrutura de pastas revela a intenção de negócio, não as abstracções do framework:

```
features/home · features/catalogue · features/cart · features/checkout
features/admin · features/client/account · features/not-found
```

Cada feature é autocontida (componente + template + estilos + chaves i18n).

---

## 🛠️ Stack tecnológico

| Camada      | Tecnologia                                                             |
| ----------- | ---------------------------------------------------------------------- |
| Framework   | [Angular 21](https://angular.dev/) — Zoneless, standalone components   |
| Build       | [Vite](https://vitejs.dev/) + plugin Angular                           |
| Estado      | Signals, Computed, Effects — zero RxJS em componentes                  |
| Formulários | `@angular/forms/signals` (Signal Forms)                                |
| Estilos     | SCSS — metodologia BEM Nested, propriedades personalizadas CSS         |
| i18n        | [Transloco](https://jsverse.github.io/transloco/) — ES / EN / PT       |
| Auth e BD   | [Firebase](https://firebase.google.com/) — Firestore + Authentication  |
| Alojamento  | [Vercel](https://vercel.com/) — estático + funções serverless          |
| Pagamentos  | [Stripe](https://stripe.com/) — Payment Element + webhooks             |
| Imagens     | [Cloudinary](https://cloudinary.com/) — estrutura de pastas organizada |
| Email       | [Resend](https://resend.com/) — emails transaccionais de encomendas    |
| Tradução    | [DeepL API Free](https://www.deepl.com/pro-api) — proxy serverless     |
| Testes      | [Vitest](https://vitest.dev/)                                          |

---

## 🚀 Primeiros passos

### 📋 Pré-requisitos

- Node.js 20+
- [Vercel CLI](https://vercel.com/docs/cli) (`npm i -g vercel`) — necessário para executar funções serverless localmente

### 📦 Instalar

```bash
npm install
```

### 🔑 Variáveis de ambiente

```bash
cp .env.example .env.local
```

Preencha `.env.local` com as suas próprias chaves:

| Variável                   | Descrição                                                       |
| -------------------------- | --------------------------------------------------------------- |
| `NG_APP_FIREBASE_*`        | Configuração do projecto Firebase                               |
| `NG_APP_STRIPE_PUBLIC_KEY` | Chave publicável do Stripe                                      |
| `STRIPE_SECRET_KEY`        | Chave secreta do Stripe (apenas do lado do servidor)            |
| `RESEND_API_KEY`           | Chave de API do Resend (apenas do lado do servidor)             |
| `DEEPL_API_KEY`            | Chave Free API do DeepL — termina em `:fx` (apenas do servidor) |
| `ALLOWED_ORIGIN`           | Origem CORS para funções serverless                             |

### ▶️ Executar (full stack)

```bash
npm run dev:full
```

Inicia o Vite na porta `4200` e o `vercel dev` na porta `3000` em simultâneo. O Vite faz proxy de todos os pedidos `/api/*` para o runtime local da Vercel.

### ▶️ Executar (apenas frontend)

```bash
npm run dev
```

### 🔨 Build

```bash
npm run build
```

### 🧪 Testes

```bash
npm run test       # Vitest
npm run test:ui    # Vitest UI
```

---

## 📁 Estrutura do projecto

```sh
api/
├── create-payment-intent.ts   # POST /api/create-payment-intent
├── stripe-webhook.ts          # POST /api/stripe-webhook
└── translate.ts               # POST /api/translate  (proxy DeepL)

src/
├── app/
│   ├── core/        # Serviços, guards, stores, interceptores, constantes
│   ├── features/    # Componentes ao nível da página (uma pasta por rota)
│   ├── shared/      # Componentes UI reutilizáveis (Navbar, AdminNav, ProductCard…)
│   └── app.config.ts
├── assets/
│   └── i18n/        # en.json · es.json · pt.json
└── styles/          # Design tokens, mixins, resets globais
```

---

Desenvolvido por [anbreaker](https://github.com/Anbreaker) · desenvolvido com [rootdevs](https://rootdevs.es/)
