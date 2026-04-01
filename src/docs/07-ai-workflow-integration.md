# AI Workflow Integration Guidelines

## Overview

This documentation serves as a comprehensive template for integrating AI workflows into the Next.js e-commerce project. The patterns and conventions documented here can be used to train AI systems, generate boilerplate code, and maintain consistency across new projects.

## AI-Assisted Development Workflow

### 1. Project Analysis Phase

When an AI system encounters this project, it should:

1. **Read the documentation** in the `/docs` folder to understand:
   - Project architecture and patterns
   - Component conventions and styling
   - API client patterns and data flow
   - Routing and page structure
   - Development setup requirements

2. **Analyze the codebase structure**:

   ```bash
   # Key directories to examine
   src/modules/_api/          # API patterns
   src/modules/common/        # Reusable components
   src/modules/pages/         # Screen components
   src/pages/                 # Next.js routing
   src/modules/config/        # Configuration files
   ```

3. **Identify patterns from existing code**:
   - Base component extension patterns
   - API client naming conventions
   - State management approaches
   - Form handling patterns

### 2. Code Generation Guidelines

#### Component Generation - Use Structured Components

```tsx
// AI should generate components using Col/Row/TextPrimary instead of raw HTML:
'use client';

import { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProviderGlobal } from '@/pages/providers';
import Col from '@/modules/common/components/Col';
import Row from '@/modules/common/components/Row';
import TextPrimary from '@/modules/common/components/TextPrimary';

export default function [ComponentName]Screen() {
  // 1. Hooks
  const { t } = useTranslation(['common']);
  const contextGlobal = useContext(ProviderGlobal);

  // 2. State
  const [localState, setLocalState] = useState(initialValue);

  // 3. API Calls (if needed)
  const useQuery[Data]Object = useQuery[Data]({
    // query parameters
  });

  // 4. Computed values
  const computedValue = useMemo(() => {
    return /* computation */;
  }, [dependencies]);

  // 5. Event handlers - use inline functions with TODO comments

  // 6. Render - ALWAYS use structured components
  return (
    <Col className="[component-name] space-y-6">
      <Row className="items-center justify-between">
        <TextPrimary
          text={t('Page Title')}
          className="text-2xl font-bold"
        />
      </Row>

      <Col className="content-area">
        {/* Use Col/Row for layout, TextPrimary for text */}
        <TextPrimary text={computedValue} />
      </Col>

      {/* Never use raw <div>, <p>, <span> */}
    </Col>
  );
}
```

#### API Client Generation - Simplified Naming Convention

```typescript
// AI should generate API clients with simplified naming - domain is implicit from filename:
// apiClient[Domain].ts - e.g., apiClientBook.ts, apiClientProduct.ts

export const useQuery[Entity] = (params: QueryParams) => {
  return useQuery({
    queryKey: [ApiUrl.[ENTITY_LIST], JSON.stringify(params)],
    queryFn: async () => {
      const queryParams = {
        ...params,
        'api-version': process.env.NEXT_PUBLIC_API_VERSION,
      };

      const url = joinTextNoSpace(
        ApiUrl.[ENTITY_LIST],
        '?',
        createSearchParams(objectFilterNull(queryParams)).toString(),
      );

      const res = await baseFetch(url);
      const json: ModelBaseDetailResponse<EntityType[]> = await res.json();

      if (!res.ok) {
        throw Error(json?.message || '');
      }

      return json.data;
    },
  });
};

// Standard CRUD mutations - no domain repetition needed
export const useMutationCreate = () => {
  return useMutation({
    mutationKey: [ApiUrl.[ENTITY_CREATE]],
    mutationFn: async (params: MutationParams) => {
      const payload = {
        'api-version': process.env.NEXT_PUBLIC_API_VERSION,
        ...params,
      };

      const url = joinTextNoSpace(ApiUrl.[ENTITY_CREATE]);
      const res = await baseFetch(url, {
        body: JSON.stringify(payload),
        method: 'POST',
      });

      const json: ModelBaseDetailResponse<EntityType> = await res.json();

      if (!res.ok) {
        addToast({
          title: json.errors ? Object.values(json.errors)?.join('. ') : json.message,
          color: 'danger',
        });
        throw Error(json.message);
      }

      addToast({
        title: json.message,
        color: json.succeeded ? 'success' : 'danger',
      });

      return json;
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: [ApiUrl.[ENTITY_LIST]],
      });
    },
  });
};

export const useMutationUpdate = () => {
  return useMutation({
    mutationFn: ({ id, ...params }: { id: string } & MutationParams) =>
      UtilsApi.put<EntityType>(`${ApiUrl.[ENTITY_UPDATE]}/${id}`, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ApiUrl.[ENTITY_LIST]] });
    },
  });
};

export const useMutationDelete = () => {
  return useMutation({
    mutationFn: (id: string) =>
      UtilsApi.delete(`${ApiUrl.[ENTITY_DELETE]}/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ApiUrl.[ENTITY_LIST]] });
    },
  });
};

// Usage: import * as apiClient[Domain] from '@/modules/_api/apiClient[Domain]';
// apiClient[Domain].useMutationCreate(), apiClient[Domain].useMutationUpdate(), etc.
```

### 3. AI Code Generation Rules

#### Naming Conventions

- **Components**: PascalCase ending with appropriate suffix (`Screen`, `Component`, `Modal`)
- **Hooks**: camelCase starting with `use` (`useProductFilter`, `useCartTransference`)
- **API Clients**: `useQuery[Entity]` and `useMutation[Action]` pattern (domain implicit from filename)
- **Utilities**: `Utils[Domain]` pattern (`UtilsForm`, `UtilsNavigation`)
- **Types/Interfaces**: PascalCase with `I` prefix for interfaces (`IUser`, `IFormData`)

#### API Client Naming Rules

- **Domain implicit**: `apiClientBook.useMutationCreate()` not `useMutationBookCreate()`
- **Standard CRUD**: `useMutationCreate()`, `useMutationUpdate()`, `useMutationDelete()`
- **Descriptive actions**: `useMutationCreateShipping()`, `useMutationUpdateBilling()` for domain-specific operations
- **Query patterns**: `useQueryBooks()`, `useQueryBookDetail()`, `useQueryBooksByCategory()`

#### File Organization

```
When generating new features, AI should create:
src/modules/pages/[Domain]/
├── [Domain]ListScreen.tsx          # Main list/index screen component
├── [Domain]DetailScreen.tsx        # Detail view screen component
├── components/                     # Domain-specific components ONLY
│   ├── [Domain]Modal.tsx          # Common modal component (top level)
│   ├── [Domain]Form.tsx           # Common form component (top level)
│   ├── list/                      # Components for list/grid contexts
│   │   ├── [Domain]Card.tsx
│   │   └── [Domain]Grid.tsx
│   └── detail/                    # Components for detail/single contexts
│       ├── [Domain]Info.tsx
│       └── [Domain]Actions.tsx
└── hooks/                         # Domain-specific hooks
    ├── use[Domain]Filter.ts
    └── use[Domain]Actions.ts

# Component Architecture Rules:
# - Domain components: NEVER put in /modules/common/components/
# - Common components: /modules/common/components/ ONLY if used across multiple domains
# - Base components: Always in /modules/common/components/
# - Abstract folder names: Use 'list', 'detail', 'form' instead of specific names
```

#### Import Patterns

```tsx
// Standard import order AI should follow:
// 1. React imports - avoid useCallback (function minimalism)
import { useState, useEffect, useMemo } from 'react';

// 2. Next.js imports
import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';

// 3. Third-party libraries
import { useTranslation } from 'react-i18next';
import { useForm, useWatch } from 'react-hook-form';

// 4. Internal API imports
import { useQuery[Entity], useMutate[Action] } from '@/modules/_api/apiClient[Domain]';

// 5. Internal component imports
import BaseButton from '@/modules/common/components/BaseButton';
import Box from '@/modules/common/components/Box';

// 6. Internal utility imports
import { RouteLinks } from '@/modules/config/routeLinks';
import UtilsForm from '@/modules/common/utils/UtilsForm';

// 7. Context imports
import { ProviderGlobal } from '@/pages/providers';
```

### 4. AI Decision Making Framework

#### When to Create New Components - Don't Hesitate

AI should create components liberally in these cases:

**Basic Components (common/components) - Always Create:**

```tsx
// ✅ CREATE: Simple structural components without hesitation
<Spacer />        // For consistent spacing
<Container />     // For page containers
<Card />          // For card layouts
<Stack />         // For vertical stacking
<Grid />          // For grid layouts
<Section />       // For page sections

// Pattern: Simple, no business logic, high reuse
export default function BasicComponent(props: PropsWithChildren & { className?: string }) {
  return (
    <element className={`default-styles ${props.className || ''}`} data-component="BasicComponent">
      {props.children}
    </element>
  );
}
```

**Domain Components (pages/[Domain]/components) - Create Liberally:**

```tsx
// ✅ CREATE: Any domain-specific component without hesitation
<BookCard />           // Even if used in one place initially
<BookFilters />        // Domain-specific filtering
<BookActions />        // Domain-specific actions
<ProductGallery />     // Product image display
<UserProfile />        // User information display
<OrderStatus />        // Order status indicator

// AI should NOT hesitate - create components for:
// - Single use cases that might grow
// - Logical separation of concerns
// - Clear component boundaries
// - Testable units of functionality
```

**Common Components (common/components) - When Cross-Domain:**

```tsx
// ✅ CREATE: When used across multiple domains
<SearchInput />        // Used in Book, Product, Order searches
<LoadingState />       // Used across all domains
<ErrorBoundary />      // Used across all screens
<ConfirmModal />       // Used for confirmations everywhere
```

#### When to Extend Base Components

AI should extend HeroUI components when:

- Creating variants of existing UI elements
- Customizing theme-specific styling
- Adding project-specific functionality
- Maintaining design system consistency

#### API Client Organization

AI should create new API client files when:

- Adding a new business domain (User, Product, Order, etc.)
- The file would exceed 500 lines
- The domain has distinct authentication/permission requirements

### 5. Error Handling Patterns for AI

#### Function Minimalism - CRITICAL AI Rule

```tsx
// ✅ AI should ALWAYS avoid creating functions unless absolutely necessary
// ✅ AI should ALWAYS use Col/Row/TextPrimary instead of raw HTML
export default function BookListScreen() {
  const { data: books } = useQueryBooks();
  const deleteMutation = useMutationDelete();

  return (
    <Col className="book-list-screen space-y-6">
      {/* ✅ Direct reference without wrapper function */}
      <form onSubmit={form.handleSubmit(onSubmit)}>{/* Form content */}</form>

      <Row className="header-actions items-center justify-between">
        <TextPrimary text={t('Books')} className="text-2xl font-bold" />

        {/* ✅ Anonymous inline function with TODO for performance tuning */}
        <BaseButton
          onClick={() => {
            // TODO: Move to useCallback if performance optimization needed
            refModalChildComponent.current?.onOpen(
              <ModalContent
                id={book.id}
                onCancel={() => refModalChildComponent.current?.onClose()}
              />,
            );
          }}>
          {t('Add Book')}
        </BaseButton>
      </Row>

      {/* ✅ Pass inline functions to components */}
      <BookGrid className="books-grid">
        {books?.map(book => (
          <BookCard
            key={book.id}
            book={book}
            onDelete={(book: ModelBook) => {
              // TODO: Should create function for delete logic - performance tuning
              if (window.confirm(t('Are you sure?'))) {
                deleteMutation.mutate(book.id);
              }
            }}
          />
        ))}
      </BookGrid>

      {/* ✅ Always render same structure - handle states via props */}
      <Col className="book-content">
        <TextPrimary
          text={
            error
              ? t('Error loading books')
              : books?.length > 0
                ? t('Books found')
                : t('No books')
          }
          className="text-center py-8"
        />
        <BaseButton isDisabled={!!error || !books}>{t('Reload')}</BaseButton>
      </Col>
    </Col>
  );
}

// ❌ AI should NEVER create these functions:
const handleEdit = () => {
  /* avoid */
};
const handleClick = () => {
  /* avoid */
};
const handleDelete = (id: string) => {
  /* avoid */
};

// ❌ AI should NEVER use conditional rendering that causes mount/unmount:
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage />;
if (!data) return <EmptyState />;
```

#### Independent Modal Content Pattern

```tsx
// ✅ AI should create self-managing modal content components
export default function ModalContent({
  id, // Abstract naming - pass ID, not data
  onSuccess,
  onCancel, // Required function - no safety checking needed
}: ModalContentProps) {
  // Component handles its own data fetching
  const { data } = apiClientBook.useQueryBookDetail(id || '', {
    enabled: !!id,
  });

  // Component handles its own mutations
  const useMutationCreate = apiClientBook.useMutationCreate();
  const useMutationUpdate = apiClientBook.useMutationUpdate();

  const form = useForm<FormData>({
    defaultValues: {
      title: safeString(book?.title),
      author: safeString(book?.author),
    },
  });

  // Handle form submission internally with unified error/success flow
  const handleSubmit = form.handleSubmit(async formData => {
    try {
      if (bookId) {
        await useMutationUpdate.mutateAsync({ id: bookId, ...formData });
      } else {
        await useMutationCreate.mutateAsync(formData);
      }
      refModalChildComponent.current?.onClose();
      onSuccess?.();
    } catch (error) {
      // TanStack Query handles error display automatically
      console.error('Error saving book:', error);
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Form
        title={data?.title ?? undefined}
        author={data?.author ?? undefined}
        formTitle="Edit"
        onSubmit={handleSubmit}
        onCancel={onCancel}
      />
      <BaseButton type="submit">
        {bookId ? t('Update') : t('Create')}
      </BaseButton>
    </form>
  );
}
```

#### API Error Handling

```tsx
// AI should use consistent error handling in API clients
if (!res.ok) {
  addToast({
    title: json.errors ? Object.values(json.errors)?.join('. ') : json.message,
    color: 'danger',
  });
  throw Error(json.message);
}
```

### 6. Performance Optimization Guidelines for AI

#### Memoization Patterns - Use Sparingly

```tsx
// ✅ AI should use memoization ONLY for expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// ❌ AI should AVOID creating functions with useCallback
// const handleCallback = useCallback(() => {
//   doSomething(dependency);
// }, [dependency]);

// ✅ Use inline functions instead with TODO for performance tuning
<BaseButton
  onClick={() => {
    // TODO: Should create function for callback logic - performance tuning
    doSomething(dependency);
  }}>
  {t('Action')}
</BaseButton>;
```

#### Query Optimization

```tsx
// AI should implement proper query key management
const queryKey = [
  ApiUrl.ENTITY_ACTION,
  JSON.stringify(params),
  userContext?.userId, // Include user context when relevant
];
```

### 7. Testing Guidelines for AI

#### Component Testing

```tsx
// AI should generate tests following this pattern
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ComponentName from './ComponentName';

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
      staleTime: 5000,
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

describe('ComponentName', () => {
  it('should render correctly', () => {
    renderWithProviders(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interaction', () => {
    renderWithProviders(<ComponentName />);
    fireEvent.click(screen.getByRole('button', { name: 'Action' }));
    // Assert expected behavior
  });
});
```

### 8. AI Context Awareness

When working with this project, AI should be aware of:

1. **Business Context**: E-commerce platform with B2B and B2C features
2. **User Types**: Guest users, individual members, corporate members, Ariba users
3. **Key Features**: Product catalog, shopping cart, checkout, user profiles, orders
4. **Internationalization**: Support for multiple languages using i18next
5. **Responsive Design**: Mobile-first approach with Tailwind CSS
6. **Static Export**: All pages must be compatible with static generation

### 9. Code Review Checklist for AI

Before generating code, AI should verify:

- [ ] Follows established naming conventions
- [ ] Uses appropriate TypeScript types
- [ ] Uses `Col`/`Row`/`TextPrimary` instead of raw HTML elements
- [ ] Creates components liberally without hesitation when appropriate
- [ ] Implements function minimalism (no unnecessary function definitions)
- [ ] Implements proper error handling
- [ ] Includes loading states for async operations
- [ ] Uses consistent import ordering
- [ ] Follows component structure patterns
- [ ] Implements responsive design considerations
- [ ] Uses established utility functions
- [ ] Maintains accessibility standards
- [ ] Optimizes for performance
- [ ] Places components in correct directories (basic/base/common/domain)

### 10. Documentation Standards

When AI generates new code, it should also:

1. **Update relevant documentation** if patterns change
2. **Add JSDoc comments** for complex functions
3. **Include usage examples** for new components
4. **Document API changes** in appropriate files
5. **Update type definitions** as needed

This AI workflow integration ensures that any AI system working with this codebase will maintain consistency, follow established patterns, and produce high-quality code that integrates seamlessly with the existing architecture.
