# 🔐 Anonimizador de Datos - Frontend

Interfaz web profesional para anonimizar datos sensibles con tecnología NLP de clase mundial.

## ✨ Características

- **🚀 Moderno & Rápido** - Construido con Next.js 14 y React 18
- **🎨 Diseño Profesional** - Interfaz de Figma/Stripe nivel
- **🌙 Dark Mode** - Soporte completo para tema oscuro/claro
- **📱 Responsive** - Funciona perfectamente en todos los dispositivos
- **⚡ Animaciones Suaves** - Transiciones elegantes con Framer Motion
- **🔒 100% Local** - Procesamiento sin envío a la nube
- **🧠 NLP Inteligente** - Detección automática de datos sensibles

## 🛠️ Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **UI:** React 18+ con TailwindCSS 3+
- **Componentes:** shadcn/ui pattern
- **State:** Zustand (ligero y rápido)
- **Animaciones:** Framer Motion
- **Formularios:** React Hook Form + Zod
- **Temas:** next-themes
- **Iconos:** Lucide React

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- npm 9+ o yarn/pnpm

### Instalación

```bash
cd frontend
npm install
```

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Build

```bash
npm run build
npm start
```

## 📁 Estructura del Proyecto

```
frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   ├── globals.css          # Global styles
│   ├── providers.tsx        # Context providers
│   ├── dashboard/           # Anonymizer workflow
│   ├── help/                # Help & FAQ page
│   └── api/                 # API routes (future)
│
├── components/
│   ├── layout/              # Header, Footer
│   ├── ui/                  # Base components (Button, Card, etc.)
│   ├── anonymizer/          # Domain-specific components
│   └── common/              # Shared utilities
│
├── store/                   # Zustand state management
├── lib/                     # Utilities & helpers
├── public/                  # Static assets
│
├── tailwind.config.ts       # TailwindCSS configuration
├── tsconfig.json            # TypeScript configuration
├── next.config.js           # Next.js configuration
├── postcss.config.js        # PostCSS configuration
└── package.json             # Dependencies
```

## 🎨 Design System

### Colores (Tailwind)
- **Primary:** `from-primary-600 to-primary-700` (Azul)
- **Accent:** `from-accent-500 to-accent-600` (Púrpura)
- **Neutral:** `slate-*` (Grises)
- **Success/Danger/Warning:** Colores semánticos estándar

### Tipografía
- **Headings:** Inter Bold (700 weight)
- **Body:** Inter Regular (400-500 weight)
- **Monospace:** JetBrains Mono

### Componentes Principales
- `Button` - Botones reutilizables con variantes
- `Card` - Contenedores con estilos consistentes
- `Checkbox` - Inputs personalizados
- `FileUpload` - Drag & drop para archivos
- `ColumnSelector` - Multi-select inteligente
- `ProcessingProgress` - Indicador visual de progreso

## 🔄 Flujo de Anonimización (4 Pasos)

1. **Subir Archivo** - Drag & drop o seleccionar CSV/Excel
2. **Configurar** - Elegir columnas a anonimizar
3. **Procesar** - Anonimización con visualización de progreso
4. **Descargar** - Obtener datos anonimizados + mapeos

## 🎯 Estado Management (Zustand)

```typescript
useAnonymizerStore() // Acceso global al estado

// Incluye:
- uploadedFile, fileData, fileColumns
- selectedColumns, selectAll, saveMappings
- currentStep, isProcessing, processingProgress
- statistics, mappings, error
- Actions: setFile, setSelectedColumns, startProcessing, etc.
```

## 📡 API Integration (Próxima)

Endpoints esperados:

```
POST /api/anonymize
  - Input: file, columns, saveMappings, mappingFile?
  - Output: anonymizedData, mappings?, stats

GET /api/anonymize/preview
  - Input: file
  - Output: columns, firstRows, rowCount
```

## 🎬 Animaciones

- **Fade In:** Entrada suave de componentes
- **Slide In:** Animación lateral
- **Pulse Glow:** Efecto de brillo pulsante
- **Hover States:** Transiciones interactivas en botones/cards
- **Progress Bar:** Animación lineal de progreso

## 🌙 Dark Mode

Automático con `next-themes`:
- Detecta preferencias del sistema
- Toggle manual en Header
- Transiciones suaves de 300ms
- Colores específicos para dark mode

## ♿ Accesibilidad

- WCAG 2.1 AA compliant
- Navegación por teclado
- Labels semánticos
- Focus states visibles
- Screen reader friendly

## 📦 Dependencias Principales

```json
{
  "react": "^18.3.1",
  "next": "^14.2.0",
  "tailwindcss": "^3.4.1",
  "zustand": "^4.4.7",
  "framer-motion": "^11.0.3",
  "lucide-react": "^0.369.0",
  "react-hook-form": "^7.51.0",
  "next-themes": "^0.2.1"
}
```

## 🚀 Deployment

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel
```

### Docker
```bash
docker build -t anonimizador .
docker run -p 3000:3000 anonimizador
```

### Self-hosted
```bash
npm run build
npm start
```

## 🤝 Desarrollo

### Agregar Nuevo Componente

```tsx
// components/ui/NewComponent.tsx
'use client'
import { cn } from '@/lib/utils'

export function NewComponent({ className, ...props }) {
  return <div className={cn('base-styles', className)} {...props} />
}
```

### Agregar Nueva Página

```tsx
// app/nueva-pagina/page.tsx
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function Page() {
  return (
    <>
      <Header />
      <main>{/* Content */}</main>
      <Footer />
    </>
  )
}
```

### Usar Store

```tsx
'use client'
import { useAnonymizerStore } from '@/store/anonymizer.store'

export function Component() {
  const { selectedColumns, setSelectedColumns } = useAnonymizerStore()
  // ...
}
```

## 🧪 Testing

(Por implementar)

```bash
npm run test        # Run tests
npm run test:watch # Watch mode
```

## 📝 Guía de Estilo

- **Nombres de Componentes:** PascalCase
- **Nombres de Archivos:** camelCase o kebab-case
- **Props:** camelCase
- **CSS Classes:** Solo TailwindCSS (no custom CSS)
- **Commit Messages:** Conventional commits

## 🐛 Debug

```bash
# Enable Next.js debug logging
DEBUG=* npm run dev

# Check TypeScript
npx tsc --noEmit

# Lint
npm run lint
```

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TailwindCSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Zustand](https://github.com/pmndrs/zustand)

## 📄 Licencia

MIT

## 🙋 Soporte

- 📧 support@anonimizador.com
- 🐙 GitHub Issues
- 💬 Discussions

---

**Construido con ❤️ usando Next.js y React**
