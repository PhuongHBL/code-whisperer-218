/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL for fleet API (no trailing slash), e.g. https://be.webapp01.hblab.dev/pd/ */
  readonly VITE_API_BASE_URL?: string;
  /** Auth API host (no trailing slash), e.g. https://be.webapp01.hblab.dev — see `src/docs/apiResponse/login.md` */
  readonly VITE_AUTH_API_BASE_URL?: string;
  /** Miroshark chat API origin (no trailing slash), e.g. https://be.webapp01.hblab.dev — see `src/docs/apiResponse/microFish.md` */
  readonly VITE_MICRO_FISH_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
