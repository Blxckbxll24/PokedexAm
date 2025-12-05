# 🐾 Pokedex PWA - Evaluación DevOps

Una Progressive Web App moderna para explorar el mundo Pokemon, desarrollada con React, TypeScript y Vite, cumpliendo todos los requisitos de la evaluación DevOps.

## ✨ Características Principales

### 🎯 Requisitos Cumplidos
- ✅ **30+ Pokemon** cargados desde PokeAPI
- ✅ **PWA Completa** (offline, installable, notifications)
- ✅ **Modal Interactivo** con estadísticas detalladas
- ✅ **Diseño Responsivo** (móvil → desktop)
- ✅ **Pipeline CI/CD** configurado
- ✅ **Testing Automatizado**

### 🛠️ Stack Tecnológico
- **Frontend:** React 19.2.0 + TypeScript
- **Build Tool:** Vite 7.2.6 + @vitejs/plugin-react-swc
- **Styling:** Tailwind CSS 4.0 con plugin oficial
- **PWA:** vite-plugin-pwa con Workbox
- **Testing:** Vitest + React Testing Library
- **API:** PokeAPI REST integration
- **CI/CD:** Jenkins + SonarQube

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build para producción  
npm run build

# Preview del build
npm run preview

# Tests
npm run test:run

# Linting
npm run lint
```

## 📱 Características PWA

### Service Workers
- **Caching automático** de assets estáticos
- **Estrategia StaleWhileRevalidate** para imágenes Pokemon
- **NetworkFirst** para datos de API
- **Funcionalidad offline** completa

### Web App Manifest
- **Installable** como app nativa
- **Standalone display** mode
- **Íconos** optimizados (192x192, 512x512)
- **Theme color** Pokemon rojo (#DC0A2D)

### Push Notifications
- **Sistema integrado** de notificaciones
- **Permisos automáticos** al seleccionar Pokemon
- **Notificaciones personalizadas** por Pokemon

## 🎨 Diseño Responsivo

### Grid Adaptativo
```css
grid-cols-1          /* Móvil: 1 columna */
sm:grid-cols-2       /* Tablet: 2 columnas */  
lg:grid-cols-3       /* Desktop: 3 columnas */
xl:grid-cols-4       /* Large: 4 columnas */
2xl:grid-cols-5      /* XL: 5 columnas */
```

### Breakpoints Tailwind
- **sm:** 640px+
- **lg:** 1024px+  
- **xl:** 1280px+
- **2xl:** 1536px+

## 🧪 Testing

```bash
# Tests una vez
npm run test:run

# Tests en modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

### Archivos de Test
- `src/test/PokemonCard.test.tsx` - Tests de componentes
- Configuración con Vitest y React Testing Library

## 🔧 Configuración

### Tailwind CSS
- **Plugin oficial:** `@tailwindcss/vite`
- **Colores personalizados:** pokemon-red, pokemon-blue
- **Configuración:** `tailwind.config.js`

### Vite Configuration
```typescript
plugins: [
  react(),
  tailwindcss(),
  VitePWA({...})
]
```

## 📊 API Integration

### PokeAPI Endpoints
- **Lista:** `https://pokeapi.co/api/v2/pokemon?limit=30`
- **Detalles:** `https://pokeapi.co/api/v2/pokemon/{id}`
- **Imágenes:** GitHub sprites repository

### Caching Strategy
- **Map-based caching** para evitar requests duplicados
- **Persistent cache** via service workers
- **Error handling** robusto

## 🚢 Despliegue

### Build de Producción
```bash
npm run build
# Genera: dist/index.html, assets/, sw.js, manifest.webmanifest
```

### Estructura de Salida
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].css
│   └── index-[hash].js
├── sw.js                    # Service Worker
├── manifest.webmanifest     # PWA Manifest
└── workbox-[hash].js       # Workbox runtime
```

## 🔄 CI/CD Pipeline

### Jenkinsfile
- **Develop branch:** Build + Test + Deploy staging
- **Main branch:** Build + Test + SonarQube + Deploy production
- **Pull Requests:** Build + Test only

### Stages
1. **Checkout:** Clonar repositorio
2. **Install:** npm ci
3. **Lint:** ESLint validation  
4. **Test:** Vitest execution
5. **Build:** Production build
6. **SonarQube:** Code analysis (main only)
7. **Deploy:** Environment deployment

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── PokemonCard.tsx      # Tarjeta Pokemon individual
│   ├── PokemonList.tsx      # Grid principal responsivo  
│   └── PokemonModal.tsx     # Modal con estadísticas
├── services/
│   ├── pokemonAPI.ts        # Cliente PokeAPI
│   └── notificationService.ts # Push notifications
├── types/
│   └── pokemon.ts           # Interfaces TypeScript
├── test/
│   └── PokemonCard.test.tsx # Tests de componentes
├── App.tsx                  # Componente raíz
├── App.css                  # Tailwind directives
├── main.tsx                 # Entry point
└── index.css               # Global styles
```

## 🎯 Objetivos Completados

### Funcionalidad Core
- [x] Mostrar 30+ Pokemon de PokeAPI
- [x] Modal con estadísticas al hacer clic
- [x] Diseño responsivo completo
- [x] PWA installable y offline

### Aspectos Técnicos  
- [x] React + TypeScript setup
- [x] Vite build optimization
- [x] Tailwind CSS styling
- [x] Service Workers
- [x] Web App Manifest
- [x] Push Notifications

### DevOps & Quality
- [x] Jenkins CI/CD pipeline  
- [x] Automated testing
- [x] ESLint configuration
- [x] SonarQube integration
- [x] Docker support

---

**Desarrollado para Evaluación DevOps - Diciembre 2025**

*Implementación completa del ciclo de vida de desarrollo de software (SDLC) seguro y automatizado*

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
