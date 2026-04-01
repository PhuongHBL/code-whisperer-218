# API Architecture & Data Flow Patterns

## API Client Architecture

### 1. Base Fetch Configuration

```typescript
// baseFetch.ts - Centralized API handling
export const baseFetch = async <apiUrl extends ApiUrl>(
  input: string | URL | globalThis.Request | apiUrl,
  init?: RequestInit,
  options?: {
    formData?: boolean;
    publicAPI?: boolean | undefined;
  },
): Promise<Response> => {
  const url = process.env.NEXT_PUBLIC_API_BASE_URL_API + input;
  const authToken = localStorage.getItem(ELocalStorageKey.AUTH_TOKEN);

  const fetchRequest = await fetch(url, {
    ...init,
    headers: {
      ...(!options?.formData && { 'Content-Type': 'application/json' }),
      ...init?.headers,
      ...(!options?.publicAPI &&
        !!authToken && {
          Authorization: `Bearer ${authToken}`,
        }),
    },
  });

  // Global error handling
  if (fetchRequest.status === 401) {
    // Handle session expiry
    refModalLoginRequest?.current?.onOpen(/* ... */);
    localStorage.removeItem(ELocalStorageKey.AUTH_TOKEN);
  }

  return fetchRequest;
};
```

### 2. API Client Pattern - Simplified Naming Convention

Each domain has its own API client with simplified naming. Domain is implicit from the file name:

```typescript
// apiClientAuth.ts - Domain is clear from filename
// Use useMutation[Action] instead of useMutation[Domain][Action]

export const useMutationSignIn = () => {
  return useMutation({
    mutationKey: [ApiUrl.AUTH_LOGIN],
    mutationFn: async (params: ApiUrlParams[ApiUrl.AUTH_LOGIN]) => {
      const payload: typeof params & BaseParams = {
        'api-version': process.env.NEXT_PUBLIC_API_VERSION,
        ...params,
      };

      const url = joinTextNoSpace(ApiUrl.AUTH_LOGIN);
      const res = await baseFetch(
        url,
        {
          body: JSON.stringify(payload),
          method: 'POST',
        },
        { publicAPI: true },
      );

      const json: ModelBaseDetailResponse<UserData> = await res.json();

      if (!res.ok) {
        throw Error(json?.message || '');
      }

      return json;
    },
    onSuccess: data => {
      // Handle success, invalidate related queries
      queryClient.invalidateQueries({
        queryKey: [ApiUrl.CART_GET_ACTIVE_CART_ID],
      });
    },
  });
};

// Other examples:
// useMutationCreate()     instead of useMutationAuthCreate()
// useMutationUpdate()     instead of useMutationAuthUpdate()
// useMutationDelete()     instead of useMutationAuthDelete()

// apiClientBook.ts
export const useMutationCreate = () => {
  return useMutation({
    mutationFn: (params: ApiUrlParams[ApiUrl.BOOK_CREATE]) =>
      UtilsApi.post<ModelBook>(ApiUrl.BOOK_CREATE, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ApiUrl.BOOK_LIST] });
    },
  });
};

export const useMutationUpdate = () => {
  return useMutation({
    mutationFn: ({
      id,
      ...params
    }: { id: string } & ApiUrlParams[ApiUrl.BOOK_UPDATE]) =>
      UtilsApi.put<ModelBook>(`${ApiUrl.BOOK_UPDATE}/${id}`, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ApiUrl.BOOK_LIST] });
    },
  });
};

// Usage: apiClientBook.useMutationCreate(), apiClientBook.useMutationUpdate()
// Domain is clear from import: import * as apiClientBook from '@/modules/_api/apiClientBook';
```

## API Client Organization

### 1. File Structure

```
_api/
├── baseFetch.ts              # Core fetch wrapper
├── apiUrl.ts                 # URL constants & types
├── apiType.ts                # TypeScript interfaces
├── utilsApi.ts               # API utility functions
├── apiClient[Domain].ts      # Domain-specific clients
└── utils[Domain].ts          # Domain utilities
```

### 2. Domain-Specific Clients

- `apiClientAuth.ts` - Authentication & user management
- `apiClientProduct.ts` - Product catalog operations
- `apiClientCart.ts` - Shopping cart functionality
- `apiClientAddress.ts` - Address/location services
- `apiClientBrand.ts` - Brand information
- `apiClientCategory.ts` - Product categories
- `apiClientCheckout.ts` - Checkout process & order management
- `apiClientContentPage.ts` - CMS content pages

## TanStack Query Patterns

### 1. Query Hooks

```typescript
export const useQueryAuthCurrentUser = ({
  accessToken,
  withShippingAddress = false,
}: {
  accessToken?: string;
  withShippingAddress?: boolean;
}) => {
  return useQuery({
    enabled: !!accessToken,
    queryKey: [
      ApiUrl.AUTH_CUSTOMER_GET_CURRENT_USER,
      accessToken,
      withShippingAddress,
    ],
    queryFn: async () => {
      const queryParams = {
        'api-version': process.env.NEXT_PUBLIC_API_VERSION,
      };

      const url = joinTextNoSpace(
        ApiUrl.AUTH_CUSTOMER_GET_CURRENT_USER,
        '?',
        createSearchParams(objectFilterNull(queryParams)).toString(),
      );

      const res = await baseFetch(url);
      const json: ModelBaseDetailResponse<IUser> = await res.json();

      if (!res.ok) {
        throw Error(json?.message || '');
      }

      return json.data;
    },
  });
};
```

### 2. Mutation Hooks - Updated Naming Convention

```typescript
// apiClientAddress.ts - Simplified naming
export const useMutationCreateShipping = () => {
  return useMutation({
    mutationKey: [ApiUrl.AUTH_CUSTOMER_CREATE_SHIPPING_ADDRESS],
    mutationFn: async (
      params: ApiUrlParams[ApiUrl.AUTH_CUSTOMER_CREATE_SHIPPING_ADDRESS],
    ) => {
      const payload = {
        'api-version': process.env.NEXT_PUBLIC_API_VERSION,
        ...params,
      };

      const url = joinTextNoSpace(ApiUrl.AUTH_CUSTOMER_CREATE_SHIPPING_ADDRESS);
      const res = await baseFetch(url, {
        body: JSON.stringify(payload),
        method: 'POST',
      });

      const json: ModelBaseDetailResponse<unknown> = await res.json();

      if (!res.ok) {
        addToast({
          title: json.errors
            ? Object.values(json.errors)?.join('. ')
            : json.message,
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
      const accessToken = localStorage.getItem(ELocalStorageKey.AUTH_TOKEN);
      queryClient.invalidateQueries({
        queryKey: [ApiUrl.AUTH_CUSTOMER_GET_CURRENT_USER, accessToken, true],
      });
    },
  });
};

// Standard CRUD mutations pattern:
export const useMutationCreate = () => {
  /* ... */
}; // Create operations
export const useMutationUpdate = () => {
  /* ... */
}; // Update operations
export const useMutationDelete = () => {
  /* ... */
}; // Delete operations

// Domain-specific actions can use descriptive names:
export const useMutationCreateShipping = () => {
  /* ... */
}; // Create shipping address
export const useMutationUpdateBilling = () => {
  /* ... */
}; // Update billing address
export const useMutationDeleteAddress = () => {
  /* ... */
}; // Delete any address
```

### 3. Infinite Query Pattern

```typescript
export const useInfiniteQueryProductByCategory = (
  params: ProductFilterParams,
) => {
  return useInfiniteQuery({
    queryKey: [ApiUrl.PRODUCT_BY_CATEGORY, JSON.stringify(params)],
    queryFn: async ({ pageParam = 1 }) => {
      const queryParams = {
        ...params,
        PageIndex: pageParam,
        PageSize: 20,
        'api-version': process.env.NEXT_PUBLIC_API_VERSION,
      };

      const url = joinTextNoSpace(
        ApiUrl.PRODUCT_BY_CATEGORY,
        '?',
        createSearchParams(objectFilterNull(queryParams)).toString(),
      );

      const res = await baseFetch(url);
      const json: ModelBaseListResponse<ModelBaseProduct[]> = await res.json();

      return json;
    },
    getNextPageParam: lastPage => {
      return lastPage.hasNextPage ? lastPage.pageIndex + 1 : undefined;
    },
  });
};
```

## Data Flow Patterns

### 1. Global State Management

```typescript
// providers.tsx - React Context for global state
export const AuthContext = createContext<IAuthContext>({});
export const ProviderGlobal = createContext<
  {
    isMobile: boolean;
  } & IAuthContext
>({ isMobile: false });

export const ProviderProduct = createContext<{
  sortOptions: ModelBaseOption[] | undefined;
  filterCategoryListNavInfo: NavInfo[] | undefined;
  filterWithCategories: boolean;
  filterWithBrands: boolean;
  // ... more product-related state
} | null>(null);
```

### 2. Query Client Configuration

```typescript
// LayoutDefault.tsx
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 20000,
      refetchOnWindowFocus: false,
    },
  },
});
```

### 3. URL State Management

```typescript
// useProductFilterParams.ts
export default function useProductFilterParams() {
  const [priceMin, setPriceMin] = useQueryState('priceMin', {
    defaultValue: '0',
  });
  const [priceMax, setPriceMax] = useQueryState('priceMax', {
    defaultValue: '1000',
  });
  const [CategoryCodes, setCategoryCodes] = useQueryState('CategoryCodes', {
    defaultValue: '',
  });
  const [BrandCodes, setBrandCodes] = useQueryState('BrandCodes', {
    defaultValue: '',
  });
  const [SortBy, setSortBy] = useQueryState('SortBy', { defaultValue: '' });

  const countFilter =
    (!!CategoryCodes ? 1 : 0) + BrandCodes?.split(',')?.filter(i => i)?.length;

  return {
    priceMin,
    setPriceMin,
    priceMax,
    setPriceMax,
    CategoryCodes,
    setCategoryCodes,
    BrandCodes,
    setBrandCodes,
    countFilter,
    SortBy,
    setSortBy,
  };
}
```

## Error Handling Patterns

### 1. Global Error Handling

```typescript
// baseFetch.ts
if (fetchRequest.status === 401 && refModalLoginRequest?.current) {
  refModalLoginRequest?.current?.onOpen(
    t('common:Please_sign_in_to_continue'),
    {
      title: t('common:Session_has_been_expired'),
      closeTitle: t('common:Close'),
      confirmTitle: t('common:Login'),
      additionalOnConfirmDefault() {
        window.location.href = RouteLinks.loginIndexScreen;
      },
    },
  );
  localStorage.removeItem(ELocalStorageKey.AUTH_TOKEN);
  throw Error();
}

// Server errors
if (fetchRequest.status >= 500) {
  addToast({
    title: `API internal server error ${url}`,
    color: 'danger',
  });
}
```

### 2. Mutation Error Handling

```typescript
mutationFn: async (params) => {
  // ... API call

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
```

## API Utility Patterns

### 1. Content Selector Utilities

```typescript
// utilsApi.ts
const UtilsApi = {
  additionalInfoByCode: (
    modelBaseAdditionalInfo: ModelBaseAdditionalInfo[] | undefined,
    add: { code?: string; label?: string },
  ): ModelBaseAdditionalInfo | undefined => {
    if (add?.code) {
      return modelBaseAdditionalInfo?.find(i => i?.code == add.code);
    }
    return modelBaseAdditionalInfo?.find(i => i?.columnLabel == add.label);
  },

  contentSelector: <T>(
    modelBaseContent: (ModelBasePage & T)[] | undefined,
    content: ContentSelectorBase,
  ): (ModelBasePage & T) | undefined => {
    return modelBaseContent?.find(
      i =>
        i.contentSelector == content ||
        i.code == content ||
        i.contentCode == content,
    );
  },
};
```

### 2. String & URL Utilities

```typescript
// UtilsString.ts
export const joinTextNoSpace = (...strings: (string | undefined)[]) => {
  return strings?.map(string => safeString(string))?.join('') ?? '';
};

export const getTextByLocale = (
  contentWithLocales?: ModelBaseLocale | undefined,
) => {
  if (!contentWithLocales) return '';
  return contentWithLocales?.lang1 || contentWithLocales?.Lang1 || '';
};

export const getFormattedPrice = (modelBasePrice?: ModelBasePrice) => {
  if (!modelBasePrice) return '';
  return (
    modelBasePrice?.formatted?.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') || ''
  );
};
```

## Best Practices

### 1. Query Key Management

- Use consistent query key patterns: `[ApiUrl, ...params]`
- Include all relevant parameters in query keys
- Use JSON.stringify for complex objects

### 2. Mutation Side Effects

- Always invalidate related queries on success
- Use `onSuccess`, `onError`, and `onSettled` appropriately
- Show user feedback with toast notifications

### 3. Loading States

- Use `isLoading`, `isError`, `isPending` from TanStack Query
- Implement optimistic updates where appropriate
- Handle network errors gracefully

### 4. Authentication Flow

- Token stored in localStorage
- Automatic guest token creation
- JWT expiration handling
- Modal-based re-authentication

### 5. Type Safety

- Strong typing for all API responses
- Use TypeScript interfaces for request/response shapes
- Type-safe URL parameter handling
