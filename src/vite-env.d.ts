/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL for fleet API (no trailing slash), e.g. http://172.16.52.46:8000 */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
