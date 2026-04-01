# Styling & UI Library Conventions

## CSS Architecture

### 1. Tailwind CSS Configuration

```typescript
// tailwind.config.ts
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
  plugins: [heroui({...})],
}
```

### 2. HeroUI Theme Configuration

```typescript
heroui({
  prefix: 'heroui',
  addCommonColors: false,
  defaultTheme: 'light',
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
      },
      colors: {
        background: '#FFFFFF',
        foreground: '#25262B',
        primary: {
          DEFAULT: '#33669A',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#5C5F66',
        },
        custom: {
          white: '#ffffff',
          728: '#728FB6',
          ced: '#CED4DA',
          336: '#33669A',
          // ... more custom colors
        },
      },
    },
  },
});
```

## Component Styling Patterns

### 1. Base Component Extensions

All UI components extend HeroUI with custom variants:

```tsx
// BaseButton.tsx
const BaseButton = extendVariants(Button, {
  variants: {
    color: {
      secondary: 'bg-transparent text-secondary',
      primary: 'bg-primary text-white',
      white: 'bg-white text-primary',
    },
    variant: {
      bordered: 'bg-transparent border-1 border-primary text-primary',
      light: 'bg-transparent border-none !min-w-1 !px-0 text-primary',
      shaded: 'shadow-sm border-secondary bg-transparent text-secondary',
    },
    size: {
      md: 'text-md px-3 rounded-small',
      lg: 'text-2xl px-8 py-8 rounded-small',
      xl: 'py-6 px-6 text-xl font-bold rounded-small',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
});
```

### 2. Input Component Pattern

```tsx
// BaseInput.tsx
const BaseInput = extendVariants(Input, {
  variants: {
    color: {
      primary: {
        mainWrapper: 'mt-0',
        input:
          'indent-[1rem] focus:text-secondary text-medium placeholder:text-custom-adb',
        label: 'text-inherit text-medium top-6 !translate-y-[-3.25rem]',
        errorMessage: 'text-medium',
      },
    },
    size: {
      md: {
        inputWrapper: 'p-0 h-[2.375rem] rounded-md',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
});
```

## Global CSS Patterns

### 1. Responsive Scaling

```css
/* globals.css */
html {
  font-size: calc(var(--scale-width) * 16px);
}

:root {
  --scale-width: 1;
  --scroll-bar-width: 0;
}
```

### 2. Component-Specific Classes

```css
/* Swiper Customization */
.swiper-slide {
  display: flex !important;
  flex-direction: column;
  align-items: stretch;
  height: auto !important;
}

.swiper-button-prev,
.swiper-button-next {
  width: 1.4rem;
  height: 2rem;
  color: hsl(var(--heroui-custom-adb)) !important;
}

/* Pagination Bullets */
.sliderDefault .swiper-pagination-bullet.swiper-pagination-bullet-active {
  background-color: hsl(var(--heroui-default));
}
```

### 3. Utility Classes

```css
/* Icons */
.icon24 {
  width: 1.5rem;
  height: 1.5rem;
}

/* Text Effects */
.heading-text-shadow {
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.4);
}

/* Custom Borders */
.diagonal-line {
  background: linear-gradient(
    to top left,
    transparent calc(50% - 1px),
    black,
    transparent calc(50% + 1px)
  );
}
```

## Layout & Spacing Conventions

### 1. Container Padding

```tsx
// LayoutDefault.tsx - Responsive padding pattern (existing implementation)
// Note: For new components, prefer Col instead of raw div
<Header className="px-2 lg:px-[9.531rem] h-[6rem]" />
<div className="px-2 sm:px-2 lg:px-[9.531rem] flex flex-col flex-1">
  {children}
</div>
<Footer className="px-0 lg:px-[9.531rem] pt-[3.75rem] pb-[1.875rem]" />
```

### 2. Responsive Breakpoints

- **Mobile**: `< 640px` (sm breakpoint)
- **Tablet**: `640px - 1024px`
- **Desktop**: `> 1024px` (lg breakpoint)
- **Large Desktop**: Custom scaling at 1920px base width

### 3. Spacing Scale

- **Small**: `0.375rem` (6px)
- **Medium**: `0.75rem` (12px)
- **Large**: `1.5rem` (24px)
- **XLarge**: `3rem` (48px)

## Asset Management

### 1. SVG Handling

```typescript
// next.config.ts - SVG as React components
webpack(config) {
  config.module.rules.push(
    // SVG with ?url suffix = file URL
    {
      test: /\.svg$/i,
      resourceQuery: /url/,
    },
    // SVG without suffix = React component
    {
      test: /\.svg$/i,
      resourceQuery: { not: [/url/] },
      use: ['@svgr/webpack'],
    },
  );
}
```

### 2. Asset Export Pattern

```typescript
// src/modules/assets/index.ts
import IcArrowDownSvg from './svg/ic_arrow_down.svg';
import imgBgBrandSrc from './svg/img_bg_brand.svg?url';
import LogoSvg from './svg/logo.svg';

export {
  IcArrowDownSvg, // React component
  imgBgBrandSrc, // URL string
  LogoSvg, // React component
};
```

## Animation & Transitions

### 1. Framer Motion Integration

```tsx
// Used in modal and page transitions
import { motion } from 'framer-motion';
```

### 2. CSS Transitions

```css
/* Body transitions for font scaling */
body {
  transition-[font-size] duration-[font-size]-1000 ease-in-out;
}

/* Loading states */
.transition-delay-150 {
  transition-delay: 150ms;
}
```

## Print Styles

```css
@media print {
  html,
  body {
    height: 100vh;
    padding: 10px;
    font-size: 12px;
  }
}
```

## Best Practices

### 1. Color Usage

- Use HeroUI theme colors via HSL variables
- Custom colors defined in theme configuration
- Consistent color naming convention (primary, secondary, custom-\*)

### 2. Component Variants

- Always define `defaultVariants` in extendVariants
- Use descriptive variant names (bordered, light, shaded)
- Group related styling in compound variants

### 3. Responsive Design

- Mobile-first approach with Tailwind
- Use consistent breakpoint names (sm, md, lg)
- Implement responsive padding/margins consistently

### 4. Performance

- Unoptimized images for static export
- CSS-in-JS avoided in favor of Tailwind classes
- Minimal custom CSS outside of component-specific needs
