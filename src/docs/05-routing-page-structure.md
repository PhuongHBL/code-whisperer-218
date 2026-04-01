# Routing & Page Structure Patterns

## Next.js Page Router Architecture

### 1. Directory Structure

```
src/
├── pages/                   # Next.js routing directory
│   ├── _app.tsx            # Root application component
│   ├── _document.tsx       # HTML document configuration
│   ├── globals.css         # Global styles
│   ├── index.tsx           # Homepage route (/)
│   ├── providers.tsx       # App-level providers
│   └── [routes]/           # Nested route structure
└── modules/
    └── pages/              # Screen components (business logic)
        └── [Feature]/
            └── [Feature]Screen.tsx
```

### 2. Page-to-Screen Mapping Pattern

```tsx
// src/pages/product/[slug]/index.tsx
import ProductDetailScreen from '@/modules/pages/Product/ProductDetailScreen';

export default function Page() {
  return <ProductDetailScreen />;
}
```

This pattern separates:

- **Pages Directory**: Only routing concerns
- **Modules/Pages**: Business logic and UI components

## Route Configuration

### 1. Static Routes

```
pages/
├── index.tsx               → /
├── home/index.tsx          → /home
├── brands/index.tsx        → /brands
├── search/index.tsx        → /search
└── cart/
    └── shopping-cart/
        └── index.tsx       → /cart/shopping-cart
```

### 2. Dynamic Routes

```
pages/
├── product/
│   └── [slug]/
│       └── index.tsx       → /product/[slug]
├── productlist/
│   ├── brand/
│   │   └── [slug]/
│   │       └── index.tsx   → /productlist/brand/[slug]
│   └── category/
│       └── [id]/
│           └── index.tsx   → /productlist/category/[id]
└── content/
    ├── [id]/
    │   └── index.tsx       → /content/[id]
    └── faq/
        └── [id]/
            └── index.tsx   → /content/faq/[id]
```

### 3. Nested Route Groups

```
pages/
├── auth/
│   ├── login/
│   │   └── index.tsx       → /auth/login
│   ├── profile/
│   │   ├── index.tsx       → /auth/profile
│   │   ├── layout.tsx      → Profile layout
│   │   ├── add-more-account/
│   │   │   └── index.tsx   → /auth/profile/add-more-account
│   │   ├── my-order/
│   │   │   ├── index.tsx   → /auth/profile/my-order
│   │   │   └── [id]/
│   │   │       └── index.tsx → /auth/profile/my-order/[id]
│   │   └── wishlist/
│   │       └── index.tsx   → /auth/profile/wishlist
│   └── sign-up/
│       ├── index.tsx       → /auth/sign-up
│       ├── corporate/
│       │   └── index.tsx   → /auth/sign-up/corporate
│       ├── individual/
│       │   └── index.tsx   → /auth/sign-up/individual
│       └── verification/
│           └── index.tsx   → /auth/sign-up/verification
```

## Route Links Configuration

### 1. Route Constants

```typescript
// routeLinks.ts
export enum RouteLinks {
  index = '/',
  homeIndexScreen = '/home',
  searchIndexScreen = '/search',

  // Brand routes
  brandIndexScreen = '/brands',
  brandDetailScreen = '/productlist/brand/:slug',

  // Category routes
  categoryDetail = '/productlist/category/:id',

  // Product routes
  productDetailScreen = '/product/:id',

  // Profile routes
  profileIndexScreen = '/auth/profile',
  profileAddMoreAccountScreen = '/auth/profile/add-more-account',
  profileWishlistScreen = '/auth/profile/wishlist',
  profileMyOrderScreen = '/auth/profile/my-order',
  profileMyOrderDetailScreen = '/auth/profile/my-order/:id',

  // Content routes
  faqIndexScreen = '/content/faq',
  faqDetailScreen = '/content/faq/:id',
  aboutUsIndexScreen = '/content/about',
  contactUsIndexScreen = '/content/contact-us',

  // Auth routes
  signUpIndexScreen = '/auth/sign-up',
  signUpVerificationScreen = '/auth/sign-up/verification',
  signUpIndividualScreen = '/auth/sign-up/individual',
  signUpCorporateScreen = '/auth/sign-up/corporate',
  loginIndexScreen = '/auth/login',

  // Checkout routes
  checkoutIndexScreen = '/cart/shopping-cart',
  checkoutDeliveryScreen = '/checkout/delivery',
  checkoutPaymentScreen = '/checkout/payment',
  checkoutConfirmationScreen = '/checkout/confirmation/:id',
}
```

### 2. Route Parameters Type Safety

```typescript
// Type-safe route parameters
export type RouteLinksParams = {
  loginIndexScreen: { callbackURL: string };
  categoryDetail: { id: string };
  brandDetailScreen: { id: string };
  productDetailScreen: { id: string };
  profileMyOrderDetailScreen: { id: string };
  faqDetailScreen: { id: string };
  checkoutConfirmationScreen: { id: string };
};
```

### 3. Navigation Utilities

```typescript
// UtilsNavigation.ts
const UtilsNavigation = {
  generatePath: <T extends keyof RouteLinksParams>(
    path: RouteLinks,
    params: RouteLinksParams[T],
  ): string => {
    let result = path as string;

    Object.entries(params).forEach(([key, value]) => {
      result = result.replace(`:${key}`, encodeURIComponent(value as string));
    });

    return result;
  },

  createSearchParams: (params: Record<string, any>): URLSearchParams => {
    return new URLSearchParams(
      Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, String(value)]),
    );
  },
};
```

## App Configuration

### 1. Root App Component

```tsx
// _app.tsx
import LayoutDefault from '@/modules/layouts/LayoutDefault';
import { AppProps } from 'next/app';
import './globals.css';
import type { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';
import Providers from './providers';
import i18n from '@/modules/i18next';
import { I18nextProvider } from 'react-i18next';

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const RootLayout = ({ Component, pageProps }: AppPropsWithLayout) => {
  return (
    <I18nextProvider i18n={i18n}>
      <Providers>
        <LayoutDefault>
          <Component {...pageProps} />
        </LayoutDefault>
      </Providers>
    </I18nextProvider>
  );
};

export default RootLayout;
```

### 2. Document Configuration

```tsx
// _document.tsx
import { Html, Main, NextScript, Head } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head title="StarBucks">
        <meta name="title" content="StarBucks" />
        <meta name="keywords" content="StarBucks,LCS" />
        <meta name="description" content="StarBucks Description" />

        {/* Prevent zoom on mobile */}
        {!process.env.NEXT_PUBLIC_DEV_DEBUG && (
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          />
        )}

        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <body className="transition-[font-size] duration-[font-size]-1000 ease-in-out">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

### 3. Provider Configuration

```tsx
// providers.tsx
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

## Layout System

### 1. Default Layout Structure

```tsx
// LayoutDefault.tsx
export default function LayoutDefault({ children }: PropsWithChildren) {
  const { width } = useWindowSize();
  const isMobile = useMemo(() => width <= MOBILE_SCREEN, [width]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthContext.Consumer>
          {authProps => (
            <ProviderGlobal value={{ isMobile: isMobile, ...authProps }}>
              <Suspense fallback={<LoadingIndicator />}>
                <div>
                  <Header className="px-2 lg:px-[9.531rem] h-[6rem]" />
                  <div className="px-2 sm:px-2 lg:px-[9.531rem] flex flex-col flex-1 sm:min-h-[calc(100vh-10rem)]">
                    {children}
                  </div>
                  <Footer className="px-0 lg:px-[9.531rem] pt-[3.75rem] pb-[1.875rem] select-none" />
                </div>

                {/* Global Modals */}
                <ModalChildComponent ref={refModalChildComponent} />
                <ModalRequestLogin ref={refModalLoginRequest} />
              </Suspense>
            </ProviderGlobal>
          )}
        </AuthContext.Consumer>
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

### 2. Responsive Layout Constants

```typescript
const BASE_WIDTH = 1920;
const MEDIUM_SCREEN = 576;
export const MOBILE_SCREEN = 640;

// Dynamic scaling based on screen size
const onResize = () => {
  const updateScaleVarCss = (value: number) => {
    document.documentElement.style.setProperty(
      '--scale-width',
      value.toString(),
    );
  };

  let scaleValue = 1;

  if (window.innerWidth < MEDIUM_SCREEN) {
    updateScaleVarCss(scaleValue);
    return;
  }

  if (window.innerWidth < BASE_WIDTH) {
    scaleValue =
      window.innerWidth / BASE_WIDTH >= 0.5
        ? window.innerWidth / BASE_WIDTH
        : 0.5;
    updateScaleVarCss(scaleValue);
    return;
  }

  updateScaleVarCss(scaleValue);
};
```

## Navigation Patterns

### 1. Programmatic Navigation

```tsx
// Using Next.js router
import { useRouter } from 'next/router';

const Component = () => {
  const router = useRouter();

  const navigateToProduct = (productId: string) => {
    const path = UtilsNavigation.generatePath(RouteLinks.productDetailScreen, {
      id: productId,
    });
    router.push(path);
  };

  const navigateWithQuery = () => {
    router.push({
      pathname: RouteLinks.searchIndexScreen,
      query: { keyword: 'electronics', category: 'phones' },
    });
  };
};
```

### 2. URL State Management

```tsx
// Using nuqs for URL state
import { useQueryState } from 'nuqs';

export default function ProductListScreen() {
  const [category, setCategory] = useQueryState('category', {
    defaultValue: '',
  });
  const [sortBy, setSortBy] = useQueryState('sortBy', { defaultValue: 'name' });
  const [priceMin, setPriceMin] = useQueryState('priceMin', {
    defaultValue: '0',
  });

  // URL automatically updates when state changes
  // ✅ Use direct calls instead of creating functions
  // setCategory(newValue) - call directly in components
}
```

### 3. Breadcrumb Navigation

```tsx
// BaseBreadCrumbs.tsx usage
interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function ProductDetailScreen() {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: RouteLinks.homeIndexScreen },
    { label: 'Products', href: RouteLinks.productListScreen },
    { label: product?.name || 'Product Detail' },
  ];

  return (
    <Box>
      <BaseBreadCrumbs items={breadcrumbs} />
      {/* Product content */}
    </Box>
  );
}
```

## Static Export Configuration

### 1. Next.js Config

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true, // Fix dynamic routes with trailing slash
  images: { unoptimized: true },

  webpack(config) {
    // SVG handling configuration
    // ... webpack rules for SVG components
    return config;
  },
};
```

### 2. Static Generation Considerations

- **No Server-Side Rendering**: All pages pre-generated at build time
- **Client-Side Routing**: Navigation handled by Next.js router
- **API Routes**: Not available in static export (use external APIs)
- **Dynamic Routes**: Require trailing slash for proper routing

## Authentication & Protected Routes

### 1. Route Protection Pattern

```tsx
// Screen component with auth check
export default function ProfileScreen() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (authContext.isGuest) {
      router.push({
        pathname: RouteLinks.loginIndexScreen,
        query: { callbackURL: window.location.pathname },
      });
    }
  }, [authContext.isGuest, router]);

  if (authContext.isGuest) {
    return <LoadingIndicator />;
  }

  return <ProfileContent />;
}
```

### 2. Login Redirect Flow - Function Minimalism

```tsx
// Login component with callback handling - follow YAGNI principle
export default function LoginScreen() {
  const router = useRouter();
  const { callbackURL } = router.query;

  return (
    <Col className="login-screen">
      <LoginForm
        onSuccess={() => {
          // TODO: Should create function for redirect logic - performance tuning
          const redirectTo =
            (callbackURL as string) || RouteLinks.homeIndexScreen;
          router.push(redirectTo);
        }}
      />
    </Col>
  );
}
```

## Best Practices

### 1. Route Organization

- **Group Related Routes**: Use nested directories for related pages
- **Consistent Naming**: Use descriptive, kebab-case route names
- **Type Safety**: Define route parameters with TypeScript
- **SEO Friendly**: Use meaningful URL structures

### 2. Navigation Performance

- **Prefetching**: Use Next.js Link for automatic prefetching
- **Code Splitting**: Pages automatically code-split by Next.js
- **Loading States**: Implement loading indicators for navigation

### 3. State Management

- **URL State**: Use URL for shareable/bookmarkable state
- **Session State**: Use Context for user session
- **Persistent State**: Use localStorage for client preferences

### 4. Error Handling

- **404 Pages**: Custom 404 page for missing routes
- **Error Boundaries**: Catch and handle routing errors
- **Fallbacks**: Provide fallback content for failed loads
