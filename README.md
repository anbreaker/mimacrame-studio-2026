# Mimacramé Studio 2026

High-end handcrafted e-commerce platform specializing in handmade macramé jewelry. Built with the most cutting-edge technologies in the web ecosystem to offer an ultra-fast, reactive, and multi-language experience.

## 🚀 Tech Stack

- **Framework:** [Angular 21](https://angular.dev/) (**Zoneless** experimental mode).
- **Build Tool / Dev Server:** [Vite](https://vitejs.dev/) for instantaneous development.
- **State & Reactivity:** **Signal-First** architecture (Signals, Computed, Effects).
- **Internationalization:** [Transloco](https://ngneat.github.io/transloco/) with support for **English, Spanish, and Portuguese**.
- **Backend & Auth:** [Firebase](https://firebase.google.com/) (Firestore, Authentication).
- **Serverless API:** [Vercel](https://vercel.com/) serverless functions (`api/` directory).
- **Payments:** [Stripe](https://stripe.com/) with Payment Element and webhook verification.
- **Image Storage:** [Cloudinary](https://cloudinary.com/) — uploads organized under `mimacrame/products/{category}/{id}` and `mimacrame/users/{id}`.
- **Transactional Email:** [Resend](https://resend.com/) for order confirmations.
- **Forms:** `@angular/forms/signals` (Signal Forms).
- **Styling:** SCSS following **BEM Nested** methodology.
- **Testing:** [Vitest](https://vitest.dev/) for high-speed unit testing.

## 🏛️ Architecture & Principles

- **Screaming Architecture:** Folder structure reveals business intent (`features`, `core`, `shared`).
- **Mobile First:** Optimized design for mobile devices with adaptive navigation.
- **Zoneless Performance:** Elimination of `zone.js` to minimize change detection cycles and improve performance.
- **Type Safety:** Strict use of TypeScript and interfaces for all data models.
- **Multi-language content:** Products store `name` and `description` as `LocalizedString { es, en, pt }`. Consumers use `LocalizePipe` or reactive `activeLang` signal.

## 🛠️ Development

### Dependency Installation

```bash
npm install
```

### Development Server (Vite + Vercel dev)

To run the full stack locally (Angular + serverless API):

```bash
npm run dev:full
```

This starts both Vite (port 4200) and `vercel dev` (port 3000) concurrently. Vite proxies `/api/*` requests to Vercel.

To run the Angular frontend only:

```bash
npm run dev
```

Navigate to `http://localhost:4200/`. The server supports HMR (Hot Module Replacement).

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

Required variables: `NG_APP_STRIPE_PUBLIC_KEY`, `STRIPE_SECRET_KEY`, `RESEND_API_KEY`, `ALLOWED_ORIGIN`, and the `NG_APP_FIREBASE_*` set.

### Production Build

```bash
npm run build
```

Optimized files will be generated in the `dist/` folder.

### Testing

```bash
npm run test        # Unit tests with Vitest
npm run test:ui     # Vitest visual interface
```

## 🌐 Internationalization (i18n)

The application supports multiple languages natively and reactively. Dictionaries are located in `src/assets/i18n/`.

- `en.json` (English)
- `es.json` (Spanish - Default)
- `pt.json` (Portuguese)

## 📦 Project Structure

```sh
api/                       # Vercel serverless functions
├── create-payment-intent.ts   # POST /api/create-payment-intent
└── stripe-webhook.ts          # POST /api/stripe-webhook
src/
├── app/
│   ├── core/          # Global services, guards, interceptors, and stores
│   ├── features/      # Page modules (Home, Catalogue, Cart, Admin...)
│   ├── shared/        # Reusable UI components (Navbar, Footer, ProductCard...)
│   └── app.config.ts  # Global configuration (Zoneless, Transloco, Firebase)
├── assets/            # Images and translation files
└── styles/            # Mixins, variables, and global styles
```

---

# Mimacramé Studio 2026 (Versión en Castellano)

Plataforma de e-commerce artesanal de alta gama, especializada en joyería de macramé hecha a mano. Construida con las tecnologías más vanguardistas del ecosistema web para ofrecer una experiencia ultra-rápida, reactiva y multiidioma.

## 🚀 Stack Tecnológico

- **Framework:** [Angular 21](https://angular.dev/) (Modo **Zoneless** experimental).
- **Build Tool / Dev Server:** [Vite](https://vitejs.dev/) para un desarrollo instantáneo.
- **Estado y Reactividad:** Arquitectura **Signal-First** (Signals, Computed, Effects).
- **Internacionalización:** [Transloco](https://ngneat.github.io/transloco/) con soporte para **Español, Inglés y Portugués**.
- **Backend & Auth:** [Firebase](https://firebase.google.com/) (Firestore, Authentication).
- **API Serverless:** Funciones serverless de [Vercel](https://vercel.com/) (directorio `api/`).
- **Pagos:** [Stripe](https://stripe.com/) con Payment Element y verificación de webhooks.
- **Almacenamiento de imágenes:** [Cloudinary](https://cloudinary.com/) — subidas organizadas bajo `mimacrame/products/{category}/{id}` y `mimacrame/users/{id}`.
- **Email transaccional:** [Resend](https://resend.com/) para confirmaciones de pedido.
- **Formularios:** `@angular/forms/signals` (Signal Forms).
- **Estilos:** SCSS siguiendo la metodología **BEM Nested**.
- **Testing:** [Vitest](https://vitest.dev/) para unit testing de alta velocidad.

## 🏛️ Arquitectura y Principios

- **Screaming Architecture:** La estructura de carpetas revela la intención del negocio (`features`, `core`, `shared`).
- **Mobile First:** Diseño optimizado para dispositivos móviles con navegación adaptativa.
- **Zoneless Performance:** Eliminación de `zone.js` para minimizar los ciclos de detección de cambios y mejorar el rendimiento.
- **Type Safety:** Uso estricto de TypeScript e interfaces para todos los modelos de datos.
- **Contenido multiidioma:** Los productos almacenan `name` y `description` como `LocalizedString { es, en, pt }`. Los consumidores usan `LocalizePipe` o el signal reactivo `activeLang`.

## 🛠️ Desarrollo

### Instalación de dependencias

```bash
npm install
```

### Servidor de desarrollo (Vite + Vercel dev)

Para ejecutar el stack completo en local (Angular + API serverless):

```bash
npm run dev:full
```

Arranca Vite (puerto 4200) y `vercel dev` (puerto 3000) de forma concurrente. Vite redirige las peticiones `/api/*` a Vercel.

Para ejecutar solo el frontend Angular:

```bash
npm run dev
```

Navega a `http://localhost:4200/`. El servidor soporta HMR (Hot Module Replacement).

### Variables de entorno

Copia `.env.example` a `.env.local` y rellena los valores requeridos:

```bash
cp .env.example .env.local
```

Variables necesarias: `NG_APP_STRIPE_PUBLIC_KEY`, `STRIPE_SECRET_KEY`, `RESEND_API_KEY`, `ALLOWED_ORIGIN` y el conjunto `NG_APP_FIREBASE_*`.

### Construcción para producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

### Testing

```bash
npm run test        # Unit tests con Vitest
npm run test:ui     # Interfaz visual de Vitest
```

## 🌐 Internacionalización (i18n)

La aplicación soporta múltiples idiomas de forma nativa y reactiva. Los diccionarios se encuentran en `src/assets/i18n/`.

- `en.json` (Inglés)
- `es.json` (Español - Default)
- `pt.json` (Portugués)

## 📦 Estructura del Proyecto

```sh
api/                           # Funciones serverless de Vercel
├── create-payment-intent.ts   # POST /api/create-payment-intent
└── stripe-webhook.ts          # POST /api/stripe-webhook
src/
├── app/
│   ├── core/          # Servicios globales, guards, interceptores y stores
│   ├── features/      # Módulos de página (Home, Catalogue, Cart, Admin...)
│   ├── shared/        # Componentes UI reutilizables (Navbar, Footer, ProductCard...)
│   └── app.config.ts  # Configuración global (Zoneless, Transloco, Firebase)
├── assets/            # Imágenes y archivos de traducción
└── styles/            # Mixins, variables y estilos globales
```

---

Created with ❤️ by [anbreaker](https://github.com/Anbreaker) powerfull by [rootdevs](https://rootdevs.es/)
