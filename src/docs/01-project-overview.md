# Project Overview & Architecture

## Project Summary

This is a **Next.js 15** e-commerce frontend application using the **Page Router** pattern, built with **TypeScript**, **Tailwind CSS**, and **HeroUI** component library. The project follows a modular architecture with clear separation between pages, components, and business logic.

## Tech Stack

- **Next.js 15.1.6** with Page Router
- **React 19** with React Hook Form
- **TypeScript 5** with strict configuration
- **Tailwind CSS 3.4** with custom theming
- **HeroUI 2.7.6** (UI component library)
- **TanStack Query 5.66.5** (data fetching & caching)
- **i18next** for internationalization
- **Framer Motion** for animations
- **Zod** for schema validation
- **nuqs** for URL state management
- **Swiper** for carousels/sliders

## Architecture Patterns

### 1. Modular Structure

```
src/
├── pages/           # Next.js pages (Page Router)
│   ├── _app.tsx     # Root app component
│   ├── _document.tsx# Document configuration
│   └── [routes]/    # Route-based pages
└── modules/         # Business logic modules
    ├── _api/        # API clients & data fetching
    ├── assets/      # Static assets (SVG, PNG)
    ├── common/      # Shared components & utilities
    ├── config/      # Configuration files
    ├── fonts/       # Font assets
    ├── i18next/     # Internationalization
    ├── layouts/     # Layout components
    ├── pages/       # Screen components (business logic)
    └── values/      # Constants and dummy data
```

### 2. Page Router Pattern

- **Pages Directory**: Contains only Next.js routing files
- **Screen Components**: Business logic lives in `/modules/pages/`
- **Route Mapping**: Each page imports its corresponding screen component

Example:

```tsx
// src/pages/product/[slug]/index.tsx
import ProductDetailScreen from '@/modules/pages/Product/ProductDetailScreen';

export default function Page() {
  return <ProductDetailScreen />;
}
```

### 3. Component Architecture

- **Base Components**: Extended HeroUI components with custom variants
- **Business Components**: Feature-specific components in modules
- **Layout Components**: Header, Footer, and page layouts
- **Utility Components**: Reusable UI elements (Box, Col, Row, etc.)

### 4. State Management

- **TanStack Query**: API state management with caching
- **React Context**: Global state (auth, product filters)
- **React Hook Form**: Form state management
- **nuqs**: URL state synchronization
- **Local Storage**: Persistent client state

### 5. Data Flow Architecture

```
API Layer → TanStack Query → React Context → Components
     ↓
  baseFetch → apiClient* → useQuery/useMutation → Screens
```

## Build & Deployment Configuration

### Static Export

The project is configured for **static export** (`output: 'export'`):

- Generates static HTML/CSS/JS files
- Suitable for CDN deployment
- Trailing slash enabled for dynamic routes
- Images unoptimized for static hosting

### Development vs Production

- **Development**: `npm run dev` (Next.js dev server)
- **Build**: `npm run build` (static export)
- **Lint**: TypeScript checking + ESLint
- **Static Serve**: Using `serve` package for SPA hosting

## Key Dependencies Explained

### Core Libraries

- **@heroui/react**: Primary UI component library (alternative to Material-UI/Chakra)
- **@hookform/resolvers**: React Hook Form integration with validation libraries
- **@tanstack/react-query**: Server state management and caching
- **nuqs**: Type-safe URL state management
- **zod**: TypeScript-first schema validation

### Development Tools

- **@svgr/webpack**: SVG to React component conversion
- **husky**: Git hooks for code quality
- **prettier**: Code formatting
- **volta**: Node.js version management

## Environment Configuration

The project uses environment variables for API configuration:

- `NEXT_PUBLIC_API_BASE_URL_API`: API base URL
- `NEXT_PUBLIC_API_VERSION`: API version
- `NEXT_PUBLIC_DEV_DEBUG`: Development debugging flags

## TypeScript Configuration

- **Strict mode enabled** with proper type safety
- **Path aliases** for clean imports (`@/modules/*`, `@/components/*`)
- **Module resolution**: Bundle resolution for Next.js compatibility
- **ES2017 target** with modern JavaScript features
