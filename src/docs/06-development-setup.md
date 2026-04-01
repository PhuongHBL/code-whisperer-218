# Project Setup & Development Guidelines

## Quick Start Guide

### 1. Prerequisites

- **Node.js**: Version 22.14.0 (managed by Volta)
- **Package Manager**: Yarn 1.22.22+
- **TypeScript**: Version 5+

### 2. Installation & Setup

```bash
# Clone the repository
git clone [repository-url]
cd lau-choy-seng-fe

# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Run linting
yarn lint

# Format code
yarn fix_prettier
```

### 3. Development Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "lint": "tsc --noemit && next lint",
  "fix_prettier": "prettier --write .",
  "start_spa": "npx serve@latest out",
  "start_spa_rewire": "npx serve@latest -c serve.json"
}
```

## Project Creation Template

When creating a new project based on this template, follow these steps:

### 1. Core Dependencies Installation

```bash
# Framework & React
yarn add next@15.1.6 react@^19.0.0 react-dom@^19.0.0

# TypeScript
yarn add -D typescript@^5 @types/node@^20 @types/react@^19 @types/react-dom@^19

# UI & Styling
yarn add @heroui/react@^2.7.6 @heroui/toast@^2.0.7 tailwindcss@^3.4.1
yarn add framer-motion@^12.4.2 postcss@^8

# Data Fetching & State
yarn add @tanstack/react-query@^5.66.5 react-hook-form@^7.54.2
yarn add @hookform/resolvers@^4.1.3 nuqs@^2.3.2

# Form Validation & Utils
yarn add zod@^3.24.2 moment@^2.30.1 jwt-decode@^4.0.0

# Internationalization
yarn add i18next@^25.0.0 react-i18next@^15.4.1 i18next-browser-languagedetector@^8.0.4

# Utilities
yarn add lodash.pick@^4.4.0 lodash.orderby@^4.6.0 html-react-parser@^5.2.2
yarn add swiper@^11.2.2 react-to-print@^3.1.0

# Build & Development Tools
yarn add -D eslint@^9 eslint-config-next@15.1.6 prettier@^3.5.0
yarn add -D @svgr/webpack@^8.1.0 husky@^9.1.7
```

### 2. Configuration Files Setup

#### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/pages": ["./src/modules/page"],
      "@/components": ["./src/modules/components"],
      "@/config": ["./src/modules/config"],
      "@/assets": ["./src/modules/assets"],
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### Next.js Configuration

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  webpack(config) {
    // SVG handling
    const fileLoaderRule = config.module.rules.find(
      (rule: { test: { test: (arg0: string) => any } }) =>
        rule.test?.test?.('.svg'),
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        use: ['@svgr/webpack'],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;
    return config;
  },
};

export default nextConfig;
```

#### Tailwind Configuration

```typescript
// tailwind.config.ts
import { heroui } from '@heroui/theme';
import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{html,js,ts,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      prefix: 'heroui',
      addCommonColors: false,
      defaultTheme: 'light',
      defaultExtendTheme: 'light',
      themes: {
        light: {
          layout: {
            radius: {
              small: '0.375rem',
              medium: '0.75rem',
            },
            fontSize: {
              tiny: '0.625rem',
              small: '0.75rem',
              medium: '1rem',
              large: '1.25rem',
            },
            borderWidth: {
              medium: '0.063rem',
            },
          },
          colors: {
            background: '#FFFFFF',
            foreground: '#25262B',
            default: {
              DEFAULT: '#33669A',
              200: '#CED4DA',
            },
            primary: {
              DEFAULT: '#33669A',
              50: '#33669A',
              foreground: '#FFFFFF',
            },
            secondary: {
              DEFAULT: '#5C5F66',
            },
            // Custom theme colors
          },
        },
      },
    }),
  ],
} satisfies Config;
```

### 3. Directory Structure Creation

```bash
# Create the modular directory structure
mkdir -p src/{modules,pages}
mkdir -p src/modules/{_api,assets/{png,svg},common/{components,hooks,utils,interfaces,mixins},config,fonts,i18next,layouts,pages,values}
mkdir -p src/pages/{auth/{login,profile,sign-up},brands,cart,checkout,content,home,product,search}

# Create essential files
touch src/modules/_api/{baseFetch.ts,apiUrl.ts,apiType.ts}
touch src/modules/common/components/{BaseButton.tsx,BaseInput.tsx,Box.tsx}
touch src/modules/config/{routeLinks.ts,navLinks.ts}
touch src/modules/layouts/LayoutDefault.tsx
touch src/pages/{_app.tsx,_document.tsx,providers.tsx,globals.css}
```

### 4. Essential File Templates

#### Base App Structure

```tsx
// src/pages/_app.tsx
import LayoutDefault from '@/modules/layouts/LayoutDefault';
import { AppProps } from 'next/app';
import './globals.css';
import type { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';
import Providers from './providers';

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const RootLayout = ({ Component, pageProps }: AppPropsWithLayout) => {
  return (
    <Providers>
      <LayoutDefault>
        <Component {...pageProps} />
      </LayoutDefault>
    </Providers>
  );
};

export default RootLayout;
```

#### Provider Setup

```tsx
// src/pages/providers.tsx
'use client';

import { HeroUIProvider } from '@heroui/react';
import { ToastProvider } from '@heroui/toast';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { Fragment } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Fragment>
      <NuqsAdapter>
        <HeroUIProvider>
          <ToastProvider />
          {children}
        </HeroUIProvider>
      </NuqsAdapter>
    </Fragment>
  );
}
```

## Development Workflow

### 1. Feature Development Process

```
1. Create route in src/pages/[feature]/
2. Create screen component in src/modules/pages/[Feature]/
3. Add API client methods in src/modules/_api/apiClient[Domain].ts
4. Create reusable components in src/modules/common/components/
5. Add route constant to routeLinks.ts
6. Test and iterate
```

### 2. Component Development

```tsx
// Template for new base component
import { extendVariants, [HeroUIComponent] } from '@heroui/react';

const Base[Component] = extendVariants([HeroUIComponent], {
  variants: {
    // Define variants
  },
  defaultVariants: {
    // Set defaults
  },
});

export default Base[Component];
```

### 3. API Client Template

```typescript
// Template for new API client
'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { baseFetch } from './baseFetch';
import { ApiUrl, ApiUrlParams } from './apiUrl';

export const useQuery[Feature] = (params: QueryParams) => {
  return useQuery({
    queryKey: [ApiUrl.[FEATURE], params],
    queryFn: async () => {
      const url = /* construct URL */;
      const res = await baseFetch(url);
      const json = await res.json();

      if (!res.ok) {
        throw Error(json?.message || '');
      }

      return json.data;
    },
  });
};

export const useMutate[Action] = () => {
  return useMutation({
    mutationKey: [ApiUrl.[FEATURE_ACTION]],
    mutationFn: async (params) => {
      // Implementation
    },
    onSuccess: () => {
      // Invalidate related queries
    },
  });
};
```

## Environment Configuration

### 1. Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL_API=https://api.example.com/
NEXT_PUBLIC_API_VERSION=1.0
NEXT_PUBLIC_DEV_DEBUG=true
```

### 2. Development vs Production

- **Development**: Hot reload, debug tools, verbose logging
- **Production**: Static export, optimized bundles, error handling
- **Staging**: Production build with development APIs

## Code Quality & Standards

### 1. ESLint Configuration

```json
// eslint.config.mjs
export default [
  {
    extends: ["next/core-web-vitals", "next/typescript"],
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    }
  }
];
```

### 2. Prettier Configuration

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### 3. Git Hooks Setup

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "yarn lint && yarn fix_prettier"
    }
  }
}
```

## Deployment Configuration

### 1. Static Export Build

```bash
# Build for static hosting
yarn build

# Serve locally for testing
yarn start_spa
```

### 2. CI/CD Pipeline (Azure)

```yaml
# azure-pipelines.yml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '22.x'
  - script: yarn install
  - script: yarn lint
  - script: yarn build
  - task: PublishBuildArtifacts@1
    inputs:
      pathtoPublish: 'out'
      artifactName: 'static-site'
```

### 3. Hosting Considerations

- **CDN Deployment**: Static files can be deployed to any CDN
- **SPA Routing**: Configure server for client-side routing
- **Environment Variables**: Set during build time for static export

## Testing Strategy

### 1. Component Testing

```bash
# Add testing dependencies
yarn add -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
```

### 2. E2E Testing

```bash
# Add Playwright for E2E testing
yarn add -D @playwright/test
```

### 3. API Testing

- Mock API responses during development
- Test API integration with actual endpoints
- Validate error handling scenarios

## Performance Optimization

### 1. Bundle Analysis

```bash
# Analyze bundle size
yarn add -D @next/bundle-analyzer
```

### 2. Image Optimization

- Use Next.js Image component where possible
- Optimize SVG assets
- Implement lazy loading for images

### 3. Code Splitting

- Automatic page-level code splitting
- Dynamic imports for large components
- Lazy load non-critical features

This template provides a solid foundation for building scalable Next.js e-commerce applications with modern development practices, type safety, and performance optimization.
