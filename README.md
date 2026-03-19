# Mimacramé Studio 2026

High-end handcrafted e-commerce platform specializing in handmade macramé jewelry. Built with the most cutting-edge technologies in the web ecosystem to offer an ultra-fast, reactive, and multi-language experience.

## 🚀 Tech Stack

- **Framework:** [Angular 21](https://angular.dev/) (**Zoneless** experimental mode).
- **Build Tool / Dev Server:** [Vite](https://vitejs.dev/) for instantaneous development.
- **State & Reactivity:** **Signal-First** architecture (Signals, Computed, Effects).
- **Internationalization:** [Transloco](https://ngneat.github.io/transloco/) with support for **English, Spanish, and Portuguese**.
- **Backend & Auth:** [Firebase](https://firebase.google.com/) (Firestore, Authentication, Storage).
- **Forms:** `@angular/forms/signals` (Signal Forms).
- **Styling:** SCSS following **BEM Nested** methodology.
- **Testing:** [Vitest](https://vitest.dev/) for high-speed unit testing.

## 🏛️ Architecture & Principles

- **Screaming Architecture:** Folder structure reveals business intent (`features`, `core`, `shared`).
- **Mobile First:** Optimized design for mobile devices with adaptive navigation.
- **Zoneless Performance:** Elimination of `zone.js` to minimize change detection cycles and improve performance.
- **Type Safety:** Strict use of TypeScript and interfaces for all data models.

## 🛠️ Development

### Dependency Installation

```bash
npm install
```

### Development Server (Vite)

```bash
npm run dev
```

Navigate to `http://localhost:4200/`. The server supports HMR (Hot Module Replacement).

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
- **Backend & Auth:** [Firebase](https://firebase.google.com/) (Firestore, Authentication, Storage).
- **Formularios:** `@angular/forms/signals` (Signal Forms).
- **Estilos:** SCSS siguiendo la metodología **BEM Nested**.
- **Testing:** [Vitest](https://vitest.dev/) para unit testing de alta velocidad.

## 🏛️ Arquitectura y Principios

- **Screaming Architecture:** La estructura de carpetas revela la intención del negocio (`features`, `core`, `shared`).
- **Mobile First:** Diseño optimizado para dispositivos móviles con navegación adaptativa.
- **Zoneless Performance:** Eliminación de `zone.js` para minimizar los ciclos de detección de cambios y mejorar el rendimiento.
- **Type Safety:** Uso estricto de TypeScript e interfaces para todos los modelos de datos.

## 🛠️ Desarrollo

### Instalación de dependencias

```bash
npm install
```

### Servidor de desarrollo (Vite)

```bash
npm run dev
```

Navega a `http://localhost:4200/`. El servidor soporta HMR (Hot Module Replacement).

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
