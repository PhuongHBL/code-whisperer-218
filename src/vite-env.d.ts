/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL for fleet API (no trailing slash), e.g. http://172.16.52.27:8080/pd/ */
  readonly VITE_API_BASE_URL?: string;
  /** Auth API host (no trailing slash), e.g. http://172.16.52.27:8080 — see `src/docs/apiResponse/login.md` */
  readonly VITE_AUTH_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
