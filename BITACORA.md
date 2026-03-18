# Bitácora — Mimacramé Studio 2026

Registro de sesiones de desarrollo, decisiones y avances del proyecto.

---

## 2026-03-17 — Sesión 1: Planificación completa + Setup

### Contexto

Tienda online para Mimacramé Studio, marca de joyería artesanal de macramé de Badajoz, Extremadura.
Diseño visual creado en Google Stitch (~15 pantallas: tienda pública + panel admin).

### Decisiones tomadas

- **Stack**: Angular 21 zoneless + Signals + TypeScript strict
- **Backend**: Firebase (Auth + Firestore + Storage + Hosting)
- **Pagos**: Stripe con Firebase Function `createPaymentIntent` (Opción B — server-side desde el inicio)
- **Arquitectura**: Screaming Architecture (feature-first folders)
- **i18n**: ngx-translate, 3 idiomas (es/en/pt)
- **Colores**: Del Home Mobile de Stitch — navy `#0C1B2B`, coral `#E8622A`, brown cards, white text
- **Categorías**: Pulseras / Colgantes / Pendientes / Anillos / Tobilleras / Sets
- **Ubicación de la marca**: Badajoz, Extremadura (no Alicante)

### Artefactos SDD creados (en Engram)

- `sdd/mimacrame-tienda-virtual/exploration-v2`
- `sdd/mimacrame-tienda-virtual/proposal`
- `sdd/mimacrame-tienda-virtual/spec` — 20 requisitos, 62 escenarios
- `sdd/mimacrame-tienda-virtual/design`
- `sdd/mimacrame-tienda-virtual/tasks` — 39 tareas en 6 fases

### Trabajo implementado (Phase 0 — Setup)

- [x] 0.1 Dependencias instaladas: firebase, @angular/fire, @stripe/stripe-js
- [x] 0.2 Firebase environment config (model + todos los entornos)
- [x] 0.3 Firebase providers en app.config.ts
- [x] 0.4 Design tokens Mimacramé en `_colors.scss`
- [x] 0.5 routes.ts const con todas las rutas
- [x] 0.6 app.routes.ts lazy-loaded + 11 stubs de componentes + auth.guard.ts
- [x] .gitignore actualizado (Firebase, Functions, secrets, Stripe CLI)

### Pendiente siguiente sesión

- Phase 1: cart.store, auth.store, auth.service, product.service, order.service, upload.service, catalogue.store
- Configurar credenciales reales de Firebase y Stripe en environments

---

## 2026-03-18 — Sesión 2: Phase 1 — Stores y servicios core

### Lección aprendida

- Enums siempre en inglés (claves de código, no texto visible)
- Mensajes de error como claves i18n, nunca strings hardcodeados en castellano
- Ternarios en lugar de if/else
- Código autodocumentado en inglés

### Phase 1 completada

**Enums**

- [x] `product-category.enum.ts` — Bracelets, Pendants, Earrings, Rings, Anklets, Sets
- [x] `order-status.enum.ts` — Pending, Paid, Processing, Shipped, Delivered, Cancelled, Refunded

**Interfaces de dominio**

- [x] `product.interface.ts` — Product, ProductCreate, ProductUpdate
- [x] `cart.interface.ts` — CartItem, Cart
- [x] `order.interface.ts` — Order, OrderCreate, ShippingAddress
- [x] `user.interface.ts` — AppUser

**Servicios**

- [x] `auth.service.ts` — Firebase Auth: login, logout, currentUser$ (con isAdmin desde Firestore)
- [x] `product.service.ts` — Firestore CRUD: getAll, getActive, getByCategory, create, update, delete
- [x] `order.service.ts` — Firestore: create, getAll, getByUser, updateStatus
- [x] `upload.service.ts` — Firebase Storage: uploadProductImage, deleteImage

**Stores (Signals)**

- [x] `auth.store.ts` — user, isLoggedIn, isAdmin, displayName, login(), logout()
- [x] `catalogue.store.ts` — products, filteredProducts, selectedCategory, searchQuery, totalCount
- [x] `cart.store.ts` — items, itemCount, total, isEmpty + persistencia en localStorage

**Correcciones**

- [x] `auth.guard.ts` — guard real con Firebase Auth (reemplaza stub)
- [x] `app.spec.ts` — corregido import de AppComponent

### Pendiente siguiente sesión

- Phase 2: Componentes UI — Home, Catalogue, ProductDetail, Cart, Checkout
- Configurar credenciales reales de Firebase y Stripe en environments

---

> Para ver el plan completo de 39 tareas consultar Engram: `sdd/mimacrame-tienda-virtual/tasks`
