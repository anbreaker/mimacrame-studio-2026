# Mimacramé Studio — Design Brief para Stitch

> Documento de referencia visual para diseñar la interfaz de la tienda virtual.
> Úsalo como prompt en Stitch para generar los mockups de cada pantalla.

---

## 1. Visión general del proyecto

**Qué es**: Tienda virtual de joyería y bisutería artesanal de macramé. Productos hechos a mano con hilo de algodón encerado, hilo de seda y cuero: pulseras, colgantes, collares, tobilleras, anillos, adornos corporales y conjuntos.

**Quién la usa**:

- **Compradores** (mujeres y hombres, 18-40 años, estilo boho/festival/playa/mediterráneo) — acceden mayoritariamente desde móvil. Buscan bisutería única, artesanal, que no se vea en ninguna otra tienda.
- **Administradora** (la artesana, dueña del negocio) — gestiona productos, pedidos y categorías desde su móvil o tablet.

**Tono visual**: joyería artesanal viva y alegre. Energía de playa, festival de verano, Ibiza, Algarve. Colores mediterráneos vibrantes. Piezas lucidas en la piel, en la playa, en la naturaleza.

---

## 2. Identidad visual

### Paleta de colores

> Inspiración: acantilados ocre del Algarve, turquesa del Mediterráneo, bougainvillea ibicenca, puestas de sol sobre el mar.

#### Modo claro (Light mode)

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-background` | `#FEFCF8` | Fondo principal (blanco cálido arena) |
| `--color-surface` | `#FFFFFF` | Tarjetas, modales |
| `--color-surface-alt` | `#FFF3EC` | Fondo alternativo (tono melocotón muy suave) |
| `--color-primary` | `#E85D26` | Color principal (terracota Algarve — acantilados quemados) |
| `--color-primary-dark` | `#C44A18` | Hover del primario |
| `--color-accent` | `#0AADBD` | Acento turquesa mediterráneo |
| `--color-accent-secondary` | `#F5A623` | Sol ibicenco (amarillo dorado intenso) |
| `--color-text` | `#1A0D06` | Texto principal (casi negro cálido) |
| `--color-text-muted` | `#7A5C4E` | Texto secundario |
| `--color-border` | `#F0D8C8` | Bordes y divisores |
| `--color-success` | `#1FAD74` | Confirmaciones (verde esmeralda) |
| `--color-danger` | `#E02020` | Errores |

#### Modo oscuro (Dark mode — por defecto)

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-background` | `#0C1B2B` | Fondo principal (azul noche mediterránea profunda) |
| `--color-surface` | `#152336` | Tarjetas, modales |
| `--color-surface-alt` | `#1C2E42` | Fondo alternativo |
| `--color-primary` | `#FF6B3D` | Color principal (coral puesta de sol ibicenca) |
| `--color-primary-dark` | `#FF9070` | Hover del primario |
| `--color-accent` | `#22D4E8` | Turquesa brillante del mar |
| `--color-accent-secondary` | `#FFB830` | Dorado cálido de la arena |
| `--color-text` | `#F5EFE8` | Texto principal (blanco arena cálido) |
| `--color-text-muted` | `#9BAAB8` | Texto secundario |
| `--color-border` | `#243650` | Bordes y divisores |
| `--color-success` | `#2ECC8A` | Confirmaciones |
| `--color-danger` | `#FF4D4D` | Errores |

### Tipografía

- **Títulos y nombre de marca**: Serif elegante — `Playfair Display` o `Cormorant Garamond` (Google Fonts, gratis). Evoca lujo artesanal, joyería boutique.
- **Cuerpo y UI**: Sans-serif limpia — `Inter` o `DM Sans`
- **Tamaños base**:
  - H1: 32px (móvil) / 48px (desktop)
  - H2: 24px / 36px
  - H3: 20px / 28px
  - Body: 16px
  - Small: 14px
  - Caption: 12px

### Estilo visual

- Esquinas redondeadas: `12px` para tarjetas, `8px` para botones, `100px` para pills/badges y swatches de color
- Sombras sutiles con tinte cálido (no grises neutros)
- Iconos: estilo línea fina (Lucide Icons o Feather Icons)
- **Fotografías**: lifestyle — las piezas LUCIDAS en la piel, en la playa, en la naturaleza. Nunca sobre fondo blanco de catálogo. Manos con pulseras, cuello con colgante, tobillo en la arena.
- **Fondo de producto en tarjetas**: foto cuadrada con la pieza puesta (no sobre mesa)

---

## 3. Categorías de productos

| Categoría | Descripción | Ejemplos de variantes |
|-----------|-------------|----------------------|
| **Pulseras** | Para la muñeca, simples o apiladas | Talla (XS/S/M/L) + Color del hilo |
| **Colgantes** | Para el cuello, con cordón o cadena de macramé | Longitud (corto/largo) + Color |
| **Collares** | Collar completo tejido en macramé | Talla cuello + Color |
| **Tobilleras** | Para el tobillo, estilo playa/festival | Talla (S/M/L) + Color |
| **Pendientes** | Pendientes tejidos en macramé, estilo boho | Longitud + Color |
| **Anillos** | Anillos tejidos en macramé fino | Talla (13-20) + Color |
| **Conjuntos** | Pack coordinado (ej: pulsera + tobillera) | Talla + Color |
| **Adornos corporales** | Body jewelry, piezas para festivals, looks especiales | Talla + Color |

---

## 4. Layout y breakpoints (Mobile-first)

```
Mobile:   < 768px   → 1 columna, bottom navigation bar
Tablet:   768-1024px → 2 columnas, sidebar navigation opcional
Desktop:  > 1024px  → 3-4 columnas, top navigation
```

**Componentes de navegación según dispositivo**:

- **Móvil**: bottom navigation bar fija (4 iconos: Inicio, Colección, Carrito, Menú)
- **Desktop**: top header con logo centrado, navegación horizontal y carrito en la esquina derecha

---

## 5. Pantallas de la tienda pública

### 5.1 Home (`/`)

**Propósito**: Primera impresión. Transmitir la energía mediterránea y artesanal, e invitar a explorar la colección de joyería.

**Secciones (de arriba a abajo)**:

1. **Header/Navbar**
   - Logo: "Mimacramé" con tipografía serif elegante, centrado en móvil
   - Iconos derecha: búsqueda, carrito (con badge de cantidad)
   - Móvil: icono hamburguesa o bottom nav

2. **Hero section**
   - Foto lifestyle a pantalla completa: manos con pulseras apiladas sobre fondo de playa o pared de cal blanca ibicenca
   - Título grande (serif): *"Joyería que cuenta tu historia"*
   - Subtítulo: *"Macramé artesanal hecho a mano, pieza a pieza"*
   - CTA button primario: "Ver colección"
   - Indicador de scroll (chevron abajo)

3. **Categorías** (scroll horizontal en móvil, grid en desktop)
   - 6 tarjetas circulares o cuadradas con foto lifestyle + nombre
   - Pulseras · Colgantes · Collares · Tobilleras · Pendientes · Anillos · Conjuntos
   - Foto: la pieza lucida en la piel, fondo natural

4. **Productos destacados** — "Más vendidos"
   - Grid: 2 columnas (móvil) / 4 columnas (desktop)
   - Tarjeta de producto: foto lifestyle (pieza puesta), nombre, precio, badge "Nuevo" o "Agotado"
   - Título de sección: *"Nuestras favoritas"*

5. **Look del momento** (sección editorial)
   - 1 foto grande de un look completo (pulseras + tobillera + collar coordinados)
   - Texto superpuesto: *"Apila, combina, hazlo tuyo"*
   - CTA: "Ver conjuntos"

6. **About / Historia de la artesana**
   - Foto de la artesana tejiendo, manos trabajando el hilo
   - Texto: quién soy, por qué hago macramé, cada pieza es única y hecha con amor
   - Valores: artesanal · sostenible · único · hecho a mano

7. **Proceso de creación** (3 pasos)
   - 1. Elegir tu pieza
   - 1. La tejemos para ti
   - 1. La recibes en casa
   - Fondo con color surface-alt

8. **Footer**
   - Logo, redes sociales (Instagram principalmente — muy importante para este negocio)
   - Links: Política de privacidad · Envíos y devoluciones · Contacto · Cuidados de tu pieza
   - Copyright

---

### 5.2 Catálogo (`/catalogue`)

**Propósito**: Explorar y filtrar toda la colección de joyería.

**Layout**:

- **Móvil**: botón "Filtros" arriba que abre un bottom sheet con opciones
- **Desktop**: sidebar de filtros a la izquierda (colapsable), grid de productos a la derecha

**Componentes**:

1. **Barra de acciones**
   - Búsqueda inline
   - Botón "Filtros" con badge del número de filtros activos
   - Ordenar: "Más recientes · Precio: menor a mayor · Precio: mayor a menor · Más vendidos"
   - Contador: "24 piezas"

2. **Panel de filtros**
   - Categoría (checkboxes): Pulseras · Colgantes · Collares · Tobilleras · Pendientes · Anillos · Conjuntos · Adornos
   - Color del hilo (swatches circulares): blanco · negro · coral · turquesa · natural · burdeos · dorado · multicolor
   - Precio (range slider): €0 — €80
   - Disponibilidad: "Solo en stock"
   - Botón "Aplicar" + "Limpiar todo"

3. **Grid de productos**
   - 2 col (móvil) / 3 col (tablet) / 4 col (desktop)
   - Tarjeta: foto lifestyle de la pieza puesta, nombre, precio, color chips disponibles, badge "Nuevo" o "Agotado"
   - Botón "Cargar más" o infinite scroll

---

### 5.3 Detalle de producto (`/catalogue/:id`)

**Propósito**: Mostrar la joya en todo su esplendor. Convencer al usuario de que es única y hecha para él/ella.

**Layout móvil** (scroll vertical):

1. **Galería de imágenes** (swipe horizontal, con dots de paginación)
   - Foto 1: la pieza puesta en la muñeca / cuello / tobillo (lifestyle)
   - Foto 2: detalle del tejido, los nudos, los materiales
   - Foto 3: la pieza sobre fondo natural (madera, arena, piedra)
   - Foto 4+: looks combinados

2. Nombre del producto (serif, grande): ej. *"Pulsera Mediterránea"*
3. Precio (destacado, color primario): ej. **€18,00**
4. Badge de disponibilidad: "En stock" / "Últimas unidades" / "Agotado"
5. **Selector de color** — swatches circulares con el color del hilo (cambia la foto principal al seleccionar)
6. **Selector de talla** — pills con tallas disponibles: XS · S · M · L · XL + link "¿Cómo medir mi muñeca?"
7. Descripción corta: materiales, longitud, detalle del tejido (2-3 líneas)
8. Contador de cantidad (- 1 +)
9. **Botón CTA**: "Añadir al carrito" (fullwidth, color primario, prominente)
10. Botón secundario: "Comprar ahora" → directo a checkout
11. **Acordeón de información**:
    - Materiales — tipo de hilo, color, acabados
    - Medidas — longitud total, circunferencia, ajuste
    - Cuidados — cómo conservar tu pieza de macramé
    - Envíos y devoluciones
12. **"También te puede gustar"** — scroll horizontal, 4 piezas de la misma categoría o complementarias

**Layout desktop**: galería izquierda (con thumbnails debajo), info derecha (sticky al hacer scroll)

---

### 5.4 Carrito (`/cart`)

**En móvil**: página completa (al tocar icono carrito del bottom nav)
**En desktop**: drawer/panel deslizante desde la derecha

**Componentes**:

1. Header: *"Tu carrito · 3 piezas"*
2. Lista de items:
   - Foto miniatura (lifestyle) + nombre + variante seleccionada (color + talla)
   - Precio unitario
   - Contador cantidad (- 1 +)
   - Botón eliminar (X)
3. Resumen de costes:
   - Subtotal: €XX.XX
   - Envío: "Gratis a partir de €40" o precio calculado
   - Total: €XX.XX (tipografía grande, destacada)
4. CTA: **"Proceder al pago"** (fullwidth, color primario)
5. Link: "Seguir comprando"
6. Sección: "Pago seguro con" (iconos: Visa, Mastercard, PayPal, Bizum)

**Estado vacío**: ilustración minimalista de una pulsera + *"Tu carrito está vacío"* + botón "Ver colección"

---

### 5.5 Checkout (`/checkout`)

**Propósito**: Completar la compra con la mínima fricción posible.

**En móvil**: 1 página con secciones colapsables tipo acordeón
**En desktop**: 2 columnas (formulario izquierda, resumen sticky derecha)

**Columna izquierda (formulario)**:

1. **Contacto**
   - Email (para confirmación del pedido)
   - Teléfono (para actualizaciones de envío)

2. **Dirección de envío**
   - Nombre completo
   - Dirección + número
   - Código postal + Ciudad
   - Provincia
   - País (select, default: España)

3. **Método de pago**
   - Selector visual con 3 opciones en cards:
     - 💳 **Tarjeta** — Stripe Elements embebido (aparece inline al seleccionar)
     - 📱 **Bizum** — redirección a app bancaria
     - 🅿️ **PayPal** — redirección a PayPal
   - Badge de seguridad: "Pago 100% seguro · SSL"

4. **Botón "Confirmar pedido — €XX.XX"** (fullwidth, prominente)

**Columna derecha (resumen sticky)**:

- Mini-lista: foto + nombre + variante + precio de cada pieza
- Subtotal · Envío · Total
- Iconos de seguridad Stripe + SSL

---

### 5.6 Confirmación de pedido (`/order-confirmation`)

**Estado éxito**:

- Animación suave: check verde con confetti ligero (partículas en colores mediterráneos)
- Título: *"¡Tu pedido está en camino!"*
- Subtítulo: *"Hemos enviado la confirmación a tu email"*
- Número de pedido: #MIM-2024-001
- Resumen: fotos de las piezas + total pagado
- *"Empezamos a tejer tu pedido con mucho cariño 🧶"*
- CTA: "Seguir comprando"

**Estado error (pago fallido)**:

- Icono X con animación suave
- Título: *"El pago no se pudo completar"*
- Texto: motivo si está disponible
- Botón: "Intentarlo de nuevo"

---

## 6. Dashboard de administración (`/admin`)

> Diseño funcional y limpio. Mismo sistema de colores (dark/light), layout diferente.
> La artesana lo usará principalmente desde móvil o tablet para gestionar pedidos y subir productos.

### 6.1 Login admin (`/admin/login`)

- Logo centrado
- Card central:
  - Email + Contraseña
  - Botón "Entrar"
- Sin registro (acceso solo para la admin)

---

### 6.2 Dashboard principal (`/admin/dashboard`)

**Layout**: Sidebar izquierdo (desktop) / Bottom tabs (móvil)

**Navegación**:

- 🏠 Inicio
- 💍 Productos
- 📦 Pedidos
- 🗂️ Categorías
- 🚪 Cerrar sesión

**Contenido**:

1. **Métricas rápidas** (4 cards con iconos):
   - Pedidos pendientes (badge de alerta si hay >0)
   - Pedidos este mes
   - Ingresos este mes (€)
   - Piezas activas en tienda

2. **Últimos pedidos** (lista simplificada):
   - Nº pedido · Piezas compradas · Total · Estado (chip de color) · Fecha

3. **Aviso de stock bajo**: piezas con 1-2 unidades restantes

---

### 6.3 Gestión de productos (`/admin/products`)

**Lista**:

- Búsqueda + botón **"+ Nueva pieza"**
- Lista con: foto miniatura · nombre · categoría · precio · stock · estado · acciones (editar / eliminar)

**Formulario crear/editar** (página separada o modal grande):

- **Imágenes**: zona drag & drop — hasta 6 fotos (preview inmediato, reordenable)
  - Indicación: *"Sube fotos con la pieza puesta — ¡quedan mucho más bonitas!"*
- **Información básica**:
  - Nombre (con tab por idioma: 🇪🇸 ES / 🇬🇧 EN / 🇵🇹 PT)
  - Descripción (con tab por idioma: 🇪🇸 ES / 🇬🇧 EN / 🇵🇹 PT)
  - Categoría (select)
  - Precio (€)
  - Estado: Activo · Borrador · Agotado
- **Variantes**:
  - Colores disponibles: selector de chips de color + botón "Añadir color" con color picker
  - Tallas disponibles con stock por talla: ej. XS(3) S(5) M(2) L(0)
- **Detalles técnicos** (texto libre):
  - Materiales
  - Medidas / longitud
  - Cuidados
- Botones: "Guardar pieza" / "Cancelar"

---

### 6.4 Gestión de pedidos (`/admin/orders`)

**Lista**:

- Filtros: Estado (Todos · Nuevo · Preparando · Enviado · Entregado · Cancelado) · Fecha
- Lista: Nº pedido · Piezas · Total · Método de pago · Estado (chip) · Fecha

**Detalle de pedido**:

- Cliente: nombre + email + teléfono + dirección de envío
- Piezas del pedido (foto + nombre + color + talla + cantidad + precio)
- Total y método de pago
- **Timeline de estado**: Nuevo → Preparando → Enviado → Entregado (stepper visual)
- Campo: número de seguimiento del envío
- Notas internas (solo visibles para la admin)
- Botón: "Marcar como [siguiente estado]"

---

### 6.5 Gestión de categorías (`/admin/categories`)

- Lista: nombre + nº de piezas en esa categoría
- Botón "+ Nueva categoría"
- Formulario: nombre (ES/EN/PT) + imagen representativa
- Reordenar categorías (drag & drop)

---

## 7. Componentes UI reutilizables

| Componente | Descripción |
|-----------|-------------|
| `ProductCard` | Foto lifestyle + nombre + precio + chips de colores disponibles + badge |
| `CategoryCard` | Tarjeta circular o cuadrada con foto + nombre superpuesto |
| `ColorSwatch` | Círculo de color seleccionable con borde al activar |
| `SizeSelector` | Pills de talla (XS/S/M/L/XL) con estado activo/agotado |
| `CartItem` | Foto miniatura + nombre + variante (color+talla) + cantidad + precio |
| `PriceDisplay` | Precio formateado en €, tachado si hay precio original |
| `Badge` | Pills: "Nuevo" (turquesa) · "Agotado" (gris) · "Últimas unidades" (coral) |
| `QuantitySelector` | Botones − y + con número en el centro |
| `ImageGallery` | Swipe en móvil con dots, thumbnails en desktop |
| `SizeGuide` | Modal/sheet con tabla de medidas de muñeca/cuello/tobillo |
| `LoadingSpinner` | Spinner minimalista con color primario |
| `EmptyState` | Ilustración lineal de pulsera + mensaje + CTA |
| `BottomNav` | Barra de navegación inferior (solo móvil): Inicio · Colección · Carrito · Menú |
| `ThemeToggle` | Switch sol ☀️ / luna 🌙 para dark/light mode |
| `LanguageSelector` | Selector compacto: ES · EN · PT |
| `StatusChip` | Chip de color para estado del pedido: Nuevo (turquesa) · Preparando (dorado) · Enviado (azul) · Entregado (verde) |

---

## 8. Flujos de usuario principales

### Flujo de compra (Happy path)

```
Home
  → Ver "Pulsera Mediterránea" en Más vendidas
  → Detalle de producto → Elegir color turquesa + talla M
  → "Añadir al carrito"
  → Carrito → Revisar pedido (1 pulsera, €18)
  → Checkout → Email + Dirección → Pagar con Bizum
  → Confirmación ✅ — "¡Tu pedido está en camino!"
```

### Flujo admin (subir nueva pieza)

```
Login admin
  → Dashboard → Ver pedidos nuevos
  → Productos → "+ Nueva pieza"
  → Subir 4 fotos lifestyle → Nombre + descripción (ES/EN/PT)
  → Añadir colores + tallas con stock → Guardar
  → La pieza aparece en la tienda ✅
```

---

## 9. Notas para diseño en Stitch

- **Mobile-first siempre**: diseña primero para 390px (iPhone 14) y adapta a desktop
- **Dark mode es el default**: empieza diseñando en modo oscuro con fondo `#0C1B2B`
- **Fotografías**: siempre lifestyle — la joya puesta en la piel, no sobre mesa. Usar placeholders con tonos mediterráneos (coral, turquesa, arena)
- **Las pulseras se apilan**: en la hero y en el catálogo mostrar varios productos juntos, estilo "stacked bracelets"
- **Variantes son clave**: el selector de color (swatches) y talla deben ser muy visibles en la tarjeta y en el detalle
- **Espaciado generoso**: padding mínimo 16px móvil, 24px desktop
- **Tipografía serif para títulos y nombre de piezas**: da personalidad de joyería boutique
- **CTA "Añadir al carrito"**: siempre el elemento más prominente en la pantalla de detalle
- **Bottom navigation en móvil**: siempre visible, 4 items
- **Estados vacíos**: carrito vacío, sin pedidos, búsqueda sin resultados

---

## 10. Referencia visual

- **Estilo joyería boho**: buscar en Pinterest "macramé jewelry", "macramé bracelet boho", "macramé festival jewelry"
- **Estilo fotográfico**: buscar "jewelry lifestyle photography beach", "stacked bracelets beach"
- **Paleta y mood**: buscar "Algarve summer colors", "Ibiza boho style", "Mediterranean jewelry brand"
